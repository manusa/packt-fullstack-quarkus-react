package com.example.fullstack.project;

import com.example.fullstack.task.Task;
import com.example.fullstack.user.UserService;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.mutiny.Uni;
import org.hibernate.ObjectNotFoundException;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import java.util.List;

@ApplicationScoped
public class ProjectService {

  private final UserService userService;

  @Inject
  public ProjectService(UserService userService) {
    this.userService = userService;
  }

  public Uni<Project> findById(long id) {
    return userService.getCurrentUser()
      .chain(user -> Project.<Project>findById(id)
        .onItem().ifNull().failWith(() -> new ObjectNotFoundException(id, "Project"))
        .onItem().invoke(project -> {
          if (!user.equals(project.user)) {
            throw new UnauthorizedException("You are not allowed to update this project");
          }
        }));
  }

  public Uni<List<Project>> listForUser() {
    return userService.getCurrentUser()
      .chain(user -> Project.find("user", user).list());
  }

  @WithTransaction
  public Uni<Project> create(Project project) {
    return userService.getCurrentUser()
      .chain(user -> {
        project.user = user;
        return project.persistAndFlush();
      });
  }

  @WithTransaction
  public Uni<Project> update(Project project) {
    return findById(project.id)
      .chain(p -> Project.getSession())
      .chain(s -> s.merge(project));
  }

  @WithTransaction
  public Uni<Void> delete(long id) {
    return findById(id)
      .chain(p -> Task.update("project = null where project = ?1", p)
        .chain(i -> p.delete()));
  }
}
