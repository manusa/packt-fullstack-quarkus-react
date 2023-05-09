package com.example.fullstack.task;

import com.example.fullstack.user.User;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.quarkus.test.vertx.RunOnVertxContext;
import io.quarkus.test.vertx.UniAsserter;
import io.quarkus.vertx.VertxContextSupport;
import io.restassured.http.ContentType;
import org.hamcrest.Matcher;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasProperty;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;

@QuarkusTest
class TaskResourceTest {

  @Test
  @TestSecurity(user = "user", roles = "user")
  void list() {
    given()
      .body("{\"title\":\"to-be-listed\"}")
      .contentType(ContentType.JSON)
      .when().post("/api/v1/tasks").as(Task.class);
    given()
      .when().get("/api/v1/tasks")
      .then()
      .statusCode(200)
      .body("$",
        allOf(
          hasItem(
            hasEntry("title", "to-be-listed")
          ),
          everyItem(
            hasEntry(is("user"), (Matcher)hasEntry("name", "user"))
          )
        )
      );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void create() {
    given()
      .body("{\"title\":\"task-create\"}")
      .contentType(ContentType.JSON)
      .when().post("/api/v1/tasks")
      .then()
      .statusCode(201)
      .body(
        "title", is("task-create"),
        "created", not(emptyString())
      );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void update() {
    var toUpdate = given()
      .body("{\"title\":\"to-update\"}")
      .contentType(ContentType.JSON)
      .post("/api/v1/tasks").as(Task.class);
    toUpdate.title = "updated";
    given()
      .body(toUpdate)
      .contentType(ContentType.JSON)
      .when().put("/api/v1/tasks/" + toUpdate.id)
      .then()
      .statusCode(200)
      .body(
        "title", is("updated"),
        "version", is(toUpdate.version + 1)
      );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void updateNotFound() {
    given()
      .body("{\"title\":\"updated\"}")
      .contentType(ContentType.JSON)
      .when().put("/api/v1/tasks/1337")
      .then()
      .statusCode(404);
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  @RunOnVertxContext
  void updateForbidden(UniAsserter uniAsserter) {
    uniAsserter.assertThat(() ->
        Panache.withSession(() -> User.<User>findById(0L).chain(admin -> {
            Task task = new Task();
            task.title = "admins-task";
            task.user = admin;
            return task.<Task>persistAndFlush();
          })
        ),
      adminTask -> {
        given()
          .body("{\"title\":\"to-update\"}")
          .contentType(ContentType.JSON)
          .when().put("/api/v1/tasks/" + adminTask.id)
          .then()
          .statusCode(401); // TODO: TaskService UnauthorizedException should be changed to ForbiddenException
      }
    );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void delete() throws Throwable {
    var toDelete = given()
      .body("{\"title\":\"to-delete\"}")
      .contentType(ContentType.JSON)
      .post("/api/v1/tasks").as(Task.class);
    given()
      .when().delete("/api/v1/tasks/" + toDelete.id)
      .then()
      .statusCode(204);
    assertThat(
      VertxContextSupport.subscribeAndAwait(() -> Panache.withSession(() -> Task.findById(toDelete.id))),
      nullValue());
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void setComplete() throws Throwable {
    var toSetComplete = given()
      .body("{\"title\":\"to-set-complete\"}")
      .contentType(ContentType.JSON)
      .post("/api/v1/tasks").as(Task.class);
    given()
      .body("\"true\"")
      .contentType(ContentType.JSON)
      .when().put("/api/v1/tasks/" + toSetComplete.id + "/complete")
      .then()
      .statusCode(200);
    assertThat(
      VertxContextSupport.subscribeAndAwait(() -> Panache.withSession(() -> Task.findById(toSetComplete.id))),
      allOf(
        hasProperty("complete", notNullValue()),
        hasProperty("version", is(toSetComplete.version + 1))
      ));
  }
}
