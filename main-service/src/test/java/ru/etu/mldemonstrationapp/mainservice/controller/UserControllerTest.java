package ru.etu.mldemonstrationapp.mainservice.controller;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.etu.mldemonstrationapp.mainservice.configuration.WithMockTokenAdmin;
import ru.etu.mldemonstrationapp.mainservice.configuration.WithMockTokenUser;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@Sql(scripts = {"/sql/test-organizations-data.sql", "/sql/test-users-data.sql"})
class UserControllerTest extends AbstractControllerTest {
    private static final String PATH_PREFIX = "/api/users/profile";

    @Test
    @WithMockTokenUser
    void getProfileByUser() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.login").value("user"),
                jsonPath("$.password").doesNotExist()
        );
    }


    @Test
    @WithMockTokenAdmin
    void getProfileByAdmin() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.login").value("admin"),
                jsonPath("$.password").doesNotExist()
        );
    }

    @Test
    @WithMockTokenUser(authorities = {"PASSWORD_RESET"})
    void getProfileWithPasswordResetToken() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX);
        this.mockMvc.perform(requestBuilder).andExpect(status().isForbidden());
    }

    @Test
    void getProfileWithoutAuthentication() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX);
        this.mockMvc.perform(requestBuilder).andExpect(status().isUnauthorized());
    }


    @Test
    @WithMockTokenUser
    void updateProfile() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "firstName" :  "userFirstName",
                          "lastName" :  "userLastName",
                          "patronymic" : "userPatronymic",
                          "description" : "simple description"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.login").value("user"),
                jsonPath("$.firstName").value("userFirstName"),
                jsonPath("$.lastName").value("userLastName"),
                jsonPath("$.patronymic").value("userPatronymic"),
                jsonPath("$.description").value("simple description"),
                jsonPath("$.password").doesNotExist()
        );
    }


    @Test
    @WithMockTokenUser
    void updateProfileWithoutRequiredField() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "lastName" :  "userLastName",
                          "patronymic" : "userPatronymic",
                          "description" : "simple description"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpectAll(
                status().isBadRequest(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenUser
    void updateProfileWithoutOptionalFields() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "firstName" :  "userFirstName",
                          "lastName" :  "userLastName"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.login").value("user"),
                jsonPath("$.firstName").value("userFirstName"),
                jsonPath("$.lastName").value("userLastName"),
                jsonPath("$.patronymic").hasJsonPath(),
                jsonPath("$.description").hasJsonPath(),
                jsonPath("$.password").doesNotExist()
        );
    }

    @Test
    @WithMockTokenUser
    void updateProfileWithBlankFirstAndLastNames() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "firstName" : "",
                          "lastName" :  "",
                          "patronymic" : "userPatronymic",
                          "description" : "simple description"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpectAll(
                status().isBadRequest(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenUser
    void updateProfileWithIncorrectTypeOfField() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX)
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "firstName" : ["3242342"],
                          "lastName" :  "userLastName",
                          "patronymic" : "userPatronymic",
                          "description" : "simple description"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpectAll(
                status().isBadRequest(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenUser(authorities = {"PASSWORD_RESET"})
    void setNewPassword() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/password/reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"password" : "password123"}
                        """);
        mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenUser
    void setNewPasswordWithoutResetPasswordToken() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/password/reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"password" : "password123"}
                        """);
        mockMvc.perform(requestBuilder).andExpect(status().isForbidden());
    }

    @Test
    @WithMockTokenUser(authorities = {"PASSWORD_RESET"})
    void setNewPasswordWithIncorrectSize() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/password/reset")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"password" : "pass"}
                        """);
        mockMvc.perform(requestBuilder).andExpectAll(
                status().isBadRequest(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    @WithMockTokenUser
    void updatePassword() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                         "oldPassword" : "password",
                         "newPassword": "password123"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpect(status().isNoContent());
    }

    @Test
    @WithMockTokenUser
    void updatePasswordWithIncorrectOldPassword() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .put(PATH_PREFIX + "/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                         "oldPassword" : "incorrect old password",
                         "newPassword": "password123"
                        }
                        """);

        mockMvc.perform(requestBuilder).andExpectAll(
                status().isUnauthorized(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }


    @Test
    @WithMockTokenUser
    void deleteProfile() throws Exception {
        var deleteRequestBuilder = MockMvcRequestBuilders.delete(PATH_PREFIX);
        mockMvc.perform(deleteRequestBuilder).andExpect(status().isNoContent());
    }
}