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
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { NAVIGATION_ITEMS } from '../../../utils/constants';
import { useAppContext } from '../../../context/AppContext';

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
    logout();
    navigate('/login');
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
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
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
        <Typography sx={{ fontWeight: 400, fontSize: '12px' }}>
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
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Log out
          <ArrowForwardIcon sx={{ fontSize: '14px', ml: 0.5 }} />
        </Link>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

