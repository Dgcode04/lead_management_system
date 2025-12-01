import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Link,
  Badge,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { NAVIGATION_ITEMS } from '../../../utils/constants';
import { useAppContext } from '../../../context/AppContext';
import { useGetTelecallerOverdueRemindersQuery } from '../../../store/api/leadapi';
import { useMemo, useState } from 'react';
import Modal from '../Modal/Modal';

const drawerWidth = 210;

const iconMap = {
  Dashboard: DashboardIcon,
  Description: DescriptionIcon,
  Person: PersonIcon,
  BarChart: BarChartIcon,
  Notifications: MarkChatUnreadOutlinedIcon,
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAppContext();
  const isTelecaller = user?.role === 'Telecaller';
  const telecallerId = user?.id;
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fetch reminders count for telecallers
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

  // Filter navigation items based on user role
  const getNavigationItems = () => {
    if (!user?.role) return [];
    return NAVIGATION_ITEMS.filter((item) => item.roles?.includes(user.role));
  };

  const handleNavigation = (path) => {
    // Adjust path for telecaller role
    if (user?.role === 'Telecaller') {
      if (path === '/') {
        navigate('/telecaller');
      } else if (path === '/leads') {
        navigate('/telecaller/leads');
      } else if (path === '/reminder') {
        navigate('/telecaller/reminder');
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          top: 64, // Navbar height
          position: 'fixed',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 0, flexGrow: 1, pt: 2 }}>
        <List>
          {navigationItems.map((item) => {
            const IconComponent = iconMap[item.icon];
            // Check if current path matches (handle both admin and telecaller routes)
            const isSelected =
              location.pathname === item.path ||
              (user?.role === 'Telecaller' &&
                ((item.path === '/' && location.pathname === '/telecaller') ||
                  (item.path === '/leads' && location.pathname === '/telecaller/leads') ||
                  (item.path === '/reminder' && location.pathname === '/telecaller/reminder')));

            return (
              <ListItem key={item.id} disablePadding>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: '10px',
                    margin: '3px 8px',
                    padding: '4px 8px',
                    '&.Mui-selected': {
                      backgroundColor: 'primary.gray',
                      color: 'text.primary',
                     
                      '&:hover': {
                        backgroundColor: 'primary.gray',
                       
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'text.primary',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? 'text.primary' : 'text.primary',
                      minWidth: 30,
                      '& .MuiSvgIcon-root': {
                        fontSize: '14px',
                      },
                    }}
                  >
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        >
                          {item.label}
                        </Typography>
                        {item.id === 'reminder' && pendingRemindersCount > 0 && (
                          <Box
                            sx={{
                              backgroundColor: '#EF4444',
                              color: '#FFFFFF',
                              borderRadius: '10px',
                              minWidth: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '0 6px',
                              fontSize: '11px',
                              fontWeight: 600,
                            }}
                          >
                            {pendingRemindersCount}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  
                </ListItemButton>

              </ListItem>
            );
          })}
        </List>
      </Box>
      
      {/* Logout Section at Bottom */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #E5E7EB',
          mt: 'auto',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: '11px', display: 'block',}}
        >
          Logged in as
        </Typography>
        <Typography sx={{ fontWeight: 400, fontSize: '14px' }}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px', display: 'block', mb: 1.5 }}>
          {user?.role || 'Role'}
        </Typography>
        <Link
          component="button"
          onClick={handleLogout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#EF4444',
            fontSize: '13px',
            textDecoration: 'none',
            fontWeight: 600,
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          <LogoutOutlinedIcon sx={{ fontSize: '16px', fontWeight:600, ml: 0.5 }} />
          Log out
        </Link>
      </Box>

      {/* Logout Confirmation Modal */}
      <Modal
        open={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        // title="Confirm Logout"
        title="Are you sure you want to log out?"
        maxWidth="md"
        primaryButton={{
          label: 'Logout',
          onClick: handleConfirmLogout,
          danger: true,
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: handleCloseLogoutModal,
        }}
      >
        <Typography variant="body2" color="text.secondary">
        You will be returned to the login screen. Any unsaved changes will be lost.
        </Typography>
      </Modal>
    </Drawer>
  );
};

export default Sidebar;

