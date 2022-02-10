import {createApi} from '@reduxjs/toolkit/query/react';
import {authBaseQuery} from '../auth';

export const api = createApi({
  reducerPath: 'users',
  baseQuery: authBaseQuery({path: 'users'}),
  endpoints: builder => ({
    getUser: builder.query({
      query: id => `/${id}`
    }),
    getUsers: builder.query({
      query: () => '/'
    }),
    getSelf: builder.query({
      query: () => '/self'
    }),
  })
})
