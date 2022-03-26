package com.example.fullstack.project;

import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.allOf;
import static org.hamcrest.CoreMatchers.hasItem;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.hasEntry;
import static org.hamcrest.Matchers.not;

@QuarkusTest
public class ProjectResourceTest {

  @Test
  @TestSecurity(user = "user", roles = "user")
  void list() {
    given()
      .when().get("/projects")
      .then()
      .statusCode(200)
      .body("$",
        hasItem(allOf(
          hasEntry("name", "Work")
        ))
      );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void create() {
    given()
      .body("{\"name\":\"project-create\"}")
      .contentType(ContentType.JSON)
      .when().post("/projects")
      .then()
      .statusCode(201)
      .body(
        "name", is("project-create"),
        "created", not(emptyString())
      );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void createDuplicate() {
    var existent = given().body("{\"name\":\"create-existent\"}").contentType(ContentType.JSON).post("/projects")
      .as(Project.class);
    existent.id = null;
    given()
      .when().contentType(ContentType.JSON).body(existent).post("/projects")
      .then()
      .statusCode(409);
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void update() {
    var toUpdate = given().body("{\"name\":\"to-update\"}").contentType(ContentType.JSON).post("/projects")
      .as(Project.class);
    toUpdate.name = "updated";
    given()
      .when().contentType(ContentType.JSON).body(toUpdate).put("/projects/" + toUpdate.id)
      .then()
      .statusCode(200)
      .body(
        "name", is("updated"),
        "version", is(toUpdate.version + 1)
      );
  }

  @Test
  @TestSecurity(user = "user", roles = "user")
  void delete() {
    var toDelete = given().body("{\"name\":\"to-delete\"}").contentType(ContentType.JSON).post("/projects")
      .as(Project.class);
    given()
      .when().delete("/projects/" + toDelete.id)
      .then()
      .statusCode(204);
  }
}
