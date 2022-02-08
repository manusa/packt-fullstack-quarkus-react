import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_URL}/users`,
  }),
  endpoints: builder => ({
    getUser: builder.query({
      query: id => `/${id}`
    }),
    getUsers: builder.query({
      query: () => '/'
    }),
  })
})
