package ru.etu.mldemonstrationapp.mainservice.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.entity.Task;

import java.util.UUID;

@Service
public interface TaskService {
    Task getTask(UUID taskId);

    @Transactional
    Task createTask(Long userId, ModelVersion modelVersion);

    @Transactional
    void markSuccess(UUID taskId, String outputPath);

    @Transactional
    void markFailed(UUID taskId, String errorMessage);

    @Transactional
    void deleteOutputPath(UUID taskId);
}
