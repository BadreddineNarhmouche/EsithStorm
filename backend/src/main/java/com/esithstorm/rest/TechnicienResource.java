package com.esithstorm.rest;

import com.esithstorm.entity.Technicien;
import com.esithstorm.service.TechnicienService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Ressource REST : CRUD Techniciens.
 */
@Path("techniciens")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TechnicienResource {

    @Inject
    private TechnicienService service;

    @GET
    public Response getAll(
            @QueryParam("search") String search,
            @QueryParam("disponibilite") String disponibilite,
            @QueryParam("competences") String competences) {
        List<Technicien> list = service.findAll(search, disponibilite, competences);
        return Response.ok(list).build();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.findById(id)
            .map(t -> Response.ok(t).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response create(Technicien t) {
        if (t == null || t.getNom() == null || t.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        Technicien created = service.create(t);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") Long id, Technicien t) {
        if (t == null || t.getNom() == null || t.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        return service.update(id, t)
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
