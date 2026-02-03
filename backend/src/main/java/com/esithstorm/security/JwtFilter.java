package com.esithstorm.security;

import jakarta.annotation.Priority;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;
import java.util.List;

/**
 * Filtre JAX-RS : vérifie le JWT sur toutes les requêtes sauf /api/auth/login.
 * En cas d'absence ou token invalide, renvoie 401.
 */
@Provider
@Priority(Priorities.AUTHENTICATION)
public class JwtFilter implements ContainerRequestFilter {

    private static final List<String> SKIP_PATHS = List.of("auth/login");

    @jakarta.inject.Inject
    JwtUtil jwtUtil;
    @jakarta.inject.Inject
    com.esithstorm.config.DataLoader dataLoader;

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        String path = requestContext.getUriInfo().getPath();
        if (SKIP_PATHS.stream().anyMatch(path::contains)) {
            return;
        }
        String auth = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (auth == null || !auth.startsWith("Bearer ")) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                .entity("Token JWT requis").build());
            return;
        }
        String token = auth.substring(7);
        if (!jwtUtil.validateToken(token)) {
            requestContext.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                .entity("Token invalide ou expiré").build());
            return;
        }
        requestContext.setProperty("username", jwtUtil.getUsernameFromToken(token));
        requestContext.setProperty("role", jwtUtil.getRoleFromToken(token));
    }
}
