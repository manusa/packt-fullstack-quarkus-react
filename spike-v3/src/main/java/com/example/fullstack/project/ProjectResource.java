package com.example.fullstack.project;

import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.RolesAllowed;
import org.jboss.resteasy.reactive.ResponseStatus;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

@Path("/api/v1/projects")
@RolesAllowed("user")
public class ProjectResource {

  private final ProjectService projectService;

  @Inject
  public ProjectResource(ProjectService projectService) {
    this.projectService = projectService;
  }

  @GET
  public Uni<List<Project>> get() {
    return projectService.listForUser();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @ResponseStatus(201)
  public Uni<Project> create(Project project) {
    return projectService.create(project);
  }

  @PUT
  @Consumes(MediaType.APPLICATION_JSON)
  @Path("/{id}")
  public Uni<Project> update(@PathParam("id") long id, Project project) {
    project.id = id;
    return projectService.update(project);
  }

  @DELETE
  @Path("/{id}")
  public Uni<Void> delete(@PathParam("id") long id) {
    return projectService.delete(id);
  }

}
