package ru.etu.mldemonstrationapp.mainservice.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.UUID;

public class WithTokenUserSecurityContextFactory implements WithSecurityContextFactory<WithMockTokenUser> {
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    public SecurityContext createSecurityContext(WithMockTokenUser user) {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

        JwtToken jwtToken = new JwtToken(
                UUID.randomUUID(),
                user.username(),
                user.userId(),
                user.email(),
                Arrays.asList(user.authorities()),
                Instant.now(),
                Instant.now().plus(5, ChronoUnit.MINUTES)
        );

        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(
                jwtToken,
                null,
                Arrays.stream(user.authorities()).map(SimpleGrantedAuthority::new).toList()
        );

        securityContext.setAuthentication(authentication);
        return securityContext;
    }
}