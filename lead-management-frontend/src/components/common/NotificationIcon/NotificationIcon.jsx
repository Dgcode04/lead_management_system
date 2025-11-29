import { Badge, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationIcon = () => {
  return (
    <IconButton color="inherit" aria-label="notifications">
      <Badge badgeContent={3} color="error">
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationIcon;

