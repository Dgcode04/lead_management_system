import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import NotificationIcon from '../NotificationIcon/NotificationIcon';
import UserProfile from '../UserProfile/UserProfile';

const Navbar = () => {
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
          <NotificationIcon />
          <UserProfile />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

