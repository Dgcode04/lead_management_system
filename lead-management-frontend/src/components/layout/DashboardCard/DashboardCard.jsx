import { Card, CardContent, Typography, Box } from '@mui/material';

const DashboardCard = ({ title, value, subtitle, icon: Icon, iconColor = 'primary', sx, ...otherProps }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        width: "100%",
        ...sx,
      }}
      {...otherProps}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <Box>
            <Typography color="text.primary" gutterBottom fontSize="16px" fontWeight={300}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontSize: '20px',fontWeight: 500, mt: 5 }}>
              {value}
            </Typography>
            <Typography color="text.secondary" fontSize="14px" fontWeight={200}>
              {subtitle}
            </Typography>
          </Box>
          {Icon && (
            <Box
              sx={{
                color: `primary.gray`,
                fontSize: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon />
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;

