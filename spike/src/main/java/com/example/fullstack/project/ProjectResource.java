package com.example.fullstack.project;

import io.quarkus.hibernate.reactive.panache.common.runtime.ReactiveTransactional;
import io.smallrye.mutiny.Uni;
import org.jboss.resteasy.reactive.ResponseStatus;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/projects")
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
  @ReactiveTransactional
  public Uni<Project> create(Project project) {
    return projectService.create(project);
  }

}
