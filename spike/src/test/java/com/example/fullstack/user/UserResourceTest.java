package com.example.fullstack.user;

import io.quarkus.elytron.security.common.BcryptUtil;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.security.TestSecurity;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.Collections;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertTrue;

@QuarkusTest
class UserResourceTest {

  @Test
  @TestSecurity(user = "admin", roles = "admin")
  void list() {
    given()
      .when().get("/users")
      .then()
      .statusCode(200)
      .body("$.size()", greaterThanOrEqualTo(1),
        "[0].name", is("admin"),
        "[0].password", nullValue());
  }

  @Test
  @TestSecurity(user = "admin", roles = "admin")
  void create() {
    given()
      .body("{\"name\":\"test\",\"password\":\"test\",\"roles\":[\"user\"]}")
      .contentType(ContentType.JSON)
      .when().post("/users")
      .then()
      .statusCode(201)
      .body(
        "name", is("test"),
        "created", not(emptyString())
      );
  }

  @Test
  @TestSecurity(user = "admin", roles = "admin")
  void get() {
    given()
      .when().get("/users/0")
      .then()
      .statusCode(200)
      .body("name", is("admin"));
  }

  @Test
  @TestSecurity(user = "admin", roles = "admin")
  void update() {
    var user = given()
      .body("{\"name\":\"to-update\",\"password\":\"test\",\"roles\":[\"user\"]}")
      .contentType(ContentType.JSON)
      .when().post("/users")
      .then().extract().as(User.class);
    user.roles = Collections.singletonList("updated");
    given()
      .body(user)
      .contentType(ContentType.JSON)
      .when().put("/users/"+ user.id)
      .then()
      .statusCode(200)
      .body("name", is("to-update"));

  }

  @Test
  @TestSecurity(user = "admin", roles = "admin")
  void updateOptimisticLock() {
    given()
      .body("{}")
      .contentType(ContentType.JSON)
      .when().put("/users/0")
      .then()
      .statusCode(409);
  }

  @Test
  @TestSecurity(user = "admin", roles = "user")
  void getCurrentUser() {
    given()
      .when().get("/users/self")
      .then()
      .statusCode(200)
      .body("name", is("admin"));
  }

  @Test
  @TestSecurity(user = "admin", roles = "user")
  void changePassword() {
    given()
      .body("{\"currentPassword\": \"quarkus\", \"newPassword\": \"changed\"}")
      .contentType(ContentType.JSON)
      .when().put("/users/self/password")
      .then()
      .statusCode(200);
    assertTrue(BcryptUtil.matches("changed",
        User.<User>findById(0L).await().atMost(Duration.ofSeconds(1)).password)
    );
  }
}
