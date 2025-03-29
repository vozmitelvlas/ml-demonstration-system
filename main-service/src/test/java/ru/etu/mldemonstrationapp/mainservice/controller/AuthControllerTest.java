package ru.etu.mldemonstrationapp.mainservice.controller;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@Sql({"/sql/test-organizations-data.sql", "/sql/test-users-data.sql"})
class AuthControllerTest extends AbstractControllerTest {
    private static final String PATH_PREFIX = "/api/auth";
    private static final String AUTH_COOKIE_NAME = JwtService.AUTH_TOKEN_COOKIE_NAME;

    @Test
    void login() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "admin",
                          "password" : "password"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                cookie().exists(AUTH_COOKIE_NAME),
                jsonPath("$.accessToken").isString(),
                jsonPath("$.user.login").value("admin"),
                jsonPath("$.user.userId").value(1L)
        );
    }

    @Test
    void loginWithIncorrectLogin() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "admin123",
                          "password" : "password"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isUnauthorized(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    void loginWithIncorrectPassword() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "admin",
                          "password" : "qwerty"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isUnauthorized(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    void register() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "secondadmin",
                          "password" : "password",
                          "email" : "secondadmin@example.com",
                          "firstName" : "second",
                          "lastName" : "admin"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isOk(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON),
                jsonPath("$.accessToken").isString(),
                jsonPath("$.user.login").value("secondadmin"),
                jsonPath("$.user.userId").isNumber(),
                jsonPath("$.user.email").value("secondadmin@example.com"),
                jsonPath("$.user.firstName").value("second"),
                jsonPath("$.user.lastName").value("admin"),
                jsonPath("$.user.patronymic").doesNotExist(),
                jsonPath("$.user.description").doesNotExist(),
                jsonPath("$.user.organization.organizationId").value(1L),
                jsonPath("$.user.roles[0]").value("USER")
        );
    }

    @Test
    void registerWithDuplicateLogin() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "admin",
                          "password" : "password",
                          "email" : "secondadmin@example.com",
                          "firstName" : "second",
                          "lastName" : "admin"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isConflict(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }


    @Test
    void registerWithDuplicateEmail() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "newuser",
                          "password" : "password",
                          "email" : "user@example.com",
                          "firstName" : "second",
                          "lastName" : "admin"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isConflict(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    void registerWithIncorrectEmailField() throws Exception {
        var requestBuilder = MockMvcRequestBuilders
                .post(PATH_PREFIX + "/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "login" : "newuser",
                          "password" : "password",
                          "email" : "user",
                          "firstName" : "second",
                          "lastName" : "admin"
                        }
                        """);

        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isBadRequest(),
                content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON)
        );
    }

    @Test
    void logout() throws Exception {
        var requestBuilder = MockMvcRequestBuilders.get(PATH_PREFIX + "/logout");
        this.mockMvc.perform(requestBuilder).andExpectAll(
                status().isNoContent(),
                cookie().maxAge(AUTH_COOKIE_NAME, 0)
        );
    }
}