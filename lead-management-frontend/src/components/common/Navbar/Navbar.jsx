import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import UserProfile from '../UserProfile/UserProfile';
import { useAppContext } from '../../../context/AppContext';
import { useGetTelecallerOverdueRemindersQuery } from '../../../store/api/leadapi';
import { useMemo } from 'react';

const Navbar = () => {
  const { user } = useAppContext();
  const isTelecaller = user?.role === 'Telecaller';
  const telecallerId = user?.id;

  // Fetch reminders count for notification badge
  const { data: overdueRemindersData } = useGetTelecallerOverdueRemindersQuery(telecallerId, {
    skip: !telecallerId || !isTelecaller,
  });

  // Calculate pending reminders count
  const pendingRemindersCount = useMemo(() => {
    if (!overdueRemindersData?.pending || !Array.isArray(overdueRemindersData.pending)) {
      return 0;
    }
    return overdueRemindersData.pending.length;
  }, [overdueRemindersData]);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#FFFFFF',
        color: '#111827',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 0 }}>
          <PeopleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
            Lead Management
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isTelecaller && <NotificationIcon count={pendingRemindersCount} />}
          <UserProfile />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

