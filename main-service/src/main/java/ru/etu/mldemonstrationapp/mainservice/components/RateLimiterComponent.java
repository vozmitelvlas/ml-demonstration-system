package ru.etu.mldemonstrationapp.mainservice.components;

import com.revinate.guava.util.concurrent.RateLimiter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.service.AdminUserService;
import ru.etu.mldemonstrationapp.mainservice.utils.UserModalCompositeKey;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiterComponent {

    private final Map<UserModalCompositeKey, RateLimiter> rateLimiters = new ConcurrentHashMap<>();

    @Autowired
    private AdminUserService adminUserService;

    public boolean tryAcquire(Long userId, Long modelId) {
        var responses = adminUserService.getAllUserLimits(userId);
        ModelUserLimitResponse modelUserLimitResponse = responses.stream()
                .filter(lim -> lim.modelId().equals(modelId))
                .findFirst()
                .orElse(null);


        if (modelUserLimitResponse != null){
            System.out.println("rps - " + modelUserLimitResponse.limit().getRps());
            RateLimiter limiter = getOrCreateRateLimiter(userId, modelId ,modelUserLimitResponse.limit().getRps());
            return limiter.tryAcquire();
        }
        return true;
    }

    private RateLimiter getOrCreateRateLimiter(Long userId, Long modelId, Integer rpsLimit) {
        return rateLimiters.computeIfAbsent(new UserModalCompositeKey(userId, modelId), k-> RateLimiter.create(rpsLimit));
    }
}