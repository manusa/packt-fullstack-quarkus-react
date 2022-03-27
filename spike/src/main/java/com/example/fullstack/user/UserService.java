package com.example.fullstack.user;

import com.example.fullstack.project.Project;
import com.example.fullstack.task.Task;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.ClientErrorException;
import javax.ws.rs.core.Response;
import java.util.List;

@ApplicationScoped
public class UserService {

  private final JsonWebToken jwt;

  @Inject
  public UserService(JsonWebToken jwt) {
    this.jwt = jwt;
  }

  Uni<List<User>> list() {
    return User.listAll();
  }

  Uni<User> create(User user) {
    user.password = BcryptUtil.bcryptHash(user.password);
    return user.persistAndFlush();
  }

  Uni<User> findById(long id) {
    return User.findById(id);
  }

  public Uni<User> findByName(String name) {
    return User.find("name", name).firstResult();
  }

  public static boolean matches(User user, String password) {
    return BcryptUtil.matches(password, user.password);
  }

  Uni<User> update(User user) {
    return findById(user.id).chain(u -> {
        user.setPassword(u.password);
        return User.getSession();
      })
      .chain(s -> s.merge(user));
  }

  Uni<Void> delete(long id) {
    return findById(id)
      .chain(u -> Uni.combine().all().unis(
          Task.delete("user.id", u.id),
          Project.delete("user.id", u.id)
        ).asTuple()
        .chain(t -> u.delete())
      );
  }

  public Uni<User> getCurrentUser() {
    return findByName(jwt.getName());
  }

  public Uni<User> changePassword(String currentPassword, String newPassword) {
    return getCurrentUser()
      .chain(u -> {
        if (!matches(u, currentPassword)) {
          throw new ClientErrorException("Current password does not match", Response.Status.CONFLICT);
        }
        u.setPassword(BcryptUtil.bcryptHash(newPassword));
        return u.persistAndFlush();
      });
  }
}
