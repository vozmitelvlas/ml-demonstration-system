package ru.etu.mldemonstrationapp.mainservice.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.configuration.CustomUserDetails;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.UUID;
import java.util.stream.Stream;

@Service
public class JwtServiceImpl implements JwtService {
    @Value("${jwt.secret-key}")
    private String jwtSecret;

    private SecretKey secretKey;

    private final Duration accessTokenTtl = Duration.ofDays(1);
    private final Duration resetTokenTtl = Duration.ofMinutes(5);
    private final Duration confirmTokenTtl = Duration.ofHours(1);

    @Override
    public String generateResetPasswordToken(CustomUserDetails userDetails) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .header().type("JWT")
                .and()
                .id(UUID.randomUUID().toString())
                .subject(userDetails.getUsername())
                .claim("user_id", userDetails.user().getUserId())
                .claim("email", userDetails.user().getEmail())
                .claim("authorities", Collections.singletonList("PASSWORD_RESET"))
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plus(resetTokenTtl)))
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }
        @Override
        public String generateAccessToken(CustomUserDetails userDetails) {
            Instant issuedAt = Instant.now();
            return Jwts.builder()
                    .header().type("JWT")
                    .and()
                    .id(UUID.randomUUID().toString())
                    .subject(userDetails.getUsername())
                    .issuedAt(Date.from(issuedAt))
                    .expiration(Date.from(issuedAt.plus(accessTokenTtl)))
                    .claim("user_id", userDetails.user().getUserId())
                    .claim("email", userDetails.user().getEmail())
                    .claim("authorities", userDetails
                            .getAuthorities()
                            .stream()
                            .map(GrantedAuthority::getAuthority)
                            .toList()
                    )
                    .claim("email_confirm", userDetails.user().getEmailConfirm())
                    .signWith(getSecretKey(), Jwts.SIG.HS256)
                    .compact();
        }
    @Override
    public String generateEmailConfirmToken(CustomUserDetails userDetails) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .header().type("JWT")
                .and()
                .id(UUID.randomUUID().toString())
                .subject(userDetails.getUsername())
                .claim("user_id", userDetails.user().getUserId())
                .claim("email", userDetails.user().getEmail())
                .claim("authorities", Collections.singletonList("EMAIL_CONFIRM"))
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plus(confirmTokenTtl)))
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }

    @Override
    public ResponseCookie generateAccessTokenCookie(String token) {
        return ResponseCookie.from(AUTH_TOKEN_COOKIE_NAME, token)
                .maxAge(accessTokenTtl)
                .httpOnly(true)
                .domain(null)
                .path("/")
                .secure(true)
                .build();
    }


    @Override
    public ResponseCookie getEmptyTokenCookie() {
        return ResponseCookie.from(JwtService.AUTH_TOKEN_COOKIE_NAME, "")
                .path("/")
                .httpOnly(true)
                .secure(true)
                .domain(null)
                .maxAge(0)
                .build();
    }

    @Override
    public Claims parseToken(String token) {
        return Jwts.parser().verifyWith(getSecretKey()).build().parseSignedClaims(token).getPayload();
    }

    private SecretKey getSecretKey() {
        if (secretKey == null) {
            secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        }
        return secretKey;
    }
}
