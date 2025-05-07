package ru.etu.mldemonstrationapp.mainservice.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import ru.etu.mldemonstrationapp.mainservice.clients.monai.WorkflowManagerClient;
import ru.etu.mldemonstrationapp.mainservice.dto.CreateModelRequest;
import ru.etu.mldemonstrationapp.mainservice.entity.*;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelRepository;
import ru.etu.mldemonstrationapp.mainservice.repository.ModelVersionRepository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminModelsServiceImplTest {
    @InjectMocks
    private AdminModelsServiceImpl service;

    @Mock
    private ModelRepository modelRepository;

    @Mock
    private ModelVersionRepository modelVersionRepository;

    @Mock
    private WorkflowManagerClient workflowManagerClient;

    @Test
    void createModelWithTritonRuntime() {
        CreateModelRequest dto = new CreateModelRequest(
                "TestModel",
                "http://triton:8000/v2/models/TestModel",
                null,
                ModelProblemType.NLP,
                ModelRuntime.TRITON_INFERENCE_SERVER,
                null
        );
        when(modelRepository.existsByName("TestModel")).thenReturn(false);
        when(modelRepository.save(any(Model.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Model model = service.createModel(dto);

        assertEquals("TestModel", model.getName());

        assertEquals(ModelRuntime.TRITON_INFERENCE_SERVER, model.getModelInfo().getRuntime());
        assertEquals(ModelProblemType.NLP, model.getModelInfo().getProblemType());

        assertEquals(1, model.getVersions().size());
        assertEquals("1.0", model.getModelVersions().get(0).getVersionName());
        assertNull(model.getModelVersions().get(0).getDescription());
        assertEquals("http://triton:8000/v2/models/TestModel", model.getModelVersions().get(0).getUri());

        assertEquals(100, model.getLimit().getRps());
        assertEquals(100, model.getLimit().getRequestsPerWeek());

        verify(workflowManagerClient, never()).registerWorkflow(any());
    }

    @Test
    void createModelWithMonaiRuntime() {
        CreateModelRequest dto = new CreateModelRequest(
                "TestModel",
                null,
                "new monai model",
                ModelProblemType.MEDICAL_IMAGE_SEGMENTATION,
                ModelRuntime.MONAI_DEPLOY,
                Map.of("config", "fdfsd")
        );
        when(modelRepository.existsByName("TestModel")).thenReturn(false);
        when(modelRepository.save(any(Model.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(workflowManagerClient.registerWorkflow(anyMap())).thenReturn(new WorkflowManagerClient.WorkflowRegisterResponse("workflow-id-example"));

        Model model = service.createModel(dto);

        assertEquals("TestModel", model.getName());

        assertEquals(ModelRuntime.MONAI_DEPLOY, model.getModelInfo().getRuntime());
        assertEquals(ModelProblemType.MEDICAL_IMAGE_SEGMENTATION, model.getModelInfo().getProblemType());

        assertEquals(1, model.getVersions().size());
        assertEquals("1.0", model.getModelVersions().get(0).getVersionName());
        assertEquals("new monai model", model.getModelVersions().get(0).getDescription());
        assertNull(model.getModelVersions().get(0).getUri());

        assertEquals(100, model.getLimit().getRps());
        assertEquals(100, model.getLimit().getRequestsPerWeek());

        assertEquals("workflow-id-example", model.getOtherData().get("workflowId"));
    }

    @Test
    void createModelWithDuplicateName() {
        CreateModelRequest dto = new CreateModelRequest(
                "TestModel",
                null,
                "new monai model",
                ModelProblemType.MEDICAL_IMAGE_SEGMENTATION,
                ModelRuntime.MONAI_DEPLOY,
                Map.of("config", "fdfsd")
        );
        when(modelRepository.existsByName(dto.name())).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.createModel(dto));

        assertEquals(409, exception.getStatusCode().value());
        verify(modelRepository, never()).save(any());
        verify(workflowManagerClient, never()).registerWorkflow(any());
    }

    @Test
    void createModelWithMissingWorkflowConfig() {
        CreateModelRequest dto = new CreateModelRequest(
                "TestModel",
                null,
                "new monai model",
                ModelProblemType.MEDICAL_IMAGE_SEGMENTATION,
                ModelRuntime.MONAI_DEPLOY,
                null
        );

        when(modelRepository.existsByName(anyString())).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> service.createModel(dto));

        assertEquals(400, exception.getStatusCode().value());
        verify(workflowManagerClient, never()).registerWorkflow(any());
    }


    @Test
    void deleteModelVersionWhenOnlyOneVersionAndMonai() {
        Long versionId = 100L;
        Long modelId = 10L;

        Model model = new Model();
        model.setModelId(modelId);
        var modelInfo = new ModelInfo(modelId, model, ModelRuntime.MONAI_DEPLOY, ModelProblemType.MEDICAL_IMAGE_SEGMENTATION);
        model.setModelInfo(modelInfo);
        model.setOtherData(Map.of("workflowId", "workflow-id-example"));

        ModelVersion version = new ModelVersion();
        version.setModelVersionId(versionId);
        version.setModel(model);
        model.setModelVersions(List.of(version));

        when(modelVersionRepository.findById(versionId)).thenReturn(Optional.of(version));

        service.deleteModelVersion(versionId);

        verify(workflowManagerClient).deleteWorkflow("workflow-id-example");
        verify(modelVersionRepository).delete(version);
        verify(modelRepository).deleteModelIfVersionsListEmpty(modelId);
    }

    @Test
    void deleteModelVersionWithTritonRuntime() {
        Long versionId = 1L;
        Long modelId = 10L;

        Model model = new Model();
        model.setModelId(modelId);
        var modelInfo = new ModelInfo(modelId, model, ModelRuntime.TRITON_INFERENCE_SERVER, ModelProblemType.NLP);
        model.setModelInfo(modelInfo);

        ModelVersion version = new ModelVersion();
        version.setModelVersionId(versionId);
        version.setModel(model);
        model.setModelVersions(List.of(version));

        when(modelVersionRepository.findById(versionId)).thenReturn(Optional.of(version));

        service.deleteModelVersion(versionId);

        verify(workflowManagerClient, never()).deleteWorkflow(anyString());
        verify(modelVersionRepository).delete(version);
        verify(modelRepository).deleteModelIfVersionsListEmpty(modelId);

    }


    @Test
    void deleteModelVersion_shouldNotDeleteWorkflow_ifModelHasMultipleVersions() {
        Long firstVersionId = 100L;
        Long secondVersionId = 102L;
        Long modelId = 10L;

        Model model = new Model();
        model.setModelId(modelId);
        var modelInfo = new ModelInfo(modelId, model, ModelRuntime.TRITON_INFERENCE_SERVER, ModelProblemType.NLP);
        model.setModelInfo(modelInfo);
        model.setOtherData(Map.of("workflowId", "workflow-id-example"));

        ModelVersion versionToDelete = new ModelVersion();
        versionToDelete.setModelVersionId(firstVersionId);
        versionToDelete.setModel(model);

        ModelVersion secondVersion = new ModelVersion();
        secondVersion.setModelVersionId(secondVersionId);
        model.setModelVersions(List.of(versionToDelete, secondVersion));

        when(modelVersionRepository.findById(firstVersionId)).thenReturn(Optional.of(versionToDelete));

        service.deleteModelVersion(firstVersionId);

        verify(workflowManagerClient, never()).deleteWorkflow(any());
        verify(modelVersionRepository).delete(versionToDelete);
        verify(modelRepository).deleteModelIfVersionsListEmpty(modelId);
    }



    @Test
    void deleteModelVersionWhenModelVersionDoesNotExist() {
        when(modelVersionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> service.deleteModelVersion(123L));

        verify(workflowManagerClient, never()).deleteWorkflow(any());
        verify(modelVersionRepository, never()).delete(any());
    }
}
