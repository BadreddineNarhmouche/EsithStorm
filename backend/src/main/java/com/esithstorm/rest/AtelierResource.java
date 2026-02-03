package com.esithstorm.rest;

import com.esithstorm.entity.Atelier;
import com.esithstorm.service.AtelierService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Ressource REST : CRUD Ateliers.
 */
@Path("ateliers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AtelierResource {

    @Inject
    private AtelierService service;

    @GET
    public Response getAll(
            @QueryParam("search") String search,
            @QueryParam("pays") String pays,
            @QueryParam("typeProduction") String typeProduction) {
        List<Atelier> list = service.findAll(search, pays, typeProduction);
        return Response.ok(list).build();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.findById(id)
            .map(a -> Response.ok(a).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response create(Atelier a) {
        if (a == null || a.getNom() == null || a.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        Atelier created = service.create(a);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") Long id, Atelier a) {
        if (a == null || a.getNom() == null || a.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        return service.update(id, a)
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
