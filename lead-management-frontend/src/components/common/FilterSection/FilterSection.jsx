import { Box, Typography, TextField, InputAdornment, Button, MenuItem, Select, FormControl, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterSection = ({ title, subtitle, searchPlaceholder, searchValue, onSearchChange, filters = [], onClearFilters }) => {
  return (
    <Paper
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
        {searchPlaceholder && onSearchChange && (
          <TextField
            placeholder={searchPlaceholder}
            value={searchValue || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#F3F3F5',
                padding: '0px 6px',
                borderRadius: '10px',
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        )}
        {filters.map((filter, index) => (
          <FormControl key={index} size="small" sx={{ flex: 1 }}>
            <Select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              sx={{
                backgroundColor: '#F3F3F5',
                padding: '',
                borderRadius: '10px',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            >
              {filter.options.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <MenuItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ))}
        {onClearFilters && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListIcon />}
            onClick={onClearFilters}
            sx={{
              border: '1px solid #E5E7EB',
              color: 'text.primary',
              textTransform: 'none',
              padding: '8px 0px',
              borderRadius: '10px',
              flex: 1,
              
            }}
          >
            Clear Filters
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default FilterSection;

