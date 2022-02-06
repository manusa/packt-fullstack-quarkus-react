package com.example.fullstack;

import org.hibernate.HibernateException;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class RestExceptionHandler implements ExceptionMapper<HibernateException> {
  @Override
  public Response toResponse(HibernateException exception) {
    return Response.status(Response.Status.CONFLICT).build();
  }
}
