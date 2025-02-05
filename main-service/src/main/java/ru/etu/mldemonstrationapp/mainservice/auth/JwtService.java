package ru.etu.mldemonstrationapp.mainservice.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {
    @Value("${jwt.secret-key}")
    private String jwtSecret;

    private final Duration tokenTtl = Duration.ofMinutes(5);

    private SecretKey secretKey;

    public String generateToken(CustomUserDetails userDetails) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .header().type("JWT")
                .and()
                .id(UUID.randomUUID().toString())
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plus(tokenTtl)))
                .claim("user_id", userDetails.getUser().getUserId())
                .claim("email", userDetails.getUser().getEmail())
                .claim("roles", userDetails
                        .getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
                )
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        try {
            return Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
        } catch (JwtException e) {
            throw new AuthenticationCredentialsNotFoundException(e.getMessage());
        }
    }


    private SecretKey getSecretKey() {
        if (secretKey == null) {
            return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
        return secretKey;
    }
}
