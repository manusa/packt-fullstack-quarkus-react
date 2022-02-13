package com.example.fullstack;

import org.hibernate.HibernateException;
import org.hibernate.StaleObjectStateException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class RestExceptionHandler implements ExceptionMapper<HibernateException> {


  @Override
  public Response toResponse(HibernateException exception) {
    if (hasExceptionInChain(exception, StaleObjectStateException.class)) {
      return Response.status(Response.Status.CONFLICT).build();
    }
    return Response
      .status(Response.Status.BAD_REQUEST)
      .entity("\"" + exception.getMessage() + "\"")
      .build();
  }

  private static boolean hasExceptionInChain(Throwable throwable, Class<?> exceptionClass) {
    while (throwable != null) {
      if (exceptionClass.isInstance(throwable)) {
        return true;
      }
      throwable = throwable.getCause();
    }
    return false;
  }
}
