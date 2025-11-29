import { Box, Typography, Paper, Stack } from '@mui/material';

const TelecallerOverview = ({ 
  data = [], 
  title = "Telecaller Overview",
  subtitle = "Performance summary by telecaller",
  renderProgress // Function that receives telecaller object and returns JSX
}) => {

  return (
    <Paper
      sx={{
        p: 2,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ fontSize: '14px', fontWeight: 200, mb: 2.5 }}>
        {subtitle}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {data.map((telecaller, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Name and stats on the left */}
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" gap={1} sx={{ mb: 0.5 }}>
                <Typography sx={{ fontWeight: 300, fontSize: '16px' }}>
                  {telecaller.name}
                </Typography>
                {telecaller.leads !== undefined && (
                  <Box
                    sx={{
                      fontSize: '12px',
                      fontWeight: 200,
                      mt: 0.2,
                      border: '1px solid #E5E7EB',
                      borderRadius: '5px',
                      padding: '2px 5px',
                    }}
                  >
                    {telecaller.leads} {telecaller.leads === 1 ? 'lead' : 'leads'}
                  </Box>
                )}
              </Stack>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {telecaller.leads !== undefined && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    {telecaller.leads} leads
                  </Typography>
                )}
                {telecaller.converted !== undefined && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    {telecaller.converted} converted
                  </Typography>
                )}
                {telecaller.conversionRate !== undefined && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                    {telecaller.conversionRate}% conversion rate
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Progress indicator on the right */}
            {renderProgress && renderProgress(telecaller)}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TelecallerOverview;

