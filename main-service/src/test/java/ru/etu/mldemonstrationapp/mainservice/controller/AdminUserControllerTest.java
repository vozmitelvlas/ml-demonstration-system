package ru.etu.mldemonstrationapp.mainservice.controller;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.etu.mldemonstrationapp.mainservice.configuration.WithMockTokenAdmin;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@Sql(scripts = {"/sql/test-data.sql"})
class AdminUserControllerTest extends AbstractControllerTest {

    private static final String PATH_PREFIX = "/api/admin/users";

    @Test
    @WithMockTokenAdmin
    void getUsers() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX);
        System.out.println();
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$").isArray(),
                jsonPath("$[0].login").value("admin"),
                jsonPath("$[1].login").value("user")
        );
    }

    @Test
    @WithMockTokenAdmin
    void getUserById() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/1");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.userId").value(1),
                jsonPath("$.login").value("admin")
        );
    }

    @Test
    @WithMockTokenAdmin
    void createUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .content("""
                        {
                          "login": "newuser",
                          "password": "password123",
                          "email": "newuser@example.com",
                          "firstName": "New",
                          "lastName": "User",
                          "organizationId": 1,
                          "emailConfirm": true,
                          "roles": ["USER"],
                          "active": true
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isCreated(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.login").value("newuser"),
                jsonPath("$.userId").isNumber(),
                jsonPath("$.email").value("newuser@example.com"),
                jsonPath("$.firstName").value("New"),
                jsonPath("$.lastName").value("User"),
                jsonPath("$.patronymic").doesNotExist(),
                jsonPath("$.description").doesNotExist(),
                jsonPath("$.organization.organizationId").value(1L),
                jsonPath("$.roles[0]").value("USER")
        );
    }

    @Test
    @WithMockTokenAdmin
    void createUserWithDuplicateLogin() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .header(HttpHeaders.ORIGIN, "http://localhost:5173")
                .content("""
                        {
                          "login": "admin",
                          "password": "password123",
                          "email": "newuser@example.com",
                          "firstName": "New",
                          "lastName": "User",
                          "organizationId": 1,
                          "emailConfirm": true,
                          "roles": ["ADMIN"],
                          "active": true
                        }
                        """);

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isConflict())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockTokenAdmin
    void createUserWithInvalidEmail() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login": "new_user",
                          "password": "password123",
                          "email": "invalid-email",
                          "firstName": "New",
                          "lastName": "User",
                          "organizationId": 1,
                          "emailConfirm": true,
                          "roles": ["ADMIN"],
                          "active": true
                        }
                        """);

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockTokenAdmin
    void updateUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "firstName": "NewName",
                          "lastName": "NewLastName",
                          "organizationId": 3,
                          "roles": ["USER"]
                        }
                        """);


        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.userId").value(1),
                jsonPath("$.firstName").value("NewName"),
                jsonPath("$.lastName").value("NewLastName"),
                jsonPath("$.patronymic").doesNotExist(),
                jsonPath("$.description").doesNotExist(),
                jsonPath("$.organization.organizationId").value(3L),
                jsonPath("$.roles[0]").value("USER")
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateUserNotFound() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/999")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "firstName": "NewName",
                          "lastName": "NewLastName",
                          "organizationId": 3,
                          "roles": ["USER"]
                        }
                        """);

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockTokenAdmin
    void deleteUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX + "/2");
        this.mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenAdmin
    void getAllUserLimits() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/2/limits");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$").isArray(),
                jsonPath("$[0].modelId").isNumber(),
                jsonPath("$[0].modelName").isString()
        );
    }

    @Test
    @WithMockTokenAdmin
    void getAllUserLimitsForNonExistentUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/999/limits");

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockTokenAdmin
    void updateUserLimit() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/3/models/1/limit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "requestsPerWeek": 50,
                          "rps": 2
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.modelId").value(1),
                jsonPath("$.modelName").value("DenseNet"),
                jsonPath("$.limit.requestsPerWeek").value(50),
                jsonPath("$.limit.rps").value(2)
        );
    }

    @Test
    @WithMockTokenAdmin
    void updateUserLimitForNonExistentModel() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/1/models/999/limit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "requestsPerWeek": 50,
                          "rps": 2
                        }
                        """);

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockTokenAdmin
    void updateUserLimitForNonExistentUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/999/models/1/limit")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "requestsPerWeek": 50,
                          "rps": 2
                        }
                        """);

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }

    @Test
    @WithMockTokenAdmin
    void setAccessRight() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/2/active")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "isActive": false
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenAdmin
    void setAccessRightForNonExistentUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/999/active")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "isActive": false
                        }
                        """);

        this.mockMvc.perform(requestBuilder)
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON));
    }
}