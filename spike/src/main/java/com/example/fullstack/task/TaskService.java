package com.example.fullstack.task;

import com.example.fullstack.user.UserService;
import io.quarkus.security.UnauthorizedException;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.time.ZonedDateTime;
import java.util.List;

@ApplicationScoped
public class TaskService {

  private final UserService userService;

  @Inject
  public TaskService(UserService userService) {
    this.userService = userService;
  }

  Uni<Task> findById(long id) {
    return Task.findById(id);
  }

  public Uni<List<Task>> listForUser() {
    return userService.getCurrentUser()
      .chain(user -> Task.find("user", user).list());
  }

  public Uni<Task> create(Task task) {
    return userService.getCurrentUser()
      .chain(user -> {
        task.user = user;
        return task.persistAndFlush();
      });
  }

  public Uni<Task> update(Task task) {
    return userService.getCurrentUser()
      .chain(user -> findById(task.id)
        .chain(t -> {
          if (!user.equals(t.user)) {
            throw new UnauthorizedException("You are not allowed to update this task");
          }
          return Task.getSession();
        })
        .chain(s -> s.merge(task)));
  }

  public Uni<Boolean> setComplete(long id, boolean complete) {
    return findById(id)
      .chain(task -> {
        task.complete = complete ? ZonedDateTime.now() : null;
        return task.persistAndFlush();
      })
      .chain(task -> Uni.createFrom().item(complete));
  }
}
