package ru.etu.mldemonstrationapp.mainservice.admin.models;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.admin.models.dto.CreateModelVersionRequest;
import ru.etu.mldemonstrationapp.mainservice.models.Model;
import ru.etu.mldemonstrationapp.mainservice.models.dto.ModelVersionResponse;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/models")
@RequiredArgsConstructor
public class AdminModelController {
    private final AdminModelsService adminModelsService;

    @GetMapping
    public List<Model> getModels() {
        return adminModelsService.getModels();
    }

    @GetMapping("/{id}")
    public Model getModel(@PathVariable Long id) {
        return adminModelsService.getModel(id);
    }

    @GetMapping("/{modelId}/versions/{versionId}")
    public ModelVersionResponse getModelVersion(@PathVariable Long modelId, @PathVariable Long versionId) {
        return adminModelsService.getModelVersion(versionId);
    }

    @GetMapping("/versions")
    public List<ModelVersionResponse> getModelsVersions() {
        return adminModelsService.getModelsVersions();
    }

    @PostMapping
    public ResponseEntity<Model> registerModel(@RequestBody CreateModelRequest createModelRequest,
                                               UriComponentsBuilder uriComponentsBuilder) {
        Model model = adminModelsService.createModel(createModelRequest);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/models/{modelId}")
                        .build(Map.of("modelId", model.getModelId()))
                )
                .body(model);
    }

    @PostMapping("/{id}/versions")
    public ResponseEntity<ModelVersionResponse> createModelVersion(@PathVariable Long id,
                                                                   @RequestBody CreateModelVersionRequest createModelVersionRequest,
                                                                   UriComponentsBuilder uriComponentsBuilder) {
        ModelVersionResponse modelVersion = adminModelsService.createModelVersion(id, createModelVersionRequest);
        return ResponseEntity
                .created(uriComponentsBuilder
                        .replacePath("/api/admin/models/{modelId}/versions/{versionId}")
                        .build(Map.of(
                                "modelId", modelVersion.modelId(),
                                "versionId", modelVersion.versionId())
                        )
                )
                .body(modelVersion);

    }

}


