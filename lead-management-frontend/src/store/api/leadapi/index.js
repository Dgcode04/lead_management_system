/**
 * Lead API Module
 * 
 * Centralized exports for all lead-related APIs
 */

export {
  default as leadsApi,
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
} from './leadsApi';

