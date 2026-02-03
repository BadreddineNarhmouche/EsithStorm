package com.esithstorm.rest;

import com.esithstorm.entity.Fournisseur;
import com.esithstorm.service.FournisseurService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

/**
 * Ressource REST : CRUD Fournisseurs.
 */
@Path("fournisseurs")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FournisseurResource {

    @Inject
    private FournisseurService service;

    @GET
    public Response getAll(
            @QueryParam("search") String search,
            @QueryParam("pays") String pays,
            @QueryParam("ville") String ville,
            @QueryParam("matieres") String matieres) {
        List<Fournisseur> list = service.findAll(search, pays, ville, matieres);
        return Response.ok(list).build();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        return service.findById(id)
            .map(f -> Response.ok(f).build())
            .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response create(Fournisseur f) {
        if (f == null || f.getNom() == null || f.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        Fournisseur created = service.create(f);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("{id}")
    public Response update(@PathParam("id") Long id, Fournisseur f) {
        if (f == null || f.getNom() == null || f.getNom().isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("nom requis").build();
        }
        return service.update(id, f)
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
