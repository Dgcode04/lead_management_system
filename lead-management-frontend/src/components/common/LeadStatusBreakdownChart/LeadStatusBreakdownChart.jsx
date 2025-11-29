import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const LeadStatusBreakdownChart = ({ 
  data = [], 
  title = "Lead Status Breakdown", 
  subtitle = "Current lead distribution" 
}) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, name, x, y }) => {
    // Use the x, y coordinates provided by Recharts (which are already outside the pie)
    // Or calculate position outside the pie chart if x, y are not provided
    const labelRadius = outerRadius + 25; // Position outside the pie with padding
    const labelX = x !== undefined ? x : cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const labelY = y !== undefined ? y : cy + labelRadius * Math.sin(-midAngle * RADIAN);

    // Find the color from the data array that matches this segment
    const dataEntry = data.find(item => item.name === name);
    const segmentColor = dataEntry?.color || '#374151';

    // Use the percent parameter from Recharts which gives the actual percentage of the pie slice
    // Format as "Name: X%" or "Name: Count" based on the value
    const percentage = (percent * 100).toFixed(0);
    const displayValue = value === 1 && percent < 0.02 ? value : `${percentage}%`;

    return (
      <text
        x={labelX}
        y={labelY}
        fill={segmentColor}
        textAnchor={labelX > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${name}: ${displayValue}`}
      </text>
    );
  };

//   const renderTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0];
//       return (
//         <Box
//           sx={{
//             backgroundColor: 'white',
//             border: '1px solid #ccc',
//             borderRadius: '4px',
//             padding: '8px',
//             boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//           }}
//         >
//           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//             {data.name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {typeof data.value === 'number' && data.value < 1
//               ? `${(data.value * 100).toFixed(0)}%`
//               : `Count: ${data.value}`}
//           </Typography>
//         </Box>
//       );
//     }
//     return null;
//   };

  return (
    <Paper
      sx={{
        p: 3,
        height: 420,
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
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
    </Paper>
  );
};

export default LeadStatusBreakdownChart;

