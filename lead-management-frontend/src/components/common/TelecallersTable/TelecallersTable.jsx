import { useMemo } from 'react';
import { Box, Chip, Switch, Typography } from '@mui/material';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BoltIcon from '@mui/icons-material/Bolt';

const TelecallersTable = ({ telecallers, onStatusToggle, loading = false }) => {
  const getStatusColor = (status) => {
    return status === 'Active' ? '#10B981' : '#6B7280';
  };

  const getStatusBgColor = (status) => {
    return status === 'Active' ? '#D1FAE5' : '#F3F4F6';
  };

  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Name',
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: '14px', color: '#111827' }}>
              {params.row.name}
            </Typography>
            <Typography sx={{ fontSize: '11px', color: '#6B7280', mt: 0.25 }}>
              {params.row.id}
            </Typography>
          </Box>
        ),
      },
      {
        field: 'contact',
        headerName: 'Contact',
        flex: 1.2,
        minWidth: 180,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <EmailIcon sx={{ fontSize: 14, color: '#6B7280' }} />
              <Typography sx={{ fontSize: '13px', color: '#111827' }}>
                {params.row.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 14, color: '#6B7280' }} />
              <Typography sx={{ fontSize: '13px', color: '#111827' }}>
                {params.row.phone}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 0.8,
        minWidth: 60,
        sortable: false,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            sx={{
              backgroundColor: getStatusBgColor(params.value),
              color: getStatusColor(params.value),
              fontWeight: 500,
              fontSize: '11px',
              height: 24,
            }}
          />
        ),
      },
      {
        field: 'leads',
        headerName: 'Leads',
        flex: 0.6,
        minWidth: 50,
        sortable: false,
        renderCell: (params) =>{ console.log(params.row); return <Box sx={{ fontSize: '13px' }}>{params.value}</Box>},
      },
      {
        field: 'calls',
        headerName: 'Calls',
        flex: 0.6,
        minWidth: 50,
        sortable: false,
        renderCell: (params) =>{ return <Box sx={{ fontSize: '13px' }}>{params.value}</Box>},
      },
      {
        field: 'converted',
        headerName: 'Converted',
        flex: 0.7,
        minWidth: 80,
        sortable: false,
        renderCell: (params) =>{ return <Box sx={{ fontSize: '13px' }}>{params.value}</Box>},
      },
      {
        field: 'conversionRate',
        headerName: 'Conv. Rate',
        flex: 0.8,
        minWidth: 100,
        sortable: false,
        renderCell: (params) =>{ return <Box sx={{ fontSize: '13px' }}>{params.value}</Box>},
      },
      {
        field: 'created',
        headerName: 'Created',
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 14, color: '#6B7280' }} />
            <Box sx={{ fontSize: '13px' }}>{params.value}</Box>{params.value}
          </Box>
        ),
      },
      {
        field: 'lastLogin',
        headerName: 'Last Login',
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BoltIcon sx={{ fontSize: 14, color: '#6B7280' }} />
            <Box sx={{ fontSize: '13px' }}>{params.value}</Box>{params.value}
          </Box>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        flex: 1,
        minWidth: 120,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Switch
              checked={params.row.status === 'Active'}
              onChange={(e) => onStatusToggle && onStatusToggle(params.row.id, e.target.checked)}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#10B981',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#10B981',
                },
              }}
            />
            <Box sx={{ fontSize: '12px', color: '#6B7280' }}>
              {params.row.status}
            </Box>
          </Box>
        ),
      },
    ],
    [onStatusToggle]
  );

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .MuiDataGrid-root': {
          border: 'none',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        '& .MuiDataGrid-cell': {
          borderBottom: '1px solid #E5E7EB',
          borderRight: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB',
          '& .MuiDataGrid-columnHeader': {
            fontWeight: '600',
            fontSize: '15px',
            color: 'text.primary',
            borderRight: 'none',
            '& .MuiDataGrid-iconButtonContainer': {
              display: 'none',
            },
            '& .MuiDataGrid-sortIcon': {
              display: 'none',
            },
            '& .MuiDataGrid-menuIcon': {
              display: 'none',
            },
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
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
        rows={telecallers}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        disableColumnMenu
        autoHeight
        pageSizeOptions={[10, 25, 50, 100]}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default TelecallersTable;

