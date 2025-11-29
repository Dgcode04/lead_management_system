import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const LoginForm = ({ onLogin, onDemoLogin, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    onLogin(email, password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7EB',
        padding: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 64,
                height: 64,
                mb: 2,
              }}
            >
              <SettingsIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, textAlign: 'center' }}>
              Lead Management System
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Sign in to your account to continue
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize:"15px" }}>
                Email
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="name@company.com"
                size="small"
                required
                autoComplete="email"
                sx={{
                  backgroundColor: '#F3F3F5',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: `1px solid gray`,
                      borderRadius: '10px',
                      boxShadow: `0 0 0 5px lightgray`,
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, fontSize:"15px" }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type="password"
                placeholder="Enter password"
                size="small"
                required
                autoComplete="current-password"
                sx={{
                  backgroundColor: '#F3F3F5',
                  borderRadius: '10px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      border: 'none',
                    },
                    '&:hover fieldset': {
                      border: 'none',
                    },
                    '&.Mui-focused fieldset': {
                      border: `1px solid gray`,
                      borderRadius: '10px',
                      boxShadow: `0 0 0 5px lightgray`,
                    },
                  },
                }}
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                mb: 1,
                py: 1,
                backgroundColor: '#000000',
                borderRadius: '8px',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
              disabled={loading}
              endIcon={<ArrowForwardIcon />}
            >
              Sign In
            </Button>
          </form>

          <Divider sx={{ my: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Quick Login (Demo)
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              fullWidth
              variant="text"
              size="medium"
              onClick={() => onDemoLogin('admin@company.com', 'demo')}
              disabled={loading}
            //   startIcon={<PersonIcon />}
              sx={{
                fontSize:"14px",
                fontWeight:600,
                border: '1px solid #E5E7EB',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: '#F3F3F5',
                  border: 'none',
                },
              }}
            >
              Admin Demo
            </Button>
            <Button
              fullWidth
              variant="text"
            //   size="medium"
              onClick={() => onDemoLogin('sarah@company.com', 'demo')}
              disabled={loading}
            //   startIcon={<PersonIcon />}
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                border: '1px solid #E5E7EB',
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: '#F3F3F5',
                  border: 'none',
                },
              }}
            >
              Telecaller Demo
            </Button>
          </Box>

          <Box
            sx={{
            //   backgroundColor: '#F9FAFB',
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Typography variant="subtitle2" color='text.secondary' sx={{fontSize:"15px", fontWeight: 500, mb: 1 }}>
              Demo Accounts:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Admin: admin@company.com
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Telecaller: sarah@company.com
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Password: any (demo mode)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;

