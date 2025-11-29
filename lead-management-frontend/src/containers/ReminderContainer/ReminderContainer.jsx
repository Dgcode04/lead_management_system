import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Paper, Checkbox, Button, Chip } from '@mui/material';
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

const ReminderContainer = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const isTelecaller = user?.role === 'Telecaller';

  // Sample overdue reminders data
  const overdueReminders = [
    {
      id: 'R001',
      title: "Follow-up call with Emma",
      description: "Discuss product demo scheduling",
      dueDate: "Oct 12, 2025",
      dueTime: "3:30 PM",
      personName: "Emma Wilson",
      company: "Global Marketing Co",
      leadId: "L002",
      completed: false,
    },
    {
      id: 'R002',
      title: "Check on Lisa's implementation questions",
      description: null,
      dueDate: "Oct 11, 2025",
      dueTime: "7:30 PM",
      personName: "Lisa Anderson",
      company: "Digital Ventures",
      leadId: "L004",
      completed: false,
    },
    {
      id: 'R003',
      title: "Follow-up with Thomas",
      description: null,
      dueDate: "Oct 11, 2025",
      dueTime: "8:30 PM",
      personName: "Thomas Harris",
      company: "Retail Masters",
      leadId: "L009",
      completed: false,
    },
  ];

  const [reminders, setReminders] = useState(overdueReminders);
  const [overdue, setOverdue] = useState({
    overDue: 3,
    todayOverdue: 0,
    upcomingOverdue: 0,
    completed: 0,
  });

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
    // In a real app, this would fetch reminders from an API
    // fetchReminders().then(setReminders);
  }, []);

  const handleToggleComplete = (reminderId) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, completed: !reminder.completed }
        : reminder
    ));
  };

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
          {reminders.map((reminder) => (
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
          ))}
        </Box>
      </Box>

    </Box>
  );
};

export default ReminderContainer;

