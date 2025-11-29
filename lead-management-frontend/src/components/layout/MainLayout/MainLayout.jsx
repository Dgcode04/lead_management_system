import { Box } from '@mui/material';
import Navbar from '../../common/Navbar/Navbar';
import Sidebar from '../../common/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: "20px 24px",
          mt: 8,
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;

