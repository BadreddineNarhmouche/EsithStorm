package com.esithstorm.rest;

import com.esithstorm.service.StatsService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

/**
 * Ressource REST : statistiques tableau de bord.
 * GET /api/stats/dashboard
 */
@Path("stats")
@Produces(MediaType.APPLICATION_JSON)
public class StatsResource {

    @Inject
    private StatsService statsService;

    @GET
    @Path("dashboard")
    public Response getDashboard() {
        Map<String, Long> stats = statsService.getDashboardStats();
        return Response.ok(stats).build();
    }
}
