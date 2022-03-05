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
    return userService.getCurrentUser()
      .chain(user -> Task.<Task>findById(id)
        .chain(task -> {
          if (!user.equals(task.user)) {
            throw new UnauthorizedException("You are not allowed to update this task");
          }
          return Uni.createFrom().item(task);
        }));
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
    return findById(task.id)
      .chain(t -> Task.getSession())
      .chain(s -> s.merge(task));
  }

  public Uni<Void> delete(long id) {
    return findById(id)
      .chain(Task::delete);
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
