import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Checkbox, Button, Chip, CircularProgress } from '@mui/material';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import DashboardCard from '../../components/layout/DashboardCard/DashboardCard';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useAppContext } from '../../context/AppContext';
import { useGetTelecallerOverdueRemindersQuery, useUpdateReminderMutation } from '../../store/api/leadapi';
import { toast } from 'react-toastify';

const ReminderContainer = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const isTelecaller = user?.role === 'Telecaller';
  const telecallerId = user?.id;

  // Fetch overdue reminders from API
  const { 
    data: overdueRemindersData, 
    isLoading: isLoadingReminders, 
    error: remindersError,
    refetch: refetchReminders
  } = useGetTelecallerOverdueRemindersQuery(telecallerId, {
    skip: !telecallerId || !isTelecaller, // Only fetch for telecallers with valid ID
  });

  // Update reminder mutation
  const [updateReminder, { isLoading: isUpdatingReminder }] = useUpdateReminderMutation();

  // Transform API response to match component format
  const transformReminder = (reminder, isCompleted = false) => {
    // Format date from "2025-02-18T10:00:00" to "Feb 18, 2025"
    const dateObj = new Date(reminder.reminder_date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // reminder_time is already formatted (e.g., "10:00 AM")
    const formattedTime = reminder.reminder_time || '';
    
    return {
      id: reminder.reminder_id?.toString() || '',
      title: reminder.title || '',
      description: reminder.description || null,
      dueDate: formattedDate,
      dueTime: formattedTime,
      personName: reminder.lead_name || '',
      company: reminder.lead_company || '',
      leadId: reminder.lead_id?.toString() || '',
      completed: isCompleted,
      reminderDate: reminder.reminder_date, // Keep original date for comparison
    };
  };

  // Transform pending reminders
  const pendingReminders = useMemo(() => {
    if (!overdueRemindersData?.pending || !Array.isArray(overdueRemindersData.pending)) return [];
    return overdueRemindersData.pending.map((reminder) => transformReminder(reminder, false));
  }, [overdueRemindersData]);

  // Transform completed reminders
  const completedReminders = useMemo(() => {
    if (!overdueRemindersData?.completed || !Array.isArray(overdueRemindersData.completed)) return [];
    return overdueRemindersData.completed.map((reminder) => transformReminder(reminder, true));
  }, [overdueRemindersData]);

  // Calculate metrics from API data
  const overdue = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let todayOverdue = 0;
    let upcomingOverdue = 0;
    const completed = completedReminders.length;
    
    pendingReminders.forEach((reminder) => {
      // Use the original reminder_date for comparison
      const reminderDate = new Date(reminder.reminderDate);
      reminderDate.setHours(0, 0, 0, 0);
      
      if (reminderDate.getTime() === today.getTime()) {
        todayOverdue++;
      } else if (reminderDate < today) {
        // Overdue (past due date)
      } else if (reminderDate > today) {
        upcomingOverdue++;
      }
    });
    
    return {
      overDue: pendingReminders.length,
      todayOverdue,
      upcomingOverdue,
      completed,
    };
  }, [pendingReminders, completedReminders]);

  const [pendingRemindersState, setPendingRemindersState] = useState([]);
  const [completedRemindersState, setCompletedRemindersState] = useState([]);

  const metricCards = [
    {
      title: 'Overdue',
      value: overdue.overDue.toString(),
      subtitle: 'Needs immediate attention',
      icon: ErrorOutlineOutlinedIcon,
      iconColor: 'warning',
    },
    {
      title: 'Today',
      value: overdue.todayOverdue.toString(),
      subtitle: 'Due today',
      icon: CalendarTodayOutlinedIcon,
      iconColor: 'warning',
    },
    {
      title: 'Upcoming Overdue',
      value: overdue.upcomingOverdue.toString(),
      subtitle: 'Due soon',
      icon: AccessTimeOutlinedIcon,
      iconColor: 'warning',
    },
    {
      title: 'Completed',
      value: overdue.completed.toString(),
      subtitle: 'Completed tasks',
      icon: CheckCircleOutlineOutlinedIcon,
      iconColor: 'success',
    },
  ];
  useEffect(() => {
    setPendingRemindersState(pendingReminders);
    setCompletedRemindersState(completedReminders);
  }, [pendingReminders, completedReminders]);

  const handleToggleComplete = async (reminderId) => {
    // Find the reminder in pending or completed lists
    const pendingReminder = pendingRemindersState.find(r => r.id === reminderId);
    const completedReminder = completedRemindersState.find(r => r.id === reminderId);
    const reminder = pendingReminder || completedReminder;
    
    if (!reminder) return;

    const newCompleteStatus = !reminder.completed;
    const updatedReminder = { ...reminder, completed: newCompleteStatus };

    // Optimistically update UI - move reminder between lists
    if (newCompleteStatus) {
      // Moving from pending to completed
      setPendingRemindersState(pendingRemindersState.filter(r => r.id !== reminderId));
      setCompletedRemindersState([...completedRemindersState, updatedReminder]);
    } else {
      // Moving from completed to pending
      setCompletedRemindersState(completedRemindersState.filter(r => r.id !== reminderId));
      setPendingRemindersState([...pendingRemindersState, updatedReminder]);
    }

    try {
      // Call API to update reminder
      await updateReminder({
        reminderId: parseInt(reminderId),
        complete: newCompleteStatus,
      }).unwrap();

      // Refetch reminders to ensure data is in sync
      await refetchReminders();
      toast.success('Reminder updated successfully!');
    } catch (error) {
      console.error('Error updating reminder:', error);
      
      // Revert optimistic update on error
      if (newCompleteStatus) {
        // Revert: move back to pending
        setCompletedRemindersState(completedRemindersState.filter(r => r.id !== reminderId));
        setPendingRemindersState([...pendingRemindersState, reminder]);
      } else {
        // Revert: move back to completed
        setPendingRemindersState(pendingRemindersState.filter(r => r.id !== reminderId));
        setCompletedRemindersState([...completedRemindersState, reminder]);
      }

      const errorMessage = 
        error?.data?.message || 
        error?.data?.error || 
        error?.message ||
        'Failed to update reminder. Please try again.';
      toast.error(errorMessage);
    }
  };

  if (isLoadingReminders) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (remindersError) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading reminders. Please try again later.
        </Typography>
      </Box>
    );
  }

  const handleViewLead = (leadId) => {
    if (isTelecaller) {
      navigate(`/telecaller/leads/${leadId}`);
    } else {
      navigate(`/leads/${leadId}`);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Reminders & Follow-ups"
        subtitle="Manage your scheduled tasks and follow-ups"
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <DashboardCard {...card} sx={{ width: '260px' }} />
          </Grid>
        ))}
      </Grid>

      {/* Overdue Reminders Section */}
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid #FECACA',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <ErrorOutlineOutlinedIcon sx={{ color: '#EF4444', fontSize: 20 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#EF4444' }}>
            Overdue Reminders
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '14px' }}>
          These tasks are past their due date
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {pendingRemindersState.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              No overdue reminders found.
            </Typography>
          ) : (
            pendingRemindersState.map((reminder) => (
            <Paper
              key={reminder.id}
              sx={{
                p: 2,
                backgroundColor: '#FEE2E2',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                border: '1px solid #FECACA',
              }}
            >
              {/* Checkbox */}
              <Checkbox
                checked={reminder.completed}
                onChange={() => handleToggleComplete(reminder.id)}
                disabled={isUpdatingReminder}
                sx={{
                  mt: 0.5,
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                  },
                }}
              />

              {/* Content */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: '14px',
                    mb: reminder.description ? 0.5 : 1,
                    color: '#1F2937',
                  }}
                >
                  {reminder.title}
                </Typography>
                {reminder.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '12px', mb: 1, color: '#6B7280' }}
                  >
                    {reminder.description}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                      {reminder.dueDate}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                      {reminder.dueTime}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                    •
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                    {reminder.personName}
                  </Typography>
                  <Chip
                    label={reminder.company}
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
              </Box>

              {/* View Lead Button */}
              <Button
                variant="text"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                onClick={() => handleViewLead(reminder.leadId)}
                sx={{
                  textTransform: 'none',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                View Lead
              </Button>
            </Paper>
            ))
          )}
        </Box>
      </Box>

      {/* Completed Reminders Section */}
      {completedRemindersState.length > 0 && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid #D1FAE5',
            mb: 4,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircleOutlineOutlinedIcon sx={{ color: '#10B981', fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#10B981' }}>
              Completed Reminders
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: '14px' }}>
            Tasks that have been completed
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {completedRemindersState.map((reminder) => (
              <Paper
                key={reminder.id}
                sx={{
                  p: 2,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  border: '1px solid #D1FAE5',
                  opacity: 0.8,
                }}
              >
                {/* Checkbox */}
                <Checkbox
                  checked={reminder.completed}
                  onChange={() => handleToggleComplete(reminder.id)}
                  disabled={isUpdatingReminder}
                  sx={{
                    '&.Mui-checked': {
                      color: 'gray',
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#10B981',
                    },
                    mt: 0.5,
                    '& .MuiSvgIcon-root': {
                      fontSize: 20,
                    },
                  }}
                />

                {/* Content */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      fontSize: '14px',
                      mb: reminder.description ? 0.5 : 1,
                      color: '#1F2937',
                      textDecoration: 'line-through',
                    }}
                  >
                    {reminder.title}
                  </Typography>
                  {reminder.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: '12px', mb: 1, color: '#6B7280', textDecoration: 'line-through' }}
                    >
                      {reminder.description}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                        {reminder.dueDate}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                        {reminder.dueTime}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                      •
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '12px', color: '#6B7280' }}>
                      {reminder.personName}
                    </Typography>
                    <Chip
                      label={reminder.company}
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
                </Box>

                {/* View Lead Button */}
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                  onClick={() => handleViewLead(reminder.leadId)}
                  sx={{
                    textTransform: 'none',
                    color: '#374151',
                    fontSize: '13px',
                    fontWeight: 500,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  View Lead
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      )}

    </Box>
  );
};

export default ReminderContainer;

