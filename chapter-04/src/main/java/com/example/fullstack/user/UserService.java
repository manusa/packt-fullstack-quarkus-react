package com.example.fullstack.user;

import com.example.fullstack.project.Project;
import com.example.fullstack.task.Task;
import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.hibernate.ObjectNotFoundException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.List;

@ApplicationScoped
public class UserService {

  private final JsonWebToken jwt;

  @Inject
  public UserService(JsonWebToken jwt) {
    this.jwt = jwt;
  }

  public Uni<User> findById(long id) {
    return User.<User>findById(id)
      .onItem().ifNull().failWith(() -> new ObjectNotFoundException(id, "User"));
  }

  public Uni<User> findByName(String name) {
    return User.find("name", name).firstResult();
  }

  public Uni<List<User>> list() {
    return User.listAll();
  }

  public Uni<User> create(User user) {
    user.password = BcryptUtil.bcryptHash(user.password);
    return user.persistAndFlush();
  }

  public Uni<User> update(User user) {
    return findById(user.id)
      .chain(u -> User.getSession())
      .chain(s -> s.merge(user));
  }

  public Uni<Void> delete(long id) {
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

  public static boolean matches(User user, String password) {
    return BcryptUtil.matches(password, user.password);
  }
}
