package ru.etu.mldemonstrationapp.mainservice.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;
import ru.etu.mldemonstrationapp.mainservice.config.CustomUserDetails;

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

    private SecretKey secretKey;

    private final Duration tokenTtl = Duration.ofMinutes(5);

    public final static String AUTH_TOKEN_COOKIE_NAME = "x-auth-token";


    public String generateToken(CustomUserDetails userDetails) {
        Instant issuedAt = Instant.now();
        return Jwts.builder()
                .header().type("JWT")
                .and()
                .id(UUID.randomUUID().toString())
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plus(tokenTtl)))
                .claim("user_id", userDetails.user().getUserId())
                .claim("email", userDetails.user().getEmail())
                .claim("roles", userDetails
                        .getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
                )
                .signWith(getSecretKey(), Jwts.SIG.HS256)
                .compact();
    }

    public ResponseCookie generateTokenCookie(String token) {
        return ResponseCookie.from(AUTH_TOKEN_COOKIE_NAME, token)
                .maxAge(tokenTtl)
                .httpOnly(true)
                .domain(null)
                .path("/")
                .secure(true)
                .build();
    }

    public ResponseCookie generateTokenCookie(CustomUserDetails userDetails) {
        String token = generateToken(userDetails);
        return ResponseCookie.from(AUTH_TOKEN_COOKIE_NAME, token)
                .maxAge(tokenTtl)
                .httpOnly(true)
                .domain(null)
                .path("/")
                .secure(true)
                .build();
    }

    public ResponseCookie getEmptyTokenCookie() {
        return ResponseCookie.from(JwtService.AUTH_TOKEN_COOKIE_NAME, "")
                .path("/")
                .httpOnly(true)
                .secure(true)
                .domain(null)
                .maxAge(0)
                .build();
    }

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
