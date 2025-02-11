package ru.etu.mldemonstrationapp.mainservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtService;
import ru.etu.mldemonstrationapp.mainservice.auth.JwtToken;

import java.io.IOException;

@Component
@Setter
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final JwtService jwtService;
    private final static String AUTHORIZATION_PREFIX = "Bearer ";

    private RequestMatcher ignoredRequestsMatcher = new AntPathRequestMatcher("/api/auth/**");

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        if (ignoredRequestsMatcher.matches(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        Cookie cookie = WebUtils.getCookie(request, JwtService.AUTH_TOKEN_COOKIE_NAME);

        if (cookie == null && (!StringUtils.hasLength(authHeader) || !authHeader.startsWith(AUTHORIZATION_PREFIX))) {
            this.authenticationEntryPoint.commence(request, response,
                    new AuthenticationCredentialsNotFoundException("Authorization token not found"));
            return;
        }

        String tokenString;
        if (cookie == null) {
            tokenString = authHeader.substring(AUTHORIZATION_PREFIX.length());
        } else {
            tokenString = cookie.getValue();
        }

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            Claims claims;
            try {
                claims = jwtService.parseToken(tokenString);
            } catch (JwtException e) {
                this.authenticationEntryPoint.commence(request, response,
                        new BadCredentialsException("Authorization token is invalid"));
                return;
            }

            JwtToken token = JwtToken.fromClaims(claims);

            SecurityContext context = SecurityContextHolder.createEmptyContext();

            var usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                    token,
                    tokenString,
                    token.authorities().stream().map(SimpleGrantedAuthority::new).toList()
            );

            usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            context.setAuthentication(usernamePasswordAuthenticationToken);
            SecurityContextHolder.setContext(context);

        }
        filterChain.doFilter(request, response);
    }
}
