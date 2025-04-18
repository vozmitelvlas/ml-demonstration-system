package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.components.RateLimiterComponent;
import ru.etu.mldemonstrationapp.mainservice.entity.Limit;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelOrganizationLimit;
import ru.etu.mldemonstrationapp.mainservice.entity.OrganizationLimitsType;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.exception.RpsLimitException;
import ru.etu.mldemonstrationapp.mainservice.repository.LimitRepository;
import ru.etu.mldemonstrationapp.mainservice.service.ThrottlingService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

@Service
public class ThrottlingServiceImpl implements ThrottlingService {
    @Autowired
    private UserService userService;
    @Autowired
    private LimitRepository limitRepository;
    @Autowired
    private RateLimiterComponent rateLimiterComponent;

    @Override
    public Limit getLimitByType(Long userId, Long modelId) {
        User user = userService.getUserById(userId);
        OrganizationLimitsType limitsType = user.getOrganization().getLimitsType();

        if (limitsType == OrganizationLimitsType.USER_LIMITS) {
            return user.getLimits().stream()
                    .filter(lim -> lim.getModel().getModelId().equals(modelId))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Limit for model ID " + modelId + " not found"));
        }

        return user.getOrganization().getModelsLimits().stream()
                .filter(lim -> lim.modelId().equals(modelId))
                .findFirst()
                .map(limit -> {
                    ModelOrganizationLimit orgLimit = (ModelOrganizationLimit) limit.limit();
                    if (limitsType == OrganizationLimitsType.ORGANIZATION_LIMITS) {
                        return orgLimit;
                    } else if (limitsType == OrganizationLimitsType.MODEL_LIMITS) {
                        return orgLimit.getModel().getLimit();
                    } else {
                        throw new IllegalArgumentException("Unknown limits type: " + limitsType);
                    }
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Limit for modelId " + modelId + " not found"));
    }

    @Override
    public void checkRequestLimitExceeded(Long modelId, Long userId) {
        Limit limit = getLimitByType(userId, modelId);
        if (!rateLimiterComponent.checkRpsLimit(limit, userId, modelId)) {
            throw new RpsLimitException("Превышен лимит запросов в секунду. Доступ временно ограничен.");
        }
        if (!rateLimiterComponent.checkRpwLimit(limit, userId, modelId)) {
            throw new RpsLimitException("Превышен лимит запросов в неделю. Доступ временно ограничен.");
        }
    }
}
