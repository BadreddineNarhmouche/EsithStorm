package com.esithstorm.rest;

import com.esithstorm.entity.Entreprise;
import com.esithstorm.service.EntrepriseService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Ressource REST : CRUD Entreprises.
 * Préfixe : /api/entreprises
 */
@Path("entreprises")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EntrepriseResource {

    @Inject
    private EntrepriseService service;

    @GET
    public Response getAll(
            @QueryParam("search") String search,
            @QueryParam("pays") String pays,
            @QueryParam("specialite") String specialite) {
        List<Entreprise> list = service.findAll(search, pays, specialite);
        return Response.ok(list).build();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.findById(id)
            .map(e -> Response.ok(e).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response create(Entreprise e) {
        if (e == null || e.getNom() == null || e.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        Entreprise created = service.create(e);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") Long id, Entreprise e) {
        if (e == null || e.getNom() == null || e.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        return service.update(id, e)
            .map(updated -> Response.ok(updated).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Long id) {
        service.delete(id);
        return Response.noContent().build();
    }
}
