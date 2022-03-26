package com.example.fullstack.project;

import com.example.fullstack.user.UserService;
import io.quarkus.security.UnauthorizedException;
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

  Uni<Project> findById(long id) {
    return userService.getCurrentUser()
      .chain(user -> Project.<Project>findById(id)
        .chain(project -> {
          if (!user.equals(project.user)) {
            throw new UnauthorizedException("You are not allowed to update this task");
          }
          return Uni.createFrom().item(project);
        }));
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

  public Uni<Project> update(Project project) {
    return findById(project.id)
      .chain(p -> Project.getSession())
      .chain(s -> s.merge(project));
  }

  public Uni<Void> delete(long id) {
    return findById(id)
      .chain(Project::delete);
  }
}
