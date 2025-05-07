package ru.etu.mldemonstrationapp.mainservice.controller;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.etu.mldemonstrationapp.mainservice.configuration.WithMockTokenAdmin;
import ru.etu.mldemonstrationapp.mainservice.configuration.WithMockTokenUser;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@Sql(scripts = {"/sql/test-data.sql"})
public class AdminModelControllerTest extends AbstractControllerTest {
    private static final String PATH_PREFIX = "/api/admin/models";

    @Test
    @WithMockTokenAdmin
    void getModels() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX);
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$").isArray(),
                jsonPath("$[0].modelId").value(1),
                jsonPath("$[0].name").value("DenseNet"),
                jsonPath("$[0].versions").isArray()
        );
    }

    @Test
    @WithMockTokenAdmin
    void getModelById() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/1");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.modelId").value(1),
                jsonPath("$.name").value("DenseNet"),
                jsonPath("$.versions").isArray()
        );
    }

    @Test
    @WithMockTokenAdmin
    void getModelNotFound() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/999");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isNotFound(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenAdmin
    void getModelVersion() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/1/versions/1");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.modelVersionId").value(1),
                jsonPath("$.versionName").value("121"),
                jsonPath("$.uri").value("http://localhost:4000/densenet/121")
        );
    }

    @Test
    @WithMockTokenAdmin
    void getModelsVersions() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/versions");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$").isArray(),
                jsonPath("$[0].modelVersionId").value(1),
                jsonPath("$[0].versionName").value("121"),
                jsonPath("$[1].modelVersionId").value(2),
                jsonPath("$[1].versionName").value("169")
        );
    }

    @Test
    @WithMockTokenAdmin
    void registerModel() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "ResNet",
                          "runtime": "TRITON_INFERENCE_SERVER",
                          "problemType": "MEDICAL_IMAGE_SEGMENTATION",
                          "uri": "http://localhost:4000/resnet/1"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isCreated(),
                header().exists(HttpHeaders.LOCATION),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.modelVersionId").isNumber(),
                jsonPath("$.modelId").value(1001),
                jsonPath("$.versionName").value("1.0"),
                jsonPath("$.uri").value("http://localhost:4000/resnet/1"),
                jsonPath("$.description").doesNotExist()
        );
    }

    @Test
    @WithMockTokenAdmin
    void registerModelDuplicateName() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "DenseNet",
                          "runtime": "TRITON_INFERENCE_SERVER",
                          "uri": "http://localhost:4003/hulumulu/50",
                          "problemType": "IMAGE_CLASSIFICATION"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isConflict(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenAdmin
    void createModelVersion() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/1/versions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "versionName": "269",
                          "uri": "http://localhost:4001/densenet/269"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isCreated(),
                header().exists(HttpHeaders.LOCATION),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.modelVersionId").isNumber(),
                jsonPath("$.versionName").value("269"),
                jsonPath("$.uri").value("http://localhost:4001/densenet/269"),
                jsonPath("$.description").doesNotExist()
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateModelVersion() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/1/versions/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "modelName": "DenseNet",
                          "versionName": "Updated 121",
                          "uri": "http://localhost:4000/densenet/updated-121",
                          "runtime": "MONAI_DEPLOY",
                          "problemType": "MEDICAL_IMAGE_SEGMENTATION"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.versionName").value("Updated 121"),
                jsonPath("$.uri").value("http://localhost:4000/densenet/updated-121"),
                jsonPath("$.description").doesNotExist()
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateModelVersionNotFound() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/1/versions/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "modelName": "DenseNet",
                          "versionName": "Updated 121",
                          "uri": "http://localhost:4000/densenet/updated-121",
                          "runtime": "MONAI_DEPLOY",
                          "problemType": "MEDICAL_IMAGE_SEGMENTATION"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isNotFound(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateModelLimit() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/1/limit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "requestsPerWeek": 100,
                          "rps": 10
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.requestsPerWeek").value(100),
                jsonPath("$.rps").value(10)
        );
    }

    @Test
    @WithMockTokenAdmin
    void deleteModelVersion() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX + "/1/versions/1");
        this.mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenUser
    void deleteModelVersionAsUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX + "/1/versions/1");
        this.mockMvc.perform(requestBuilder).andExpect(status().isForbidden());
    }

}
