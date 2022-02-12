package com.example.fullstack;

import io.quarkus.hibernate.reactive.panache.common.runtime.ReactiveTransactional;
import io.smallrye.mutiny.Uni;
import org.jboss.resteasy.reactive.ResponseStatus;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/tasks")
@RolesAllowed("user")
public class TaskResource {

  private final TaskService taskService;

  @Inject
  public TaskResource(TaskService taskService) {
    this.taskService = taskService;
  }

  @GET
  public Uni<List<Task>> get() {
    return taskService.listForUser();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @ResponseStatus(201)
  @ReactiveTransactional
  public Uni<Task> create(Task task) {
    return taskService.create(task);
  }

  @PUT
  @Path("/{id}/complete")
  @ReactiveTransactional
  public Uni<Boolean> setComplete(@PathParam("id") long id, boolean complete) {
    return taskService.setComplete(id, complete);
  }
}
