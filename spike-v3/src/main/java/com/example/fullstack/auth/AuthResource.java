package com.example.fullstack.auth;

import io.smallrye.mutiny.Uni;
import jakarta.annotation.security.PermitAll;

import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/api/v1/auth")
public class AuthResource {

  private final AuthService authService;

  @Inject
  public AuthResource(AuthService authService) {
    this.authService = authService;
  }

  @PermitAll
  @POST
  @Path("/login")
  public Uni<String> login(AuthRequest request) {
    return authService.authenticate(request);
  }
}
