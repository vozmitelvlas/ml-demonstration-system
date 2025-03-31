package ru.etu.mldemonstrationapp.mainservice.configuration;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@WithMockTokenUser(username = "admin", authorities = {"ROLE_ADMIN"}, email = "admin@example.com", userId = 1L)
public @interface WithMockTokenAdmin {
}
