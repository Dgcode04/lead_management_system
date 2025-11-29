import { useState, useMemo } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import DashboardCard from '../../components/layout/DashboardCard/DashboardCard';
import TelecallersTable from '../../components/common/TelecallersTable/TelecallersTable';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Label from '../../components/common/Label/Label';
import { useGetAdminTelecallersQuery, useCreateTelecallerMutation } from '../../store/api/telecallersapi';

const UserManagementContainer = () => {
  // Fetch admin telecallers from API (paginated)
  const { data: telecallersData, isLoading: isLoadingTelecallers, error: telecallersError } = useGetAdminTelecallersQuery();
  
  // Create telecaller mutation
  const [createTelecaller, { isLoading: isCreatingTelecaller }] = useCreateTelecallerMutation();

  // Transform API response to match component format
  const telecallers = useMemo(() => {
    if (!telecallersData || !telecallersData.items) return [];
    
    // Handle paginated response with items array
    return telecallersData.items.map((telecaller) => ({
      id: telecaller.id?.toString() || '',
      name: telecaller.name || '',
      phone: telecaller.phone || '',
      email: telecaller.email || '',
      status: telecaller.status || 'Active',
      leads: telecaller.lead || 0,
      calls: telecaller.calls || 0,
      converted: telecaller.converted || 0,
      conversionRate: telecaller.conversion_rate 
        ? `${telecaller.conversion_rate}%` 
        : '0%',
      created: telecaller.created 
        ? new Date(telecaller.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '',
      lastLogin: telecaller.last_login 
        ? new Date(telecaller.last_login).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Never',
    }));
  }, [telecallersData]);

  // Calculate metrics from API data
  const userManagementData = useMemo(() => {
    const activeTelecallers = telecallers.filter(t => t.status === 'Active').length;
    const totalLeads = telecallers.reduce((sum, t) => sum + (t.leads || 0), 0);
    const totalCalls = telecallers.reduce((sum, t) => sum + (t.calls || 0), 0);
    const totalConverted = telecallers.reduce((sum, t) => sum + (t.converted || 0), 0);
    const avgConversionRate = totalCalls > 0 
      ? ((totalConverted / totalCalls) * 100).toFixed(1) + '%'
      : '0%';

    return {
      totalTelecallers: telecallers.length,
      activeTelecallers,
      totalLeadsAssigned: totalLeads,
      totalCallsMade: totalCalls,
      avgConversionRate,
    };
  }, [telecallers]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Data is now fetched from API, no need for useEffect

  const handleStatusToggle = (id, isActive) => {
    // TODO: Implement API call to update telecaller status
    // For now, this is handled by the API response
    console.log('Toggle status for telecaller:', id, isActive);
  };

  const handleAddTelecaller = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCreateTelecaller = async () => {
    // Validate required fields
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields (Name, Email)');
      return;
    }

    try {
      // Prepare telecaller data for API
      const telecallerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
      };

      // Create telecaller via API
      await createTelecaller(telecallerData).unwrap();

      // Close modal and reset form
      handleCloseModal();
    } catch (error) {
      console.error('Error creating telecaller:', error);
      alert(error?.data?.message || error?.data?.error || 'Failed to create telecaller. Please try again.');
    }
  };

  const actionButtons = [
    {
      label: 'Add Telecaller',
      variant: 'contained',
      startIcon: <PersonAddAltOutlinedIcon />,
      onClick: handleAddTelecaller,
    },
  ];

  const metricCards = [
    {
      title: 'Total Telecallers',
      value: userManagementData.totalTelecallers.toString(),
      subtitle: `${userManagementData.activeTelecallers} active`,
    },
    {
      title: 'Total Leads Assigned',
      value: userManagementData.totalLeadsAssigned.toString(),
      subtitle: 'Across all telecallers',
    },
    {
      title: 'Total Calls Made',
      value: userManagementData.totalCallsMade.toString(),
      subtitle: 'All time',
    },
    {
      title: 'Avg. Conversion Rate',
      value: userManagementData.avgConversionRate.toString(),
      subtitle: 'Team average',
    },
  ];

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle="Manage system users and permissions"
        actionButtons={actionButtons}
      />

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <DashboardCard {...card} sx={{ width: '260px' }} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ backgroundColor: '#ffffff', p: 2, borderRadius: '10px', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          Telecallers
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Manage telecaller accounts and view performance
        </Typography>
        <TelecallersTable telecallers={telecallers} onStatusToggle={handleStatusToggle} />
      </Box>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Telecaller"
        subtitle="Add a new telecaller to the system"
        primaryButton={{
          label: isCreatingTelecaller ? 'Creating...' : 'Create Telecaller',
          onClick: handleCreateTelecaller,
          disabled: isCreatingTelecaller,
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: handleCloseModal,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Label required>Name</Label>
          <Input
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="John Doe"
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Label required>Email</Label>
          <Input
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="john@company.com"
            type="email"
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Label>Phone</Label>
          <Input
            value={formData.phone}
            onChange={handleInputChange('phone')}
            placeholder="+1234567890"
            type="tel"
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default UserManagementContainer;
