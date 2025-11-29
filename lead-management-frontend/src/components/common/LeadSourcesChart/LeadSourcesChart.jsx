import { Box, Typography, Paper, LinearProgress } from '@mui/material';

const LeadSourcesChart = ({ 
  data = [], 
  title = "Lead Sources", 
  subtitle = "Distribution of leads by source" 
}) => {
  // Calculate total leads to determine percentages
  const totalLeads = data.reduce((sum, item) => sum + (item.leads || 0), 0);

  return (
    <Paper
      sx={{
        p: 3,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {data.map((item, index) => {
          const percentage = totalLeads > 0 ? ((item.leads / totalLeads) * 100).toFixed(1) : 0;
          
          return (
            <Box key={index} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '14px' }}>
                    {item.name}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#F3F4F6',
                      borderRadius: '12px',
                      padding: '2px 10px',
                      fontSize: '12px',
                      color: '#6B7280',
                      fontWeight: 500,
                    }}
                  >
                    {item.leads} {item.leads === 1 ? 'lead' : 'leads'}
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>
                  {percentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={parseFloat(percentage)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#E5E7EB',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#3B82F6',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default LeadSourcesChart;

