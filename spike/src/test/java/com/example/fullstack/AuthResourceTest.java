package com.example.fullstack;

import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.emptyString;
import static org.hamcrest.Matchers.not;

class AuthResourceTest {

  @Test
  void loginValidCredentials() {
    given()
      .body("{\"name\":\"admin\",\"password\":\"quarkus\"}")
      .contentType(ContentType.JSON)
      .when().post("/auth/login")
      .then()
      .statusCode(200)
      .body(not(emptyString()));
  }

  @Test
  void loginInvalidCredentials() {
    given()
      .body("{\"name\":\"admin\",\"password\":\"not-quarkus\"}")
      .contentType(ContentType.JSON)
      .when().post("/auth/login")
      .then()
      .statusCode(401);
  }
}
