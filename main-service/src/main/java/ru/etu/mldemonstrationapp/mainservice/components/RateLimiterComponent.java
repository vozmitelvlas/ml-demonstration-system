package ru.etu.mldemonstrationapp.mainservice.components;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.etu.mldemonstrationapp.mainservice.entity.UserRpw;
import ru.etu.mldemonstrationapp.mainservice.repository.UserRpwRepository;
import ru.etu.mldemonstrationapp.mainservice.utils.UserModalCompositeKey;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiterComponent {
    private final Map<UserModalCompositeKey, BucketConfig> bucketConfigs = new ConcurrentHashMap<>();
    @Autowired
    UserRpwRepository userRpwRepository;

    private static class BucketConfig {
        int rps;
        Bucket bucket;

        BucketConfig(int rps, Bucket bucket) {
            this.rps = rps;
            this.bucket = bucket;
        }
    }

    public boolean checkRpwLimit(Map<String, Integer> limits, Long userId, Long modelId){
        System.out.println("RPW: " + limits.get("requestsPerWeek"));
        System.out.println("RPS: " + limits.get("rps"));

        Optional<UserRpw> userRpwOptional = userRpwRepository.findByUserUserIdAndModelModelId(userId, modelId);
        if(userRpwOptional.isPresent()){
            UserRpw userRpw = userRpwOptional.get();
            if (userRpwOptional.get().getCurrentRequests() < limits.get("requestsPerWeek")){
                userRpw.setCurrentRequests(userRpw.getCurrentRequests() + 1);

                userRpwRepository.save(userRpw);
                return true;
            }
        }
        return false;
    }

    public boolean checkRpsLimit(Map<String, Integer> limits, Long userId, Long modelId) {
        System.out.println("RPW: " + limits.get("requestsPerWeek"));
        System.out.println("RPS: " + limits.get("rps"));

        int currentRps = limits.get("rps");
        UserModalCompositeKey key = new UserModalCompositeKey(userId, modelId);
        BucketConfig config = bucketConfigs.compute(key, (k, existingConfig) -> {
            if (existingConfig == null || existingConfig.rps != currentRps) {
                Bucket newBucket = createBucket(currentRps);
                return new BucketConfig(currentRps, newBucket);
            }
            return existingConfig;
        });

        return config.bucket.tryConsume(1);
    }

    private Bucket createBucket(int rps) {
        Bandwidth limit = Bandwidth.classic(rps, Refill.intervally(rps, Duration.ofSeconds(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}