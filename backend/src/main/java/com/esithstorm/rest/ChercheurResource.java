package com.esithstorm.rest;

import com.esithstorm.entity.Chercheur;
import com.esithstorm.service.ChercheurService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Ressource REST : CRUD Chercheurs.
 */
@Path("chercheurs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ChercheurResource {

    @Inject
    private ChercheurService service;

    @GET
    public Response getAll(
            @QueryParam("search") String search,
            @QueryParam("domaines") String domaines,
            @QueryParam("materiaux") String materiaux) {
        List<Chercheur> list = service.findAll(search, domaines, materiaux);
        return Response.ok(list).build();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.findById(id)
            .map(c -> Response.ok(c).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response create(Chercheur c) {
        if (c == null || c.getNom() == null || c.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        Chercheur created = service.create(c);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") Long id, Chercheur c) {
        if (c == null || c.getNom() == null || c.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        return service.update(id, c)
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
