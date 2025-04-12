package ru.etu.mldemonstrationapp.mainservice.components;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;
import ru.etu.mldemonstrationapp.mainservice.configuration.JwtToken;
import ru.etu.mldemonstrationapp.mainservice.service.JwtService;

import java.io.IOException;

@Component
@Setter
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private AuthenticationEntryPoint authenticationEntryPoint;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    private final static String AUTHORIZATION_PREFIX = "Bearer ";

    private RequestMatcher ignoredRequestsMatcher = new AntPathRequestMatcher("/api/auth/**");

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        if (ignoredRequestsMatcher.matches(request) || SecurityContextHolder.getContext().getAuthentication() != null) {
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

        Claims claims;
        UserDetails userDetails;
        try {
            claims = jwtService.parseToken(tokenString);
            userDetails = userDetailsService.loadUserByUsername(claims.getSubject());
        } catch (JwtException | UsernameNotFoundException e) {
            this.authenticationEntryPoint.commence(request, response,
                    new BadCredentialsException("Authorization token is invalid"));
            return;
        }

        if (!userDetails.isAccountNonLocked()) {
            this.authenticationEntryPoint.commence(request, response,
                    new LockedException("Account is locked. Please contact the administrator."));
            return;
        }

        JwtToken token = JwtToken.fromClaims(claims);

        SecurityContext context = SecurityContextHolder.createEmptyContext();

        var authorities = token.authorities().contains("PASSWORD_RESET") || token.authorities().contains("EMAIL_CONFIRM")
                ? token.authorities().stream().map(SimpleGrantedAuthority::new).toList()
                : userDetails.getAuthorities();

        var usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                token,
                tokenString,
                authorities
        );

        usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        context.setAuthentication(usernamePasswordAuthenticationToken);
        SecurityContextHolder.setContext(context);


        filterChain.doFilter(request, response);
    }
}
