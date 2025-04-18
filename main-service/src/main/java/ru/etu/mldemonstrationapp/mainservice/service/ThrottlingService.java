package ru.etu.mldemonstrationapp.mainservice.service;

import ru.etu.mldemonstrationapp.mainservice.entity.Limit;

public interface ThrottlingService {

    Limit getLimitByType(Long userId, Long modelId);

    void checkRequestLimitExceeded(Long modelId, Long userId);
}
