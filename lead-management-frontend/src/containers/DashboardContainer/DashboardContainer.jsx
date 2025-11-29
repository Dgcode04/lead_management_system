import { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, LinearProgress } from '@mui/material';
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

const DashboardContainer = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 10,
    activeTelecallers: 2,
    conversions: 1,
    totalCalls: 5,
    pendingFollowUps: 2,
    interestedProspects: 2,
    unassignedLeads: 0,
  });

  // Pie chart data for Lead Status Distribution
  const leadStatusData = [
    { name: 'Follow-up', value: 20, color: '#F59E0B' },
    { name: 'Interested', value: 20, color: '#10B981' },
    { name: 'Converted', value: 10, color: '#059669' },
    { name: 'Not Interested', value: 10, color: '#EF4444' },
    { name: 'New', value: 20, color: '#3B82F6' },
    { name: 'Contacted', value: 20, color: '#9333EA' },
  ];

  // Bar chart data for Telecaller Performance
  const telecallerPerformanceData = [
    { name: 'Sarah', converted: 0, totalLeads: 3 },
    { name: 'Michael', converted: 1, totalLeads: 3 },
  ];

  // Telecaller overview data
  const telecallerOverview = [
    {
      name: 'Sarah Johnson',
      leads: 5,
      converted: 0,
      conversionRate: 0,
    },
    {
      name: 'Michael Chen',
      leads: 5,
      converted: 1,
      conversionRate: 20,
    },
  ];

  useEffect(() => {
    // In a real app, this would fetch from an API
  }, []);

  const metricCards = [
    {
      title: 'Total Leads',
      value: dashboardData.totalLeads.toString(),
      subtitle: '2 new this week',
      icon: DescriptionIcon,
      iconColor: 'primary',
    },
    {
      title: 'Active Telecallers',
      value: dashboardData.activeTelecallers.toString(),
      subtitle: '1 inactive',
      icon: PeopleIcon,
      iconColor: 'primary',
    },
    {
      title: 'Conversions',
      value: dashboardData.conversions.toString(),
      subtitle: '10.0% conversion rate',
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
