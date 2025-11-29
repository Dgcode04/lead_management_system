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

export const leadsApi = createApi({
  reducerPath: 'leadsApi',
  baseQuery,
  tagTypes: ['Leads', 'LeadSources', 'LeadStatus', 'LeadCalls', 'Reminders'],
  endpoints: (builder) => ({
    // Get all leads
    getAllLeads: builder.query({
      query: () => 'leads/leads-list',
      providesTags: ['Leads'],
    }),
    // Get lead by ID
    getLeadById: builder.query({
      query: (id) => `leads/lead/${id}`,
      providesTags: (result, error, id) => [{ type: 'Leads', id }],
    }),
    // Create a new lead
    createLead: builder.mutation({
      query: (leadData) => ({
        url: 'leads/add',
        method: 'POST',
        body: leadData,
      }),
      invalidatesTags: ['Leads'],
    }),
    // Update a lead
    updateLead: builder.mutation({
      query: ({ id, ...leadData }) => ({
        url: `leads/${id}`,
        method: 'PUT',
        body: leadData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Leads', id }, 'Leads'],
    }),
    // Delete a lead
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `leads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Leads'],
    }),
    // Get lead sources
    getLeadSources: builder.query({
      query: () => 'leads/lead-sources',
      providesTags: ['LeadSources'],
    }),
    // Get lead status
    getLeadStatus: builder.query({
      query: () => 'leads/lead-status',
      providesTags: ['LeadStatus'],
    }),
    // Get recent leads
    getRecentLeads: builder.query({
      query: () => 'leads/recent',
      providesTags: ['Leads'],
    }),
    // Get lead calls by lead ID
    getLeadCalls: builder.query({
      query: (leadId) => `lead-calls/get/${leadId}`,
      providesTags: (result, error, leadId) => [{ type: 'LeadCalls', id: leadId }],
    }),
    // Create a new lead call
    createLeadCall: builder.mutation({
      query: (callData) => ({
        url: 'lead-calls/add',
        method: 'POST',
        body: callData,
      }),
      invalidatesTags: (result, error, callData) => [
        { type: 'LeadCalls', id: callData.lead_id },
        'LeadCalls',
      ],
    }),
    // Get reminders by lead ID
    getReminders: builder.query({
      query: (leadId) => `reminders/get/${leadId}`,
      providesTags: (result, error, leadId) => [{ type: 'Reminders', id: leadId }],
    }),
    // Create a new reminder
    createReminder: builder.mutation({
      query: (reminderData) => ({
        url: 'reminders/create',
        method: 'POST',
        body: reminderData,
      }),
      invalidatesTags: (result, error, reminderData) => [
        { type: 'Reminders', id: reminderData.lead_id },
        'Reminders',
      ],
    }),
    // Get upcoming follow-ups
    getUpcomingFollowups: builder.query({
      query: () => 'reminders/upcoming-followups',
      providesTags: ['Reminders'],
    }),
    // Get dashboard summary
    getDashboardSummary: builder.query({
      query: () => 'dashboard/summary',
      providesTags: ['Leads', 'Reminders'],
    }),
    // Export leads
    exportLeads: builder.mutation({
      queryFn: async (arg, api, extraOptions, baseQuery) => {
        const result = await baseQuery({
          url: 'leads/export',
          method: 'GET',
          responseHandler: (response) => response.blob(),
        });
        
        if (result.error) {
          return { error: result.error };
        }
        
        return { data: result.data };
      },
    }),
  }),
});

export const {
  useGetAllLeadsQuery,
  useGetLeadByIdQuery,
  useCreateLeadMutation,
  useUpdateLeadMutation,
  useDeleteLeadMutation,
  useGetLeadSourcesQuery,
  useGetLeadStatusQuery,
  useGetRecentLeadsQuery,
  useGetLeadCallsQuery,
  useCreateLeadCallMutation,
  useGetRemindersQuery,
  useCreateReminderMutation,
  useGetUpcomingFollowupsQuery,
  useGetDashboardSummaryQuery,
  useExportLeadsMutation,
} = leadsApi;

export default leadsApi;

