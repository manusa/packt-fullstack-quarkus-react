package com.example.fullstack;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.mutiny.Uni;
import org.eclipse.microprofile.jwt.JsonWebToken;

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

  Uni<User> findByName(String name) {
    return User.find("name", name).firstResult();
  }

  static boolean matches(User user, String password) {
    return BcryptUtil.matches(password, user.password);
  }

  Uni<User> update(User user) {
    return findById(user.id).chain(u -> {
        user.password = u.password;
        return User.getSession();
      })
      .chain(s -> s.merge(user));
  }

  Uni<User> getCurrentUser() {
    return findByName(jwt.getName());
  }
}
