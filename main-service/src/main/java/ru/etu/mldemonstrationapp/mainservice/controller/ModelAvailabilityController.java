package ru.etu.mldemonstrationapp.mainservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import ru.etu.mldemonstrationapp.mainservice.service.ModelAvailabilityService;

import java.util.List;

@RestController
@RequestMapping("/api/triton-models")
public class ModelAvailabilityController {

    private final ModelAvailabilityService availabilityService;

    public ModelAvailabilityController(ModelAvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<String>> getAvailableModels() {
        List<String> availableModels = availabilityService.getAvailableModels();
        return ResponseEntity.ok(availableModels);
    }
}
