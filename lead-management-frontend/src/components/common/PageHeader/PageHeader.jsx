import { Box, Typography, Button } from '@mui/material';

const PageHeader = ({ title, subtitle, actionButtons = [] }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionButtons.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || 'outlined'}
              startIcon={button.startIcon}
              onClick={button.onClick}
              sx={{
                ...(button.variant === 'contained'
                  ? {
                      backgroundColor: '#000000',
                      color: '#FFFFFF',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#333333',
                      },
                    }
                  : {
                      borderColor: '#E5E7EB',
                      color: 'text.primary',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#D1D5DB',
                        backgroundColor: '#F9FAFB',
                      },
                    }),
                    borderRadius: '10px',
                    padding: '8px 16px',
                    gap: '8px',
                    ...button.sx,
              }}
            >
              {button.label}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PageHeader;

