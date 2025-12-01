import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Button, Typography } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WarningIcon from '@mui/icons-material/Warning';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import FilterSection from '../../components/common/FilterSection/FilterSection';
import LeadsTable from '../../components/common/LeadsTable/LeadsTable';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Label from '../../components/common/Label/Label';
import Selector from '../../components/common/Selector/Selector';
import { useAppContext } from '../../context/AppContext';
import { useGetLeadSourcesQuery, useGetLeadStatusQuery, useGetAllLeadsQuery, useCreateLeadMutation, useExportLeadsMutation, useImportLeadsCsvMutation } from '../../store/api/leadapi';
import { useGetAllTelecallersQuery } from '../../store/api/telecallersapi';
import { toast } from 'react-toastify';

const AllLeadsContainer = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const isTelecaller = user?.role === 'Telecaller';
  console.log(user)
  
  // Fetch lead sources from API using Redux Toolkit
  const { data: leadSourcesData, isLoading: isLoadingSources, error: sourcesError } = useGetLeadSourcesQuery();

  // Fetch lead status from API
  const { data: leadStatusData, isLoading: isLoadingStatus, error: statusError } = useGetLeadStatusQuery();
  
  // Fetch telecallers from API
  const { data: telecallersData, isLoading: isLoadingTelecallers, error: telecallersError } = useGetAllTelecallersQuery();

  // Fetch leads list from API
  const { data: leadsData, isLoading: isLoadingLeads, error: leadsError } = useGetAllLeadsQuery();
  
  // Create lead mutation
  const [createLead, { isLoading: isCreatingLead }] = useCreateLeadMutation();
  
  // Export leads mutation
  const [exportLeads, { isLoading: isExporting }] = useExportLeadsMutation();

  // Import leads mutation
  const [importLeadsCsv, { isLoading: isImporting }] = useImportLeadsCsvMutation();
  
  // Transform API response to match component format
  const leads = useMemo(() => {
    if (!leadsData) return [];
    
    // Handle array response
    if (Array.isArray(leadsData)) {
      return leadsData.map((lead) => ({
        id: lead.id?.toString() || lead._id?.toString() || '',
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        company: lead.company || '',
        status: lead.initial_status || lead.status || 'New',
        assignedTo: lead.assigned_user?.name || lead.assignedTo || 'Unassigned',
        source: lead.source || lead.lead_source || '',
        created: lead.created_at 
          ? new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : lead.created || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }));
    }
    
    // // Handle object with array property
    // if (leadsData?.leads && Array.isArray(leadsData.leads)) {
    //   return leadsData.leads.map((lead) => ({
    //     id: lead.id?.toString() || lead._id?.toString() || '',
    //     name: lead.name || '',
    //     phone: lead.phone || '',
    //     email: lead.email || '',
    //     company: lead.company || '',
    //     status: lead.initial_status || lead.status || 'New',
    //     assignedTo: lead.assigneto || lead.assignedTo || 'Unassigned',
    //     source: lead.source || lead.lead_source || '',
    //     created: lead.created_at 
    //       ? new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    //       : lead.created || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    //   }));
    // }
    
    return [];
  }, [leadsData]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [assigneeFilter, setAssigneeFilter] = useState('All Assignees');
  const [filteredLeads, setFilteredLeads] = useState(leads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState('New');
  const [defaultAssignee, setDefaultAssignee] = useState('Unassigned');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: '',
    status: '',
    campaign: '',
    assignTo: '',
  });

    // Transform API response to options format for Selector component
    const leadSourceOptions = useMemo(() => {
      if (!leadSourcesData) return [];
      
      // Handle different API response formats
      // If API returns array of strings: ["Website", "Referral", ...]
    if (Array.isArray(leadSourcesData?.lead_sources) && leadSourcesData?.lead_sources?.length > 0) {
        if (typeof leadSourcesData?.lead_sources[0] === 'string') {
          return leadSourcesData?.lead_sources?.map((source) => ({
            value: source,
            label: source,
          }));
        }
        // If API returns array of objects: [{id: 1, name: "Website"}, ...]
        if (typeof leadSourcesData?.lead_sources[0] === 'object') {
          return leadSourcesData?.lead_sources?.map((source) => ({
            value: source.name || source.id || source.value,
            label: source.name || source.label || source.value,
          }));
        }
      }
      
      // If API returns object with data property: {data: [...]}
      if (leadSourcesData?.lead_sources && Array.isArray(leadSourcesData?.lead_sources)) {
        return leadSourcesData?.lead_sources?.map((source) => ({
          value: typeof source === 'string' ? source : (source.name || source.id || source.value),
          label: typeof source === 'string' ? source : (source.name || source.label || source.value),
        }));
      }
      
      return [];
    }, [leadSourcesData?.lead_sources]);

  // Transform API response to options format for Status Selector component
  const leadStatusOptions = useMemo(() => {
    if (!leadStatusData) return [];
    
    let options = [];
    
    // Handle different API response formats
    // If API returns array of strings: ["New", "Contacted", ...]
    if (Array.isArray(leadStatusData?.lead_status) && leadStatusData?.lead_status?.length > 0) {
      if (typeof leadStatusData?.lead_status[0] === 'string') {
        options = leadStatusData?.lead_status?.map((status) => ({
          value: status,
          label: status,
        }));
      }
      // If API returns array of objects: [{id: 1, name: "New"}, ...]
      else if (typeof leadStatusData?.lead_status[0] === 'object') {
        options = leadStatusData?.lead_status?.map((status) => ({
          value: status.name || status.id || status.value,
          label: status.name || status.label || status.value,
        }));
      }
    }
    
    return options;
  }, [leadStatusData]);

  // Limited status options for form field (top 4 only)
  const leadStatusOptionsForForm = useMemo(() => {
    return leadStatusOptions.slice(0, 4);
  }, [leadStatusOptions]);

  // Transform API response to options format for Telecallers Selector component
  const telecallerOptions = useMemo(() => {
    console.log(telecallersData, 'telecallersData');
    if (!telecallersData) return [];
    
    // Add "Unassigned" option first
    const options = [{ value: 'Unassigned', label: 'Unassigned' }];
    
    // Handle paginated response format with items array: {total, page, size, items: [...]}
    if (telecallersData?.items && Array.isArray(telecallersData.items) && telecallersData.items.length > 0) {
      const telecallers = telecallersData.items.map((telecaller) => ({
        value: telecaller.id || null,
        label: telecaller.name || '',
      }));
      return [...options, ...telecallers];
    }
    
    // Handle different API response formats
    // If API returns array of objects: [{id: 1, name: "Sarah Johnson"}, ...]
    if (Array.isArray(telecallersData?.telecallers) && telecallersData?.telecallers?.length > 0) {
      const telecallers = telecallersData.telecallers.map((telecaller) => ({
        value: telecaller.id || null,
        label: telecaller.name || '',
      }));
      return [...options, ...telecallers];
    }
    
    // If API returns array directly
    if (Array.isArray(telecallersData) && telecallersData.length > 0) {
      const telecallers = telecallersData.map((telecaller) => ({
        value: telecaller.id || null,
        label: telecaller.name || '',
      }));
      return [...options, ...telecallers];
    }
    
    // If API returns object with data property: {data: [...]}
    if (telecallersData?.data && Array.isArray(telecallersData.data)) {
      const telecallers = telecallersData.data.map((telecaller) => ({
        value: typeof telecaller === 'object' ? (telecaller.id || null) : null,
        label: typeof telecaller === 'object' ? (telecaller.name || '') : telecaller,
      }));
      return [...options, ...telecallers];
    }
    
    return options;
  }, [telecallersData]);

  // Filter leads based on user role - memoized to prevent infinite loops
  const roleFilteredLeads = useMemo(() => {
    if (isTelecaller) {
      // For telecaller, only show leads assigned to them
      return leads.filter((lead) => lead.assignedTo === user?.name);
    }
    // For admin, show all leads
    return leads;
  }, [leads, isTelecaller, user?.name]);

  useEffect(() => {
    let filtered = roleFilteredLeads;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.phone.includes(searchQuery)
      );
    }

    // Status filter - normalize comparison (trim and case-insensitive)
    if (statusFilter && statusFilter !== 'All Statuses') {
      const normalizedFilter = statusFilter.trim().toLowerCase();
      filtered = filtered.filter((lead) => {
        const leadStatus = (lead.status || '').trim().toLowerCase();
        return leadStatus === normalizedFilter;
      });
    }

    // Assignee filter (only for admin)
    if (!isTelecaller && assigneeFilter !== 'All Assignees') {
      filtered = filtered.filter((lead) => lead.assignedTo === assigneeFilter);
    }

    setFilteredLeads(filtered);
  }, [searchQuery, statusFilter, assigneeFilter, roleFilteredLeads, isTelecaller]);

  // Set default status to 'New' when options are loaded
  useEffect(() => {
    if (leadStatusOptions.length > 0) {
      setDefaultStatus((currentValue) => {
        // Check if current value exists in options
        const currentOption = leadStatusOptions.find(option => 
          option.value === currentValue || option.label === currentValue
        );
        
        // If current value doesn't match any option, try to find 'New'
        if (!currentOption) {
          const newOption = leadStatusOptions.find(option => 
            option.value === 'New' || option.label === 'New'
          );
          if (newOption) {
            return newOption.value;
          } else if (leadStatusOptions[0]) {
            // If 'New' doesn't exist, use the first option
            return leadStatusOptions[0].value;
          }
        }
        return currentValue;
      });
    }
  }, [leadStatusOptions]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Statuses');
    setAssigneeFilter('All Assignees');
  };

  const handleViewLead = (lead) => {
    if (isTelecaller) {
      navigate(`/telecaller/leads/${lead.id}`);
    } else {
      navigate(`/leads/${lead.id}`);
    }
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleImportLeads = async () => {
    if (!selectedFile) {
      toast.error("Please select a CSV file");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("default_status", defaultStatus);
    formData.append("default_assigned_to", defaultAssignee);
    formData.append("override_status", true);      // or state
    formData.append("override_assigned_to", false); // or state
  
    try {
      const response = await importLeadsCsv(formData).unwrap();
      toast.success(`Imported leads`);
  
      handleCloseImportModal();
    } catch (error) {
      toast.error("Error importing leads");
      console.log(error);
    }
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setSelectedFile(null);
    setDefaultStatus('New');
    setDefaultAssignee('Unassigned');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDownloadTemplate = () => {
    // Create CSV template content
    const csvContent = 'name,email,phone,company,source,campaign,status,assignedto\nJohn Doe,john@example.com,1234567890,Company Inc,Website,Summer Campaign,New,Unassigned';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully!');
  };

  // const handleImportLeads = async () => {
  //   if (!selectedFile) {
  //     toast.error('Please select a CSV file');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('file', selectedFile);
  //     formData.append('default_status', defaultStatus);
  //     formData.append('default_assignee', defaultAssignee === 'Unassigned' ? '' : defaultAssignee);

  //     const response = await fetch('http://localhost:8000/leads/import', {
  //       method: 'POST',
  //       credentials: 'include',
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Import failed');
  //     }

  //     const result = await response.json();
  //     toast.success(`Successfully imported ${result.imported || 0} leads!`);
  //     handleCloseImportModal();
      
  //     // Refetch leads data
  //     // The cache will be invalidated automatically if the API supports it
  //   } catch (error) {
  //     console.error('Error importing leads:', error);
  //     toast.error(error.message || 'Failed to import leads. Please try again.');
  //   }
  // };

  const handleExport = async () => {
    try {
      const response = await fetch('http://localhost:8000/leads/export', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'leads_export.csv'; // Default filename
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Leads exported successfully!');
    } catch (error) {
      console.error('Error exporting leads:', error);
      toast.error('Failed to export leads. Please try again.');
    }
  };

  const handleNewLead = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      source: '',
      status: '',
      campaign: '',
      assignTo: '',
    });
  };

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCreateLead = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    try {
      // For telecallers, auto-assign to themselves using user ID
      let assignedTo = null;
      let createdBy = null;
      
      if (isTelecaller) {
        // Use user ID for assignment when telecaller creates lead
        assignedTo = user?.id || null;
        // Add created_by field with logged-in user ID
        createdBy = user?.id || null;
      } else {
        // For admin, use the selected telecaller ID from formData.assignTo
        // formData.assignTo will contain the telecaller ID (as integer) or 'Unassigned'
        if (formData.assignTo && formData.assignTo !== 'Unassigned') {
          // Ensure it's an integer
          assignedTo = typeof formData.assignTo === 'number' ? formData.assignTo : parseInt(formData.assignTo);
        } else {
          assignedTo = null;
        }
        // Admin can also have created_by if needed
        createdBy = user?.id || null;
      }

      // Prepare lead data for API payload
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || '',
        initial_status: formData.status || 'New',
        assigned_to: assignedTo,
        source: formData.source || '',
        campaign: formData.campaign || '',
        ...(createdBy && { created_by: createdBy }), // Add created_by only if user ID exists
      };

      // Create lead via API - POST to leads/add
      await createLead(leadData).unwrap();

      // Close modal and reset form on success
      handleCloseModal();
      toast.success('Lead created successfully!');
    } catch (error) {
      console.error('Error creating lead:', error);
      // Handle different error formats
      const errorMessage = 
        error?.data?.message || 
        error?.data?.error || 
        error?.data?.detail ||
        error?.message ||
        'Failed to create lead. Please try again.';
      toast.error(errorMessage);
    }
  };

  // Create status filter options from API with "All Statuses" option
  const statusFilterOptions = useMemo(() => {
    const allStatusesOption = { value: 'All Statuses', label: 'All Statuses' };
    return [allStatusesOption, ...leadStatusOptions];
  }, [leadStatusOptions]);

  const uniqueAssignees = ['All Assignees', ...new Set(roleFilteredLeads.map((lead) => lead.assignedTo))];

  const actionButtons = isTelecaller
    ? [
        {
          label: isExporting ? 'Exporting...' : 'Export',
          startIcon: <FileDownloadIcon />,
          sx: {
            backgroundColor: 'white',
          },
          onClick: handleExport,
          disabled: isExporting,
        },
        {
          label: 'New Lead',
          variant: 'contained',
          startIcon: <AddIcon />,
          onClick: handleNewLead,
        },
      ]
    : [
        {
          label: 'Import',
          startIcon: <FileUploadIcon />,
          sx: {
            backgroundColor: 'white',
          },
          onClick: handleImport,
        },
        {
          label: isExporting ? 'Exporting...' : 'Export',
          startIcon: <FileDownloadIcon />,
          sx: {
            backgroundColor: 'white',
          },
          onClick: handleExport,
          disabled: isExporting,
        },
        {
          label: 'New Lead',
          variant: 'contained',
          startIcon: <AddIcon />,
          onClick: handleNewLead,
        },
      ];

  const filters = isTelecaller
    ? [
        {
          value: statusFilter,
          onChange: setStatusFilter,
          options: statusFilterOptions,
          minWidth: 150,
        },
      ]
    : [
        {
          value: statusFilter,
          onChange: setStatusFilter,
          options: statusFilterOptions,
          minWidth: 150,
        },
        {
          value: assigneeFilter,
          onChange: setAssigneeFilter,
          options: uniqueAssignees.map((assignee) => ({ value: assignee, label: assignee })),
          minWidth: 150,
        },
      ];

  return (
    <Box>
      <PageHeader
        title={isTelecaller ? "My Leads" : "All Leads"}
        subtitle={`${filteredLeads.length} leads found`}
        actionButtons={actionButtons}
      />

      <FilterSection
        title="Filters"
        subtitle="Search and filter your leads"
        searchPlaceholder="Search by name, email, phone.."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onClearFilters={handleClearFilters}
      />

      <LeadsTable leads={filteredLeads} onViewClick={handleViewLead} showAssignedTo={!isTelecaller} />

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Lead"
        subtitle="Add a new lead to the system"
        maxWidth="md"
        primaryButton={{
          label: isCreatingLead ? 'Creating...' : 'Create Lead',
          onClick: handleCreateLead,
          disabled: isCreatingLead,
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: handleCloseModal,
        }}
      >
        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} sm={6}>
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
              <Label required>Phone</Label>
              <Input
                value={formData.phone}
                onChange={handleInputChange('phone')}
                placeholder="+1234567890"
                type="tel"
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Label>Source</Label>
              <Selector
                value={formData.source}
                onChange={handleSelectChange('source')}
                placeholder="Select source"
                options={leadSourceOptions}
                disabled={isLoadingSources}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Label>Initial Status</Label>
              <Selector
                value={formData.status}
                onChange={handleSelectChange('status')}
                placeholder="New"
                options={leadStatusOptionsForForm}
                disabled={isLoadingStatus}
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ mb: 2 }}>
              <Label required>Email</Label>
              <Input
                value={formData.email}
                onChange={handleInputChange('email')}
                placeholder="john@example.com"
                type="email"
                required
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Label>Company</Label>
              <Input
                value={formData.company}
                onChange={handleInputChange('company')}
                placeholder="Acme Inc."
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Label>Campaign</Label>
              <Input
                value={formData.campaign}
                onChange={handleInputChange('campaign')}
                placeholder="Q4 2025"
              />
            </Box>
            {!isTelecaller && (
              <Box sx={{ mb: 2 }}>
                <Label>Assign To</Label>
                <Selector
                  value={formData.assignTo}
                  onChange={handleSelectChange('assignTo')}
                  placeholder="Unassigned"
                  options={telecallerOptions}
                  disabled={isLoadingTelecallers}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Modal>

      {/* Import Leads Modal */}
      <Modal
        open={isImportModalOpen}
        onClose={handleCloseImportModal}
        title="Import Leads from CSV"
        subtitle="Upload a CSV file to bulk import leads"
        maxWidth="md"
        primaryButton={{
          label: 'Import Leads',
          onClick: handleImportLeads,
          startIcon: <UploadFileIcon />,
          disabled: !selectedFile || isImporting,
        }}
        secondaryButton={{
          label: 'Cancel',
          onClick: handleCloseImportModal,
        }}
      >
        <Box>
          {/* CSV Format Instructions */}
          <Box
            sx={{
              backgroundColor: '#F3F3F5',
              borderRadius: '10px',
              p: 2,
              mb: 3,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <DescriptionOutlinedIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                CSV should have columns: name, email, phone, company, source, campaign, status, assignedto
              </Typography>
              <Typography
                variant="body2"
                onClick={handleDownloadTemplate}
                sx={{
                  fontWeight: 600,
                  color: '#000000',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Download template CSV
              </Typography>
            </Box>
          </Box>

          {/* Select CSV File */}
          <Box sx={{ mb: 3 }}>
            <Label required>Select CSV File</Label>
            <Box
              sx={{
                width: '100%',
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                component="label"
                sx={{
                  width: '100%',
                  backgroundColor: 'lightgray',
                  borderColor: '#E5E7EB',
                  color: 'text.primary',
                  textTransform: 'none',
                  borderRadius: '10px',
                  display: 'flex',
                  gap: 1,
                justifyContent: 'flex-start',
                  // '&:hover': {
                  //   borderColor: '#D1D5DB',
                  //   backgroundColor: '#F9FAFB',
                  // },
                }}
              >
                <span style={{ fontWeight: 600 }}>Choose File</span>
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileChange}
                />
                {selectedFile ? selectedFile.name : 'No file chosen'}
              </Button>
            </Box>
          </Box>

          {/* Default Settings */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} sx={{ width: '47%' }}>
              <Label>Default Status</Label>
              <Selector
                value={defaultStatus}
                onChange={(e) => setDefaultStatus(e.target.value)}
                options={leadStatusOptions}
                placeholder="Select status"
              />
            </Grid>
            <Grid item xs={12} sm={6} sx={{ width: '47%' }}>
              <Label>Default Assignee</Label>
              <Selector
                value={defaultAssignee}
                onChange={(e) => setDefaultAssignee(e.target.value)}
                options={telecallerOptions}
                placeholder="Select assignee"
              />
            </Grid>
          </Grid>

          {/* Warning Message */}
          <Box
            sx={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '10px',
              p: 2,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
            }}
          >
            <WarningIcon sx={{ color: '#EF4444', fontSize: 20, mt: 0.25 }} />
            <Typography variant="body2" sx={{ color: '#991B1B' }}>
              Leads without name, email, or phone will be skipped during import.
            </Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default AllLeadsContainer;
