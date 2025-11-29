import { useMemo } from 'react';
import { Box, Chip, Button } from '@mui/material';
import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import VisibilityIcon from '@mui/icons-material/Visibility';

const LeadsTable = ({ leads, onViewClick, loading = false, showAssignedTo = true }) => {
  console.log(leads);
  // Debug: Log leads data to check structure
  const getStatusColor = (status) => {
    const colors = {
      New: '#3B82F6',
      Contacted: '#9333EA',
      Interested: '#10B981',
      'Follow-up': '#F59E0B',
      Converted: '#059669',
      'Not Interested': '#EF4444',
    };
    return colors[status] || '#6B7280';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      New: '#DBEAFE',
      Contacted: '#F3E8FF',
      Interested: '#D1FAE5',
      'Follow-up': '#FEF3C7',
      Converted: '#D1FAE5',
      'Not Interested': '#FEE2E2',
    };
    return colors[status] || '#F3F4F6';
  };

  const columns = useMemo(
    () => {
      const baseColumns = [
        {
          field: 'name',
          headerName: 'Name',
          flex: 1,
          minWidth: 150,
          sortable: false,
          renderCell: (params) => {
            const leadId = params.row?.id || params.id || '-';
            const leadName = params.row?.name || '-';
            return (
              <Box>
                <Box sx={{ fontWeight: 500, fontSize: '14px' }}>{leadName}</Box>
                <Box sx={{ fontSize: '11px', color: '#6B7280', mt: 0.5 }}>{leadId}</Box>
              </Box>
            );
          },
        },
        {
          field: 'contact',
          headerName: 'Contact',
          flex: 1,
          minWidth: 100,
          sortable: false,
          renderCell: (params) => {
            const phone = params.row?.phone || '-';
            const emailData = params.row?.email || '-';
            return (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                  <Box sx={{ fontSize: '13px' }}>{phone}</Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'top', gap: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                  <Box sx={{ fontSize: '13px' }}>{emailData}</Box>
                </Box>
              </Box>
            );
          },
        },
        {
          field: 'company',
          headerName: 'Company',
          flex: 1,
          minWidth: 150,
          sortable: false,
          renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <BusinessIcon sx={{ fontSize: 16, color: '#6B7280' }} />
              <Box sx={{ fontSize: '13px' }}>{params.row.company}</Box>
            </Box>
          ),
        },
        {
          field: 'status',
          headerName: 'Status',
          width: 120,
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
      ];

      // Add "Assigned To" column only if showAssignedTo is true
      if (showAssignedTo) {
        baseColumns.push({
          field: 'assignedTo',
          headerName: 'Assigned To',
          flex: 1,
          minWidth: 130,
          sortable: false,
          renderCell: (params) =>{ 
            console.log(params.row)
            return <Box sx={{ fontSize: '13px' }}>{params.value}</Box>
          },
        });
      }

      // Add remaining columns
      baseColumns.push(
        {
          field: 'source',
          headerName: 'Source',
          width: 120,
          sortable: false,
          renderCell: (params) => (
            <Chip
              label={params.value}
              size="small"
              sx={{
                backgroundColor: '#F3F4F6',
                color: '#6B7280',
                fontWeight: 400,
                fontSize: '11px',
                height: 24,
              }}
            />
          ),
        },
        {
          field: 'created',
          headerName: 'Created',
          width: 130,
          sortable: false,
          renderCell: (params) => <Box sx={{ fontSize: '13px' }}>{params.value}</Box>,
        },
        {
          field: 'actions',
          headerName: 'Actions',
          width: 120,
          sortable: false,
          renderCell: (params) => (
            <Button
              size="small"
              startIcon={<VisibilityIcon sx={{ fontSize: 16 }} />}
              onClick={() => onViewClick && onViewClick(params.row)}
              sx={{
                color: 'primary.main',
                textTransform: 'none',
                fontSize: '13px',
                '&:hover': {
                  backgroundColor: 'rgba(147, 51, 234, 0.08)',
                },
              }}
            >
              View
            </Button>
          ),
        }
      );

      return baseColumns;
    },
    [onViewClick, showAssignedTo]
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
            fontWeight: 600,
            fontSize: '13px',
            color: '#6B7280',
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
        '& .MuiDataGrid-columnSeparator': {
          display: 'none',
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
        rows={leads || []}
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
        getRowId={(row) => row.id || row.name || Math.random()}
      />
    </Box>
  );
};

export default LeadsTable;

