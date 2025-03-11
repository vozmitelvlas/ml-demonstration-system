package ru.etu.mldemonstrationapp.mainservice.configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpringDocConfig {

    @Configuration
    @SecurityScheme(name = "jwt-bearer",
            type = SecuritySchemeType.HTTP,
            scheme = "bearer",
            bearerFormat = "JWT"
    )
    protected static class SpringDocSecurity {

    }
}
