package com.example.fullstack;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.smallrye.mutiny.Uni;

import javax.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class UserService {

  Uni<List<User>> list() {
    return User.listAll();
  }

  Uni<User> create(User user) {
    user.password = BcryptUtil.bcryptHash(user.password);
    return user.persistAndFlush();
  }

  Uni<User> get(long id) {
    return User.findById(id);
  }

  Uni<User> update(User user) {
    return get(user.id).chain(u -> {
        user.password = u.password;
        return User.getSession();
      })
      .chain(s -> s.merge(user));
  }
}
