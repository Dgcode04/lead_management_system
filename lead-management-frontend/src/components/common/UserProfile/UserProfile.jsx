import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppContext } from '../../../context/AppContext';
import { useLogoutMutation } from '../../../store/api/authapi';
import Modal from '../Modal/Modal';

const UserProfile = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      // Call logout API endpoint
      await logoutApi().unwrap();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Always clear local state and navigate
      logout();
      navigate('/login');
    }
  };

  if (!user || !user.name) {
    return null;
  }

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 40,
            height: 40,
            fontSize: '0.875rem',
          }}
        >
          {user.initials}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
            {user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role}
          </Typography>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <MenuItem
          sx={{
            fontSize: '16px',
            fontWeight: 600,
            py: 1.5,
            px: 2,
          }}
        >
          My Account
        </MenuItem>
        <MenuItem
          onClick={handleLogoutClick}
          disabled={isLoggingOut}
          sx={{
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <LogoutIcon
            sx={{
              fontSize: 18,
              color: 'text.secondary',
              mr: 1.5,
            }}
          />
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </MenuItem>
      </Menu>

      <Modal
        open={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        title="Are you sure you want to log out?"
        subtitle="You will be returned to the login screen. Any unsaved changes will be lost."
        maxWidth="md"
        primaryButton={{
          label: 'Log out',
          onClick: handleLogoutConfirm,
          disabled: isLoggingOut,
          danger: true,
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: handleLogoutCancel,
        }}
      >
        <Box />
      </Modal>
    </>
  );
};

export default UserProfile;

