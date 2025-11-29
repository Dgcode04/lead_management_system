import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/',
  credentials: 'include',
  prepareHeaders: (headers) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Sign in
    signin: builder.mutation({
      query: (credentials) => ({
        url: 'auth/signin',
        method: 'POST',
        body: {
          email: credentials.email,
          password: credentials.password,
        },
      }),
    }),
    // Logout
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useSigninMutation, useLogoutMutation } = authApi;

export default authApi;

