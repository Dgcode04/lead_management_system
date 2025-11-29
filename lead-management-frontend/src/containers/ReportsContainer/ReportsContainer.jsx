import { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import FilterSection from '../../components/common/FilterSection/FilterSection';
import DashboardCard from '../../components/layout/DashboardCard/DashboardCard';
import DailyActivityChart from '../../components/common/DailyActivityChart/DailyActivityChart';
import LeadStatusBreakdownChart from '../../components/common/LeadStatusBreakdownChart/LeadStatusBreakdownChart';
import TelecallerPerformanceChart from '../../components/common/TelecallerPerformanceChart/TelecallerPerformanceChart';
import LeadSourcesChart from '../../components/common/LeadSourcesChart/LeadSourcesChart';

const ReportsContainer = () => {
  const [dateFilter, setDateFilter] = useState('Last 7 days');
  const [telecallerFilter, setTelecallerFilter] = useState('All Telecallers');
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 0,
    conversions: 0,
    totalCalls: 0,
    avgCallsLead: 0,
    convertRate: 0,
  });

  // Sample data for Daily Activity Chart (Last 7 Days)
  const dailyActivityData = [
    { date: 'Nov 20', calls: 0, leads: 0 },
    { date: 'Nov 21', calls: 0, leads: 0 },
    { date: 'Nov 22', calls: 0, leads: 0 },
    { date: 'Nov 23', calls: 0, leads: 0 },
    { date: 'Nov 24', calls: 0, leads: 0 },
    { date: 'Nov 25', calls: 0, leads: 0 },
    { date: 'Nov 26', calls: 0, leads: 0 },
  ];

  // Sample data for Lead Status Breakdown
  const leadStatusData = [
    { name: 'New', value: 20, color: '#3B82F6' },
    { name: 'Not Interested', value: 1, color: '#EF4444' },
    { name: 'Interested', value: 20, color: '#10B981' },
    { name: 'Follow-up', value: 20, color: '#F59E0B' },
    { name: 'Contacted', value: 20, color: '#9333EA' },
    { name: 'Converted', value: 10, color: '#059669' },
  ];

  // Sample data for Telecaller Performance Comparison
  const telecallerPerformanceData = [
    { name: 'Sarah', totalLeads: 5, callsMade: 3, converted: 0 },
    { name: 'Michael', totalLeads: 5, callsMade: 2, converted: 1 },
  ];

  // Sample data for Lead Sources
  const leadSourcesData = [
    { name: 'Website', leads: 2 },
    { name: 'Referral', leads: 2 },
    { name: 'LinkedIn', leads: 2 },
    { name: 'Google Ads', leads: 2 },
    { name: 'Trade Show', leads: 2 },
  ];

  useEffect(() => {
    // In a real app, this would fetch reports from an API
    // fetchReports().then(setReports);
  }, []);

  const actionButtons = [
    {
      label: 'Export Report',
      variant: 'contained',
      startIcon: <AddIcon />, 
      onClick: () => console.log('Import reports'),
    },
  ]


  const filters = [
    {
      value: dateFilter,
      onChange: (value) => {
        setDateFilter(value);
        console.log('Filter by date:', value);
      },
      options: ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 60 days', 'Last 90 days'],
    },
    {
      value: telecallerFilter,
      onChange: (value) => {
        setTelecallerFilter(value);
        console.log('Filter by telecaller:', value);
      },
      options: ['All Telecallers', 'Sarah Johnson', 'Michael Chen'],
    },
  ];

  const metricCards = [
    {
      title: 'Total Leads',
      value: dashboardData.totalLeads.toString(),
      subtitle: 'In selected period',
    },
    {
      title: 'Converted',
      value: dashboardData.conversions.toString(),
      subtitle: '0% rate',
    },
    {
      title: 'Total Calls',
      value: dashboardData.totalCalls.toString(),
      subtitle: 'All activity',
    },
    {
      title: 'Avg. Calls/Lead',
      value: dashboardData.avgCallsLead.toString(),
      subtitle: 'per lead ratio',
    },
    {
      title: 'Conv. Rate',
      value: dashboardData.convertRate.toString(),
      subtitle: 'Target: 15%',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Performance insights and data analysis"
        actionButtons={actionButtons}
      />
      {/* Reports UI will be implemented here */}
      <FilterSection
        title="Filters"
        subtitle="Customize your report view"
        filters={filters}
        
      />

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...card} sx={{ width: '190px' }} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', width: '47%' }}>
          <Box sx={{ width: '100%' }} >
            <DailyActivityChart data={dailyActivityData} />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', width: '47%' }}>
          <Box sx={{ width: '100%' }}>
            <LeadStatusBreakdownChart data={leadStatusData} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ width: '100%' }}>
            <TelecallerPerformanceChart data={telecallerPerformanceData} />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
          <Box sx={{ width: '100%' }}>
            <LeadSourcesChart data={leadSourcesData} />
          </Box>
      </Grid>
      
    </Box>
  );
};

export default ReportsContainer;

