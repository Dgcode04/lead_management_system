import { useState, useEffect, useMemo } from 'react';
import { Grid, Typography, Box, Paper, LinearProgress, CircularProgress } from '@mui/material';
import DashboardCard from '../../components/layout/DashboardCard/DashboardCard';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LeadStatusBreakdownChart from '../../components/common/LeadStatusBreakdownChart/LeadStatusBreakdownChart';
import TelecallerPerformanceChart from '../../components/common/TelecallerPerformanceChart/TelecallerPerformanceChart';
import TelecallerOverview from '../../components/common/TelecallerOverview/TelecallerOverview';
import { useGetAdminDashboardQuery, useGetActiveTelecallersQuery, useGetLeadStatusDistributionQuery } from '../../store/api/leadapi/leadsApi';

const DashboardContainer = () => {
  const { data: adminDashboardData, isLoading, error } = useGetAdminDashboardQuery();
  const { data: activeTelecallersData, isLoading: isLoadingTelecallers } = useGetActiveTelecallersQuery();
  const { data: leadStatusDistributionData, isLoading: isLoadingLeadStatus } = useGetLeadStatusDistributionQuery();

  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    newThisWeek: 0,
    activeTelecallers: 0,
    inactiveTelecallers: 0,
    conversions: 0,
    conversionRate: 0,
    totalCalls: 0,
    pendingFollowUps: 0,
    interestedProspects: 0,
    unassignedLeads: 0,
  });

  // Transform API response to pie chart data format
  const leadStatusData = useMemo(() => {
    // Define status map with order and colors
    const statusMap = {
      new: { name: 'New', color: '#3B82F6' },
      contacted: { name: 'Contacted', color: '#9333EA' },
      interested: { name: 'Interested', color: '#10B981' },
      follow_up: { name: 'Follow-up', color: '#F59E0B' },
      not_interested: { name: 'Not Interested', color: '#EF4444' },
      converted: { name: 'Converted', color: '#059669' },
    };

    if (!leadStatusDistributionData) {
      // Return all statuses with 0 values if no data
      return Object.entries(statusMap).map(([key, statusInfo]) => ({
        name: statusInfo.name,
        value: 0,
        color: statusInfo.color,
      }));
    }

    // Map API response to chart format - show all statuses even if count is 0
    return Object.entries(statusMap).map(([key, statusInfo]) => {
      const statusData = leadStatusDistributionData[key] || { count: 0, percentage: 0 };
      return {
        name: statusInfo.name,
        value: statusData.count || 0,
        color: statusInfo.color,
      };
    });
  }, [leadStatusDistributionData]);

  // Transform API data for TelecallerPerformanceChart
  const telecallerPerformanceData = useMemo(() => {
    if (!activeTelecallersData || !Array.isArray(activeTelecallersData)) return [];
    
    return activeTelecallersData.map((telecaller) => ({
      name: telecaller.name || '',
      totalLeads: telecaller.total_leads || 0,
      converted: telecaller.converted || 0,
    }));
  }, [activeTelecallersData]);

  // Transform API data for TelecallerOverview component
  const telecallerOverview = activeTelecallersData
    ? activeTelecallersData.map((telecaller) => ({
        name: telecaller.name || '',
        leads: telecaller.total_leads || 0,
        converted: telecaller.converted || 0,
        conversionRate: telecaller.conversion_rate || 0,
      }))
    : [];

  useEffect(() => {
    if (adminDashboardData) {
      setDashboardData({
        totalLeads: adminDashboardData.total_leads || 0,
        newThisWeek: adminDashboardData.new_this_week || 0,
        activeTelecallers: (adminDashboardData.total_telecallers || 0) - (adminDashboardData.inactive_telecallers || 0),
        inactiveTelecallers: adminDashboardData.inactive_telecallers || 0,
        conversions: adminDashboardData.total_conversions || 0,
        conversionRate: adminDashboardData.conversion_rate || 0,
        totalCalls: adminDashboardData.total_calls || 0,
        pendingFollowUps: adminDashboardData.pending_followups || 0,
        interestedProspects: adminDashboardData.interested_prospects || 0,
        unassignedLeads: adminDashboardData.unassigned_leads || 0,
      });
    }
  }, [adminDashboardData]);

  const metricCards = [
    {
      title: 'Total Leads',
      value: dashboardData.totalLeads.toString(),
      subtitle: `${dashboardData.newThisWeek} new this week`,
      icon: DescriptionIcon,
      iconColor: 'primary',
    },
    {
      title: 'Active Telecallers',
      value: dashboardData.activeTelecallers.toString(),
      subtitle: `${dashboardData.inactiveTelecallers} inactive`,
      icon: PeopleIcon,
      iconColor: 'primary',
    },
    {
      title: 'Conversions',
      value: dashboardData.conversions.toString(),
      subtitle: `${dashboardData.conversionRate.toFixed(1)}% conversion rate`,
      icon: AccessTimeIcon,
      iconColor: 'primary',
    },
    {
      title: 'Total Calls',
      value: dashboardData.totalCalls.toString(),
      subtitle: 'Across all leads',
      icon: PhoneIcon,
      iconColor: 'primary',
    },
    {
      title: 'Pending Follow-ups',
      value: dashboardData.pendingFollowUps.toString(),
      subtitle: 'Require attention',
      icon: WarningAmberIcon,
      iconColor: 'warning',
    },
    {
      title: 'Interested Prospects',
      value: dashboardData.interestedProspects.toString(),
      subtitle: 'High conversion potential',
      icon: TrendingUpIcon,
      iconColor: 'success',
    },
    {
      title: 'Unassigned Leads',
      value: dashboardData.unassignedLeads.toString(),
      subtitle: 'Need assignment',
      icon: ErrorOutlineIcon,
      iconColor: 'error',
    },
  ];

  if (isLoading || isLoadingTelecallers || isLoadingLeadStatus) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error loading dashboard data. Please try again later.</Typography>
      </Box>
    );
  }


  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Admin Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3, fontSize: '14px', fontWeight: 200 }}>
        Overview of lead management and team performance
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <DashboardCard {...card} sx={{ width: '260px' }} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6} sx={{ display: 'flex', width: '47%' }}>
          <Box sx={{ width: '100%' }}>
            <LeadStatusBreakdownChart data={leadStatusData} title="Lead Status Distribution" subtitle="Current status of all leads" />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', width: '47%' }}>
          <Box sx={{ width: '100%' }}>
            <TelecallerPerformanceChart data={telecallerPerformanceData} title="Telecaller Performance" subtitle="Leads assigned vs. converted" sx={{ height: 420 }} />
          </Box>
        </Grid>
      </Grid>

      {/* Telecaller Overview Section */}
      <TelecallerOverview 
        data={telecallerOverview}
        renderProgress={(telecaller) => (
          <Box sx={{ minWidth: 100, flexShrink: 0 }}>
            <LinearProgress
              variant="determinate"
              value={telecaller.conversionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#E5E7EB',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: telecaller.conversionRate > 0 ? '#10B981' : '#9CA3AF',
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        )}
      />
    </Box>
  );
};

export default DashboardContainer;
