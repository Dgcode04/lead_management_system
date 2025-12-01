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
  useGetAdminDashboardQuery,
  useGetActiveTelecallersQuery,
  useGetTelecallerOverdueRemindersQuery,
  useUpdateReminderMutation,
  useGetLeadStatusDistributionQuery,
  useGetReportsDataQuery,
  useImportLeadsCsvMutation,
  useExportReportsCsvMutation,
  useExportLeadsMutation,
} from './leadsApi';

