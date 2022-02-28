package com.example.fullstack.project;

import com.example.fullstack.user.UserService;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;

@ApplicationScoped
public class ProjectService {

  private final UserService userService;

  @Inject
  public ProjectService(UserService userService) {
    this.userService = userService;
  }

  public Uni<List<Project>> listForUser() {
    return userService.getCurrentUser()
      .chain(user -> Project.find("user", user).list());
  }

  public Uni<Project> create(Project project) {
    return userService.getCurrentUser()
      .chain(user -> {
        project.user = user;
        return project.persistAndFlush();
      });
  }
}
