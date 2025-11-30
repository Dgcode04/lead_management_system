import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/',
  credentials: 'include',
  prepareHeaders: (headers) => {
    // Add any auth headers if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   headers.set('authorization', `Bearer ${token}`);
    // }
    return headers;
  },
});

export const telecallersApi = createApi({
  reducerPath: 'telecallersApi',
  baseQuery,
  tagTypes: ['Telecallers'],
  endpoints: (builder) => ({
    // Get all telecallers
    getAllTelecallers: builder.query({
      query: () => 'telecallers/all',
      providesTags: ['Telecallers'],
    }),
    // Get telecallers list
    getTelecallersList: builder.query({
      query: () => 'telecallers/telecallers-lists',
      providesTags: ['Telecallers'],
    }),
    // Get admin telecallers (paginated)
    getAdminTelecallers: builder.query({
      query: (params = {}) => ({
        url: 'admin/telecallers',
        params: {
          page: params.page || 1,
          size: params.size || 20,
        },
      }),
      providesTags: ['Telecallers'],
    }),
    // Get telecaller by ID
    getTelecallerById: builder.query({
      query: (id) => `telecallers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Telecallers', id }],
    }),
    // Create a new telecaller
    createTelecaller: builder.mutation({
      query: (telecallerData) => ({
        url: 'telecallers/add',
        method: 'POST',
        body: telecallerData,
      }),
      invalidatesTags: ['Telecallers'],
    }),
    // Update a telecaller
    updateTelecaller: builder.mutation({
      query: ({ id, ...telecallerData }) => ({
        url: `telecallers/${id}`,
        method: 'PUT',
        body: telecallerData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Telecallers', id }, 'Telecallers'],
    }),
    // Delete a telecaller
    deleteTelecaller: builder.mutation({
      query: (id) => ({
        url: `telecallers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Telecallers'],
    }),
    // Toggle telecaller active/inactive status
    toggleTelecallerStatus: builder.mutation({
      query: (userId) => ({
        url: `admin/telecaller/${userId}/toggle`,
        method: 'PUT',
      }),
      invalidatesTags: ['Telecallers'],
    }),
  }),
});

export const {
  useGetAllTelecallersQuery,
  useGetTelecallersListQuery,
  useGetAdminTelecallersQuery,
  useGetTelecallerByIdQuery,
  useCreateTelecallerMutation,
  useUpdateTelecallerMutation,
  useDeleteTelecallerMutation,
  useToggleTelecallerStatusMutation,
} = telecallersApi;

export default telecallersApi;

