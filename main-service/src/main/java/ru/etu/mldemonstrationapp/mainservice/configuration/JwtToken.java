package ru.etu.mldemonstrationapp.mainservice.configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.RequiredTypeException;

import java.security.Principal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record JwtToken(UUID id, String subject, Long userId, String email, Boolean emailConfirm, List<String> authorities,
                          Instant issuedAt,
                          Instant expiresAt) implements Principal{

    private static List<String> convertAuthoritiesClaim(Claims claims) {
        Object authoritiesClaim = claims.get("authorities");
        if (authoritiesClaim instanceof ArrayList) {
            return ((ArrayList<?>) authoritiesClaim).stream().map(Object::toString).toList();
        }
        throw new RequiredTypeException("Error while converting JWT token");
    }

    public static JwtToken fromClaims(Claims claims) {
        return new JwtToken(UUID.fromString(claims.getId()),
                claims.getSubject(),
                claims.get("user_id", Long.class),
                claims.get("email", String.class),
                claims.get("email_confirm", Boolean.class),
                convertAuthoritiesClaim(claims),
                claims.getIssuedAt().toInstant(),
                claims.getExpiration().toInstant()
        );
    }

    @Override
    public String getName() {
        return subject;
    }
}
