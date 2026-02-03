package com.esithstorm.rest;

import com.esithstorm.dto.LoginRequest;
import com.esithstorm.dto.LoginResponse;
import com.esithstorm.service.AuthService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Ressource REST : authentification (login).
 * POST /api/auth/login
 */
@Path("auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    private AuthService authService;

    @POST
    @Path("login")
    public Response login(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("username et password requis").build();
        }
        return authService.login(request.getUsername(), request.getPassword())
            .map(token -> {
                var user = authService.findByUsername(request.getUsername()).orElseThrow();
                return Response.ok(new LoginResponse(token, user.getUsername(), user.getRole().name())).build();
            })
            .orElse(Response.status(Response.Status.UNAUTHORIZED).entity("Identifiants invalides").build());
    }
}
