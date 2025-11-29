import { Box, Typography, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TelecallerPerformanceChart = ({ 
  data = [], 
  title = "Telecaller Performance Comparison", 
  subtitle = "Leads, calls, and conversions by telecaller",
  sx = {},
}) => {
  // Check which data keys are present in the data
  const availableKeys = new Set();
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (key !== 'name' && item[key] !== undefined && item[key] !== null) {
        availableKeys.add(key);
      }
    });
  });

  // Define bar configurations
  const barConfigs = [
    { dataKey: 'totalLeads', fill: '#3B82F6', name: 'Total Leads' },
    { dataKey: 'callsMade', fill: '#9333EA', name: 'Calls Made' },
    { dataKey: 'converted', fill: '#10B981', name: 'Converted' },
  ];

  // Filter to only include bars for available data keys
  const barsToShow = barConfigs.filter(config => availableKeys.has(config.dataKey));

  return (
    <Paper
      sx={{
        p: 3,
        height: 500,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...sx,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            {barsToShow.map((bar) => (
              <Bar 
                key={bar.dataKey}
                dataKey={bar.dataKey} 
                fill={bar.fill} 
                name={bar.name}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TelecallerPerformanceChart;

