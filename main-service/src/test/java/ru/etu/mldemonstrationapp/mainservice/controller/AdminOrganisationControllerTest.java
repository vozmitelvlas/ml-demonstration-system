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
public class AdminOrganisationControllerTest extends AbstractControllerTest {

    private static final String PATH_PREFIX = "/api/admin/organizations";

    @Test
    @WithMockTokenAdmin
    void createOrganization() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "New Organization",
                          "description": "A new organization for testing"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isCreated(),
                header().exists(HttpHeaders.LOCATION),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.organizationId").isNumber(),
                jsonPath("$.name").value("New Organization"),
                jsonPath("$.description").value("A new organization for testing"),
                jsonPath("$.editable").value(true)
        );
    }

    @Test
    @WithMockTokenAdmin
    void createOrganizationDuplicateName() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "Отдел разработки",
                          "description": "Организация для разработчиков моделей"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isConflict(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateOrganization() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "Updated Organization",
                          "description": "Updated description"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.organizationId").value(1),
                jsonPath("$.name").value("Updated Organization"),
                jsonPath("$.description").value("Updated description")
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateOrganizationNotFound() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "Updated Organization",
                          "description": "Updated description"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isNotFound(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenAdmin
    void deleteEmptyOrganization() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX + "/5");
        this.mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenAdmin
    void deleteNonEmptyOrganization() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX + "/2");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isConflict(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenAdmin
    void getAvailableModel() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/4/models");

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$").isArray(),
                jsonPath("$[0].modelId").value(1),
                jsonPath("$[0].modelName").value("DenseNet"),
                jsonPath("$[0].limit.requestsPerWeek").isNumber(),
                jsonPath("$[0].limit.rps").isNumber()
        );
    }

    @Test
    @WithMockTokenAdmin
    void openAccessToModel() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/1/models")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "modelId": 1,
                          "limit": {
                            "requestsPerWeek": 50,
                            "rps": 2
                          }
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isCreated(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.modelId").value(1),
                jsonPath("$.modelName").value("DenseNet"),
                jsonPath("$.limit.requestsPerWeek").value(50),
                jsonPath("$.limit.rps").value(2)
        );
    }

    @Test
    @WithMockTokenAdmin
    void openAccessToNonExistentModel() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/1/models")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "modelId": 999,
                          "limit": {
                            "requestsPerWeek": 50,
                            "rps": 2
                          }
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
                .put(PATH_PREFIX + "/4/models/1/limit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "requestsPerWeek": 100,
                          "rps": 5
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.requestsPerWeek").value(100),
                jsonPath("$.rps").value(5)
        );
    }

    @Test
    @WithMockTokenAdmin
    void closeAccessToModel() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX + "/4/models/1");
        this.mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenUser
    void createOrganizationAsUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "New Organization",
                          "description": "A new organization for testing"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(status().isForbidden());
    }
}
