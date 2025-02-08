package ru.etu.mldemonstrationapp.mainservice.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.RequiredTypeException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public record JwtToken(UUID id, String subject, Long userId, String email, List<String> authorities, Instant issuedAt,
                       Instant expiresAt) {

    private static List<String> convertRolesClaim(Claims claims) {
        Object roleClaim = claims.get("roles");
        if (roleClaim instanceof ArrayList) {
            return ((ArrayList<?>) roleClaim).stream().map(Object::toString).toList() ;
        }
        throw new RequiredTypeException("Error while converting JWT token");
    }

    public static JwtToken fromClaims(Claims claims) {
        return new JwtToken(UUID.fromString(claims.getId()),
                claims.getSubject(),
                claims.get("user_id", Long.class),
                claims.get("email", String.class),
                convertRolesClaim(claims),
                claims.getIssuedAt().toInstant(),
                claims.getExpiration().toInstant()
        );
    }
}
