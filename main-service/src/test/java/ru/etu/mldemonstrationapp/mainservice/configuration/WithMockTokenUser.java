package ru.etu.mldemonstrationapp.mainservice.configuration;

import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
@WithSecurityContext(factory = WithTokenUserSecurityContextFactory.class)
public @interface WithMockTokenUser {
    String username() default "user";

    String email() default "user@example.com";

    long userId() default 2L;

    String[] authorities() default {"ROLE_USER"};
}