import { useState, useMemo } from 'react';
import { Box, Grid, CircularProgress, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import FilterSection from '../../components/common/FilterSection/FilterSection';
import DashboardCard from '../../components/layout/DashboardCard/DashboardCard';
import DailyActivityChart from '../../components/common/DailyActivityChart/DailyActivityChart';
import LeadStatusBreakdownChart from '../../components/common/LeadStatusBreakdownChart/LeadStatusBreakdownChart';
import TelecallerPerformanceChart from '../../components/common/TelecallerPerformanceChart/TelecallerPerformanceChart';
import LeadSourcesChart from '../../components/common/LeadSourcesChart/LeadSourcesChart';
import { useGetReportsDataQuery, useExportReportsCsvMutation } from '../../store/api/leadapi';
import { useGetAllTelecallersQuery } from '../../store/api/telecallersapi';

const ReportsContainer = () => {
  const [dateFilter, setDateFilter] = useState('Last 7 days');
  const [telecallerFilter, setTelecallerFilter] = useState('All Telecallers');
  const [exportReportsCsv, { isLoading: isExportingCsv }] = useExportReportsCsvMutation();
  
  // Fetch telecallers from API
  const { data: telecallersData, isLoading: isLoadingTelecallers } = useGetAllTelecallersQuery();
  
  // Convert date filter string to number
  const getDayFromFilter = (filter) => {
    const match = filter.match(/\d+/);
    return match ? parseInt(match[0], 10) : 7;
  };

  // Get telecaller ID from selected telecaller name
  const getTelecallerId = useMemo(() => {
    if (telecallerFilter === 'All Telecallers' || !telecallersData) {
      return null;
    }

    // Find telecaller by name
    let telecallers = [];
    if (Array.isArray(telecallersData)) {
      telecallers = telecallersData;
    } else if (Array.isArray(telecallersData?.data)) {
      telecallers = telecallersData.data;
    }

    const selectedTelecaller = telecallers.find(
      (telecaller) => telecaller.name === telecallerFilter
    );

    return selectedTelecaller?.id || null;
  }, [telecallerFilter, telecallersData]);

  const dayParam = getDayFromFilter(dateFilter);
  const { data: reportsData, isLoading, isError } = useGetReportsDataQuery({
    day: dayParam,
    telecaller_id: getTelecallerId,
  });

  // Transform API response to dashboard data
  const dashboardData = useMemo(() => {
    if (!reportsData) {
      return {
        totalLeads: 0,
        conversions: 0,
        totalCalls: 0,
        avgCallsLead: 0,
        convertRate: 0,
      };
    }

    return {
      totalLeads: reportsData.total_leads || 0,
      conversions: reportsData.converted || 0,
      totalCalls: reportsData.total_calls || 0,
      avgCallsLead: reportsData.avg_calls_per_lead || 0,
      convertRate: reportsData.conversion_rate || 0,
    };
  }, [reportsData]);

  // Transform chart data for Daily Activity Chart
  const dailyActivityData = useMemo(() => {
    if (!reportsData?.chart) {
      return [];
    }

    return reportsData.chart.map((item) => {
      // Format date from "2025-11-29" to "Nov 29"
      const date = new Date(item.date);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        date: formattedDate,
        calls: item.total_calls || 0,
        leads: item.total_leads || 0,
      };
    });
  }, [reportsData]);

  const handleExport = async () => {
    try {
      const result = await exportReportsCsv(dayParam).unwrap();
  
      // Create a download URL
      const url = window.URL.createObjectURL(result);
      const link = document.createElement("a");
  
      link.href = url;
      link.download = "lead_report.csv";
      document.body.appendChild(link);
      link.click();
  
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("CSV export failed:", error);
    }
  };
  

  // Transform status summary data
  const leadStatusData = useMemo(() => {
    const statusMap = {
      new: { name: 'New', color: '#3B82F6' },
      contacted: { name: 'Contacted', color: '#9333EA' },
      interested: { name: 'Interested', color: '#10B981' },
      follow_up: { name: 'Follow-up', color: '#F59E0B' },
      not_interested: { name: 'Not Interested', color: '#EF4444' },
      converted: { name: 'Converted', color: '#059669' },
    };

    if (!reportsData?.status_summary) {
      return [];
    }

    return reportsData.status_summary.map((item) => ({
      name: statusMap[item.status]?.name || item.status,
      value: item.count || 0,
      color: statusMap[item.status]?.color || '#6B7280',
    }));
  }, [reportsData]);

  // Transform telecaller summary data
  const telecallerPerformanceData = useMemo(() => {
    if (!reportsData?.telecaller_summary) {
      return [];
    }

    return reportsData.telecaller_summary.map((item) => ({
      name: item.name || '',
      totalLeads: item.total_leads || 0,
      callsMade: item.total_calls || 0,
      converted: item.converted || 0,
    }));
  }, [reportsData]);

  // Transform source summary data
  const leadSourcesData = useMemo(() => {
    if (!reportsData?.source_summary) {
      return [];
    }

    return reportsData.source_summary.map((item) => ({
      name: item.source
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      leads: item.total_leads || 0,
    }));
  }, [reportsData]);

  // Transform telecallers data to options format for Selector component
  const telecallerOptions = useMemo(() => {
    // Add "All Telecallers" option first
    const options = ['All Telecallers'];
    
    if (!telecallersData) return options;
    
    // If API returns array directly
    if (Array.isArray(telecallersData) && telecallersData.length > 0) {
      const telecallers = telecallersData.map((telecaller) => telecaller.name || '');
      return [...options, ...telecallers];
    }
    
    // If API returns object with data property: {data: [...]}
    if (telecallersData?.data && Array.isArray(telecallersData.data)) {
      const telecallers = telecallersData.data.map((telecaller) => telecaller.name || '');
      return [...options, ...telecallers];
    }
    
    return options;
  }, [telecallersData]);

  const actionButtons = [
    {
      label: isExportingCsv ? 'Exporting...' : 'Export Report',
      variant: 'contained',
      startIcon: <AddIcon />, 
      onClick: handleExport,
    },
  ]


  const filters = [
    {
      value: dateFilter,
      onChange: (value) => {
        setDateFilter(value);
      },
      options: ['Last 7 days', 'Last 14 days', 'Last 30 days', 'Last 60 days', 'Last 90 days'],
    },
    {
      value: telecallerFilter,
      onChange: (value) => {
        setTelecallerFilter(value);
      },
      options: telecallerOptions,
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
      subtitle: `${dashboardData.convertRate.toFixed(1)}% rate`,
    },
    {
      title: 'Total Calls',
      value: dashboardData.totalCalls.toString(),
      subtitle: 'All activity',
    },
    {
      title: 'Avg. Calls/Lead',
      value: dashboardData.avgCallsLead.toFixed(2),
      subtitle: 'per lead ratio',
    },
    {
      title: 'Conv. Rate',
      value: `${dashboardData.convertRate.toFixed(1)}%`,
      subtitle: 'Target: 15%',
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        <PageHeader
          title="Reports & Analytics"
          subtitle="Performance insights and data analysis"
          actionButtons={actionButtons}
        />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">Error loading reports data. Please try again later.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Performance insights and data analysis"
        actionButtons={actionButtons}
      />
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

