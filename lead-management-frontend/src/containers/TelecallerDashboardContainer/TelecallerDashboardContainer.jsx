import { useMemo } from 'react';
import { Grid, Typography, Box, Chip } from '@mui/material';
import DashboardCard from '../../components/layout/DashboardCard/DashboardCard';
import DescriptionIcon from '@mui/icons-material/Description';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import { useAppContext } from '../../context/AppContext';
import ListCard from '../../components/common/ListCard/ListCard';
import { useGetRecentLeadsQuery, useGetUpcomingFollowupsQuery, useGetDashboardSummaryQuery } from '../../store/api/leadapi';

const TelecallerDashboardContainer = () => {
  const { user } = useAppContext();

  // Fetch dashboard summary from API
  const { data: dashboardSummaryData, isLoading: isLoadingDashboard } = useGetDashboardSummaryQuery();

  // Fetch recent leads from API
  const { data: recentLeadsData, isLoading: isLoadingRecentLeads, error: recentLeadsError } = useGetRecentLeadsQuery();

  // Fetch upcoming follow-ups from API
  const { data: upcomingFollowupsData, isLoading: isLoadingFollowups } = useGetUpcomingFollowupsQuery();

  // Debug: Log the API response
  console.log('Recent Leads API Response:', recentLeadsData);
  console.log('Is Loading:', isLoadingRecentLeads);
  console.log('Error:', recentLeadsError);
  console.log('Upcoming Followups API Response:', upcomingFollowupsData);

  // Transform upcoming follow-ups API response to match component format
  const upcomingFollowUps = useMemo(() => {
    if (!upcomingFollowupsData || !Array.isArray(upcomingFollowupsData)) {
      return [];
    }

    // Helper function to format date and time
    const formatDateTime = (dateStr, timeStr) => {
      try {
        const date = new Date(dateStr);
        const time = timeStr ? timeStr.split(':') : ['00', '00'];
        const hours = parseInt(time[0]);
        const minutes = time[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year} at ${displayHours}:${minutes} ${ampm}`;
      } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
      }
    };

    // Helper function to get dot color based on date
    const getDotColor = (dateStr) => {
      try {
        const reminderDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        reminderDate.setHours(0, 0, 0, 0);
        
        const diffTime = reminderDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
          return '#EF4444'; // Red for today
        } else if (diffDays === 1) {
          return '#F59E0B'; // Orange for tomorrow
        } else {
          return '#9333EA'; // Purple for later
        }
      } catch (error) {
        return '#6B7280'; // Gray for error
      }
    };

    return upcomingFollowupsData.map((followup) => ({
      name: followup.lead_name || 'N/A',
      company: followup.company || 'N/A',
      date: formatDateTime(followup.date, followup.time),
      dotColor: getDotColor(followup.date),
    }));
  }, [upcomingFollowupsData]);

  // Transform API response to match component format
  const recentLeads = useMemo(() => {
    if (!recentLeadsData || !Array.isArray(recentLeadsData)) {
      console.log('No recent leads data or not an array:', recentLeadsData);
      return [];
    }

    // Helper function to get status color
    const getStatusColor = (status) => {
      const statusLower = status?.toLowerCase() || '';
      if (statusLower === 'new') {
        return { color: '#EF4444', bgColor: '#FEE2E2' };
      } else if (statusLower === 'contacted' || statusLower === 'interested') {
        return { color: '#9333EA', bgColor: '#F3E8FF' };
      } else if (statusLower === 'follow up' || statusLower === 'follow_up') {
        return { color: '#F59E0B', bgColor: '#FEF3C7' };
      } else if (statusLower === 'not interested' || statusLower === 'not_interested') {
        return { color: '#EF4444', bgColor: '#FEE2E2' };
      } else {
        return { color: '#6B7280', bgColor: '#F3F4F6' };
      }
    };

    const transformed = recentLeadsData.map((lead) => {
      const statusColors = getStatusColor(lead.initial_status);
      return {
        id: lead.id,
        name: lead.name || 'N/A',
        phone: lead.phone || 'N/A',
        company: lead.company || 'N/A',
        status: lead.initial_status || 'Unknown',
        statusColor: statusColors.color,
        statusBgColor: statusColors.bgColor,
      };
    });

    console.log('Transformed recent leads:', transformed);
    return transformed;
  }, [recentLeadsData]);

  // Calculate conversion rate
  const conversionRate = useMemo(() => {
    const totalLeads = dashboardSummaryData?.total_leads || 0;
    const conversions = dashboardSummaryData?.conversions || 0;
    if (totalLeads === 0) return '0.0%';
    const rate = (conversions / totalLeads) * 100;
    return `${rate.toFixed(1)}%`;
  }, [dashboardSummaryData]);

  // Transform dashboard summary data for cards
  const metricCards = useMemo(() => {
    const summary = dashboardSummaryData || {
      total_leads: 0,
      new_leads: 0,
      total_calls: 0,
      conversions: 0,
      pending_followups: 0,
    };

    return [
    {
      title: 'My Leads',
        value: (summary.total_leads || 0).toString(),
        subtitle: `${summary.new_leads} new this contact`,
      icon: DescriptionIcon,
      iconColor: 'primary',
    },
    {
        title: 'Total Calls',
        value: (summary.total_calls || 0).toString(),
        subtitle: 'All Time',
      icon: PhoneIcon,
      iconColor: 'primary',
    },
    {
      title: 'My Conversions',
        value: (summary.conversions || 0).toString(),
        subtitle: `${conversionRate} conversion rate`,
      icon: TrendingUpIcon,
      iconColor: 'success',
    },
    {
      title: 'Pending Follow-ups',
        value: (summary.pending_followups || 0).toString(),
      subtitle: 'Require attention',
      icon: AccessTimeIcon,
      iconColor: 'warning',
    },
  ];
  }, [dashboardSummaryData, conversionRate]);

  return (
    <Box width={"100%"}>
      <PageHeader
        title="My Dashboard"
        subtitle={`Welcome back, ${user.name}`}
        actionButtons={''}
      />

<Grid container spacing={2} sx={{ mb: 4 }}>
  {metricCards.map((card, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <DashboardCard {...card} sx={{ width: '260px' }} />
    </Grid>
  ))}
</Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Upcoming Follow-ups */}
        <Grid item xs={12} md={6} sx={{ width: '47%', borderRadius:"10px" }}>
          <ListCard
            title="Upcoming Follow-ups"
            subtitle="Scheduled contacts with leads"
            data={upcomingFollowUps || []}
            renderItem={(item) => (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
                    {item.name}
                  </Typography>
                  <Chip
                    label={item.company}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      fontWeight: 400,
                      backgroundColor: '#F3F4F6',
                      color: '#6B7280',
                      border: 'none',
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                  {item.date}
                </Typography>
              </Box>
            )}
            renderIndicator={(item) => (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: item.dotColor,
                  mt: 0.5,
                }}
              />
            )}
          />
        </Grid>

        {/* Recent Leads */}
        <Grid item xs={12} md={6} sx={{ width: '47%' }}>
          <ListCard
            title="Recent Leads"
            subtitle="Your most recently assigned leads"
            data={recentLeads || []}
            renderItem={(item) => (
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
                    {item.name}
                  </Typography>
                  {item.status?.toLowerCase() === 'new' && (
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: '10px',
                        fontWeight: 500,
                        backgroundColor: item.statusBgColor,
                        color: item.statusColor,
                        border: 'none',
                      }}
                    />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                  {item.phone} • {item.company}
                </Typography>
              </Box>
            )}
            renderIndicator={(item) => (
              <Chip
                label={item.status}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '11px',
                  fontWeight: 400,
                  backgroundColor: '#F3F4F6',
                  color: '#6B7280',
                  border: 'none',
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Performance Summary */}
      <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
        <Grid item xs={12}>
          <Box
            sx={{
              p: 3,
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
              Performance Summary
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 200, mb: 3 }}>
              Your lead status breakdown
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                flexWrap: 'wrap',
                justifyContent: { xs: 'space-between', sm: 'flex-start' },
              }}
            >
              {/* New */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '80px' }}>
                <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 400, mb: 0.5 }}>
                  New
                </Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                  {dashboardSummaryData?.new_leads || 0}
                </Typography>
              </Box>

              {/* Follow-up */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '80px' }}>
                <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 400, mb: 0.5 }}>
                  Follow-up
                </Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                  {dashboardSummaryData?.pending_followups || 0}
                </Typography>
              </Box>

              {/* Interested */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '80px' }}>
                <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 400, mb: 0.5 }}>
                  Interested
                </Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                  {dashboardSummaryData?.interested_leads || 0}
                </Typography>
              </Box>

              {/* Converted */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '80px' }}>
                <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 400, mb: 0.5 }}>
                  Converted
                </Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                  {dashboardSummaryData?.conversions || 0}
                </Typography>
              </Box>

              {/* Total Calls */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '80px' }}>
                <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 400, mb: 0.5 }}>
                  Total Calls
                </Typography>
                <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                  {dashboardSummaryData?.total_calls || 0}
                </Typography>
              </Box>

              {/* Conv. Rate */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '100px' }}>
                <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 400, mb: 0.5 }}>
                  Conv. Rate
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ fontSize: '20px', fontWeight: 500, color: '#111827' }}>
                    {conversionRate}
                  </Typography>
                  <TrendingUpOutlinedIcon sx={{ fontSize: '16px', color: '#10B981' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

    </Box>
  );
};

export default TelecallerDashboardContainer;

