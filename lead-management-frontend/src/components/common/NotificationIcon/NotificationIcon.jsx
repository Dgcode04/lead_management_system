import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = ({ count = 0 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/telecaller/reminder');
  };

  return (
    <IconButton 
      color="inherit" 
      aria-label="notifications"
      onClick={handleClick}
    >
      <Badge badgeContent={count > 0 ? count : null} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationIcon;

