package com.example.fullstack.user;

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

@Path("/api/v1/users")
@RolesAllowed("admin")
public class UserResource {

  private final UserService userService;

  @Inject
  public UserResource(UserService userService) {
    this.userService = userService;
  }

  @GET
  public Uni<List<User>> get() {
    return userService.list();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @ResponseStatus(201)
  public Uni<User> create(User user) {
    return userService.create(user);
  }

  @GET
  @Path("{id}")
  public Uni<User> get(@PathParam("id") long id) {
    return userService.findById(id);
  }

  @PUT
  @Consumes(MediaType.APPLICATION_JSON)
  @Path("{id}")
  public Uni<User> update(@PathParam("id") long id, User user) {
    user.id = id;
    return userService.update(user);
  }

  @DELETE
  @Path("{id}")
  public Uni<Void> delete(@PathParam("id") long id) {
    return userService.delete(id);
  }

  @GET
  @Path("self")
  @RolesAllowed("user")
  public Uni<User> getCurrentUser() {
    return userService.getCurrentUser();
  }

  @PUT
  @Path("self/password")
  @RolesAllowed("user")
  public Uni<User> changePassword(PasswordChange passwordChange) {
    return userService
      .changePassword(passwordChange.currentPassword(), passwordChange.newPassword());
  }

}
