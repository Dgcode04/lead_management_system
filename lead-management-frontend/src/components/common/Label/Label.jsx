import { Typography, Box } from '@mui/material';

const Label = ({ children, required = false, ...props }) => {
  return (
    <Typography 
      variant="body2" 
      sx={{ fontWeight: 600, mb: 0.5, fontSize: "15px" }}
      {...props}
    >
      {children}
      {required && <Box component="span" sx={{ color: 'error.main', ml: 0.5 }}>*</Box>}
    </Typography>
  );
};

export default Label;

