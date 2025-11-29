import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const DataGrid = ({ rows, columns, loading = false, ...props }) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #E5E7EB',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
          '& .MuiDataGrid-columnHeader': {
            fontWeight: 600,
            fontSize: '13px',
            color: '#6B7280',
          },
        },
        '& .MuiDataGrid-row': {
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid #E5E7EB',
        },
      }}
    >
      <MuiDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        {...props}
      />
    </Box>
  );
};

export default DataGrid;

