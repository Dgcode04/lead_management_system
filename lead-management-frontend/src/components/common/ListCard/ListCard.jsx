import { Box, Typography, Paper, Chip } from '@mui/material';

const ListCard = ({ 
  data = [], 
  title,
  subtitle,
  renderItem, // Function that receives item and returns JSX
  renderIndicator // Optional function for right-side indicator
}) => {
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        height: '100%',
      }}
    >
      <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 200, mb: 2.5 }}>
        {subtitle}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data && data.length > 0 ? (
          data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Main content */}
            <Box sx={{ flexGrow: 1 }}>
              {renderItem && renderItem(item, index)}
            </Box>

            {/* Indicator on the right */}
            {renderIndicator && renderIndicator(item, index)}
          </Box>
        ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', fontStyle: 'italic' }}>
            No data available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ListCard;

