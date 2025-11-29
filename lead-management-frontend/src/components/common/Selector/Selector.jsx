import { Select, MenuItem, FormControl, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Selector = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select...', 
  required = false,
  ...props 
}) => {
  // console.log(options);
  return (
    <FormControl fullWidth size="small">
      <Select
        value={value !== null && value !== undefined ? value : ''}
        onChange={onChange}
        displayEmpty
        required={required}
        IconComponent={KeyboardArrowDownIcon}
        sx={{
          backgroundColor: '#F3F3F5',
          borderRadius: '10px',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            border: `1px solid gray`,
            borderRadius: '10px',
            boxShadow: `0 0 0 5px lightgray`,
          },
          '& .MuiSelect-select': {
            padding: '8.5px 14px',
          },
        }}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            <Box component="span" sx={{ color: '#9CA3AF' }}>
              {placeholder}
            </Box>
          </MenuItem>
        )}
        {options.map((option, index) => (
          <MenuItem key={option.value !== null && option.value !== undefined ? option.value : `option-${index}`} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Selector;

