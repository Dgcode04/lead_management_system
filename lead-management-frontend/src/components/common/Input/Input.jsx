import { TextField, Box } from '@mui/material';

const Input = ({ value, onChange, placeholder, type = 'text', required, ...props }) => {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      required={required}
      size="small"
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
      {...props}
    />
  );
};

export default Input;

