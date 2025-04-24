package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.etu.mldemonstrationapp.mainservice.entity.ModelVersion;
import ru.etu.mldemonstrationapp.mainservice.entity.Task;
import ru.etu.mldemonstrationapp.mainservice.entity.TaskStatus;
import ru.etu.mldemonstrationapp.mainservice.entity.User;
import ru.etu.mldemonstrationapp.mainservice.repository.TaskRepository;
import ru.etu.mldemonstrationapp.mainservice.service.TaskService;
import ru.etu.mldemonstrationapp.mainservice.service.UserService;

import java.time.Duration;
import java.time.Instant;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Override
    public Task getTask(UUID taskId) {
        return taskRepository.findById(taskId).orElseThrow(() -> new NoSuchElementException("Не удалось найти задачу с ID %s".formatted(taskId.toString())));
    }

    @Transactional
    @Override
    public Task createTask(Long userId, ModelVersion modelVersion) {
        User user = userService.getUserById(userId);
        Task task = new Task();

        task.setStatus(TaskStatus.RUNNING);
        task.setExecutionTime(0.0);
        task.setCreatedAt(Instant.now());
        task.setUser(user);
        task.setModelVersion(modelVersion);

        return taskRepository.save(task);
    }

    @Transactional
    @Override
    public void markSuccess(UUID taskId, String outputPath) {
        Task task = getTask(taskId);
        task.setStatus(TaskStatus.SUCCEED);
        task.setOutputPath(outputPath);
        task.setCompletedAt(Instant.now());
        task.setExecutionTime(Duration.between(task.getCreatedAt(), task.getCompletedAt()).toMillis() / 1000.);
        taskRepository.save(task);

    }

    @Transactional
    @Override
    public void markFailed(UUID taskId, String errorMessage) {
        Task task = getTask(taskId);
        task.setStatus(TaskStatus.FAILED);
        task.setErrorDescription(errorMessage);
        task.setCompletedAt(Instant.now());
        task.setExecutionTime(Duration.between(task.getCreatedAt(), task.getCompletedAt()).toMillis() / 1000.);
        taskRepository.save(task);
    }

    @Override
    public void deleteOutputPath(UUID taskId) {
        Task task = getTask(taskId);
        task.setOutputPath(null);
        taskRepository.save(task);
    }

}