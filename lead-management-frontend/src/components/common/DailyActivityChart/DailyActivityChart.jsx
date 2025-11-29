import { Box, Typography, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DailyActivityChart = ({ data = [], title = "Daily Activity (Last 7 Days)", subtitle = "Leads created and calls made" }) => {
  return (
    <Paper
      sx={{
        p: 3,
        height: 420,
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
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="calls" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Calls"
            />
            <Line 
              type="monotone" 
              dataKey="leads" 
              stroke="#9333EA" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Leads"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default DailyActivityChart;

