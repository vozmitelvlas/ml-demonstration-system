package ru.etu.mldemonstrationapp.mainservice.components;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.etu.mldemonstrationapp.mainservice.dto.ModelUserLimitResponse;
import ru.etu.mldemonstrationapp.mainservice.service.AdminUserService;
import ru.etu.mldemonstrationapp.mainservice.utils.UserModalCompositeKey;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiterComponent {

    private final Map<UserModalCompositeKey, BucketConfig> bucketConfigs = new ConcurrentHashMap<>();

    @Autowired
    private AdminUserService adminUserService;

    private static class BucketConfig {
        int rps;
        Bucket bucket;

        BucketConfig(int rps, Bucket bucket) {
            this.rps = rps;
            this.bucket = bucket;
        }
    }

    public boolean tryAcquire(Long userId, Long modelId) {
        long timestamp = System.currentTimeMillis();
        System.out.println("Request received at: " + timestamp);
        var responses = adminUserService.getAllUserLimits(userId);
        ModelUserLimitResponse modelUserLimitResponse = responses.stream()
                .filter(lim -> lim.modelId().equals(modelId))
                .findFirst()
                .orElse(null);

        if (modelUserLimitResponse != null) {
            int currentRps = modelUserLimitResponse.limit().getRps();
            System.out.println("rps - " + currentRps);
            UserModalCompositeKey key = new UserModalCompositeKey(userId, modelId);
            BucketConfig config = bucketConfigs.compute(key, (k, existingConfig) -> {
                if (existingConfig == null || existingConfig.rps != currentRps) {
                    Bucket newBucket = createBucket(currentRps);
                    return new BucketConfig(currentRps, newBucket);
                }
                return existingConfig;
            });

            boolean result = config.bucket.tryConsume(1);
            System.out.println("Try acquire for user: " + userId + ", model: " + modelId + ": " + result);
            return result;
        }
        return true;
    }

    private Bucket createBucket(int rps) {
        Bandwidth limit = Bandwidth.classic(rps, Refill.intervally(rps, Duration.ofSeconds(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}