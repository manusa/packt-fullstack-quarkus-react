package com.example.fullstack;

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

  public Uni<Boolean> setComplete(long id, boolean complete) {
    return Task.<Task>findById(id)
      .chain(task -> {
        task.complete = complete ? ZonedDateTime.now() : null;
        return task.persistAndFlush();
      })
      .chain(task -> Uni.createFrom().item(complete));
  }
}
