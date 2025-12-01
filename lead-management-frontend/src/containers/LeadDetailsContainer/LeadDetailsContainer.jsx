import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Stack,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import Tabs from '../../components/common/Tabs/Tabs';
import Modal from '../../components/common/Modal/Modal';
import Input from '../../components/common/Input/Input';
import Label from '../../components/common/Label/Label';
import Selector from '../../components/common/Selector/Selector';
import { useGetLeadByIdQuery, useGetLeadStatusQuery, useUpdateLeadMutation, useGetLeadCallsQuery, useCreateLeadCallMutation, useGetRemindersQuery, useCreateReminderMutation, useGetLeadSourcesQuery } from '../../store/api/leadapi';
// import { useGetAllTelecallersQuery } from '../../store/api/telecallersapi';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const LeadDetailsContainer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAppContext();
    const isTelecaller = user?.role === 'Telecaller';

    // Fetch lead by ID from API
    const { data: leadData, isLoading: isLoadingLead, error: leadError, refetch: refetchLead } = useGetLeadByIdQuery(id, {
        skip: !id,
    });

    // Fetch lead status options from API
    const { data: leadStatusData, isLoading: isLoadingStatus } = useGetLeadStatusQuery();

    // Fetch lead sources from API
    const { data: leadSourcesData, isLoading: isLoadingSources } = useGetLeadSourcesQuery();

    // Fetch telecallers from API (for admin only)
    // const { data: telecallersData, isLoading: isLoadingTelecallers } = useGetAllTelecallersQuery();

    // Fetch lead calls from API
    // Note: RTK Query can handle string IDs in URLs, but we'll ensure it's valid
    const shouldSkip = !id || id === 'undefined' || id === 'null';
    
    const { 
        data: leadCallsData, 
        isLoading: isLoadingCalls, 
        error: leadCallsError, 
        refetch: refetchCalls 
    } = useGetLeadCallsQuery(id, {
        skip: shouldSkip,
    });

    // Update lead mutation
    const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();

    // Create lead call mutation
    const [createLeadCall, { isLoading: isCreatingCall }] = useCreateLeadCallMutation();

    // Fetch reminders from API
    const { 
        data: remindersData, 
        isLoading: isLoadingReminders, 
        error: remindersError, 
        refetch: refetchReminders 
    } = useGetRemindersQuery(id, {
        skip: shouldSkip,
    });

    // Create reminder mutation
    const [createReminder, { isLoading: isCreatingReminder }] = useCreateReminderMutation();

    // Transform API response to match component format
    const lead = useMemo(() => {
        if (!leadData) return null;

        return {
            id: leadData.id?.toString() || leadData._id?.toString() || '',
            name: leadData.name || '',
            phone: leadData.phone || '',
            email: leadData.email || '',
            company: leadData.company || '',
            status: leadData.initial_status || leadData.status || 'New',
            assignedTo: leadData.assigned_user?.name || leadData.created_by_user?.name || leadData.assignedTo || 'Unassigned',
            assignedToId: leadData.assigned_to || null,
            source: leadData.source || leadData.lead_source || '',
            campaign: leadData.campaign || '',
            created: leadData.created_at
                ? new Date(leadData.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'N/A',
            createdTime: leadData.created_at
                ? new Date(leadData.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
                : 'N/A',
            lastUpdated: leadData.updated_at || leadData.created_at
                ? new Date(leadData.updated_at || leadData.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
                : 'N/A',
        };
    }, [leadData]);

    const [status, setStatus] = useState('New');
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLogCallModalOpen, setIsLogCallModalOpen] = useState(false);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: '',
        campaign: '',
    });
    const [callFormData, setCallFormData] = useState({
        callType: '',
        duration: '',
        callNote: '',
    });
    const [reminderFormData, setReminderFormData] = useState({
        title: '',
        dueDate: '',
        dueTime: '',
        description: '',
    });

    // Update status when lead data loads
    useEffect(() => {
        if (lead) {
            setStatus(lead.status);
        }
    }, [lead]);

    // Handle edit button click
    const handleEditClick = () => {
        if (lead) {
            setEditFormData({
                name: lead.name || '',
                email: lead.email || '',
                phone: lead.phone || '',
                company: lead.company || '',
                source: lead.source || '',
                campaign: lead.campaign || '',
            });
            setIsEditMode(true);
        }
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditFormData({
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

    // Handle input change for edit form
    const handleEditInputChange = (field) => (e) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    // Handle select change for edit form
    const handleEditSelectChange = (field) => (e) => {
        setEditFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    // Handle save edit
    const handleSaveEdit = async () => {
        // Validate required fields
        if (!editFormData.name || !editFormData.email || !editFormData.phone) {
            toast.error('Please fill in all required fields (Name, Email, Phone)');
            return;
        }

        try {
            // Prepare lead data for API payload
            const leadUpdateData = {
                id: id,
                name: editFormData.name,
                email: editFormData.email,
                phone: editFormData.phone,
                company: editFormData.company || '',
                source: editFormData.source || '',
                campaign: editFormData.campaign || '',
            };

            // Update lead via API
            await updateLead(leadUpdateData).unwrap();

            // Exit edit mode on success (this may trigger refetch due to cache invalidation)
            setIsEditMode(false);
            
            // Use requestAnimationFrame to ensure toast displays after any re-renders
            requestAnimationFrame(() => {
                toast.success('Lead updated successfully!');
            });
        } catch (error) {
            console.error('Error updating lead:', error);
            const errorMessage = 
                error?.data?.message || 
                error?.data?.error || 
                error?.data?.detail ||
                error?.message ||
                'Failed to update lead. Please try again.';
            toast.error(errorMessage);
        }
    };

    // Transform API call logs response to match component format
    const callLogs = useMemo(() => {
        if (!leadCallsData || !Array.isArray(leadCallsData)) return [];

        return leadCallsData.map((call) => ({
            id: call.id,
            lead_id: call.lead_id,
            user_id: call.user_id,
            callType: call.call_type || 'outgoing',
            duration: call.duration_seconds || 0,
            minutes: call.duration_minutes || 0,
            callNote: call.notes || '',
            callStatus: call.call_status || null,
            userName: user?.name || 'Unknown User',
            // Since API doesn't return created_at, we'll use ID as a proxy for ordering
            // and show a placeholder or use current date as fallback
            timestamp: new Date().toISOString(), // Fallback - replace with actual created_at when available
        })).sort((a, b) => {
            // Sort by ID descending (newest first) - assuming higher ID means newer record
            return b.id - a.id;
        });
    }, [leadCallsData, user?.name]);

    // Transform API reminders response to match component format
    const reminders = useMemo(() => {
        if (!remindersData || !Array.isArray(remindersData)) return [];

        return remindersData.map((reminder) => ({
            id: reminder.id,
            lead_id: reminder.lead_id,
            user_id: reminder.user_id,
            title: reminder.title || '',
            description: reminder.description || '',
            reminder_date: reminder.reminder_date || '',
            reminder_time: reminder.reminder_time || '',
            status: reminder.status || 'pending',
            userName: user?.name || 'Unknown User',
        })).sort((a, b) => {
            // Sort by ID descending (newest first)
            return b.id - a.id;
        });
    }, [remindersData, user?.name]);

    // Transform API response to options format for Lead Sources Selector
    const leadSourceOptions = useMemo(() => {
        if (!leadSourcesData) return [];
        
        // Handle different API response formats
        if (Array.isArray(leadSourcesData?.lead_sources) && leadSourcesData?.lead_sources?.length > 0) {
            if (typeof leadSourcesData?.lead_sources[0] === 'string') {
                return leadSourcesData?.lead_sources?.map((source) => ({
                    value: source,
                    label: source,
                }));
            }
            if (typeof leadSourcesData?.lead_sources[0] === 'object') {
                return leadSourcesData?.lead_sources?.map((source) => ({
                    value: source.name || source.id || source.value,
                    label: source.name || source.label || source.value,
                }));
            }
        }
        
        if (leadSourcesData?.lead_sources && Array.isArray(leadSourcesData?.lead_sources)) {
            return leadSourcesData?.lead_sources?.map((source) => ({
                value: typeof source === 'string' ? source : (source.name || source.id || source.value),
                label: typeof source === 'string' ? source : (source.name || source.label || source.value),
            }));
        }
        
        return [];
    }, [leadSourcesData]);

    // Transform API response to options format for Telecallers Selector
    // const telecallerOptions = useMemo(() => {
    //     if (!telecallersData) return [];
        
    //     const options = [{ value: 'Unassigned', label: 'Unassigned' }];
        
    //     if (telecallersData?.items && Array.isArray(telecallersData.items) && telecallersData.items.length > 0) {
    //         const telecallers = telecallersData.items.map((telecaller) => ({
    //             value: telecaller.id || null,
    //             label: telecaller.name || '',
    //         }));
    //         return [...options, ...telecallers];
    //     }
        
    //     if (Array.isArray(telecallersData?.telecallers) && telecallersData?.telecallers?.length > 0) {
    //         const telecallers = telecallersData.telecallers.map((telecaller) => ({
    //             value: telecaller.id || null,
    //             label: telecaller.name || '',
    //         }));
    //         return [...options, ...telecallers];
    //     }
        
    //     if (Array.isArray(telecallersData) && telecallersData.length > 0) {
    //         const telecallers = telecallersData.map((telecaller) => ({
    //             value: telecaller.id || null,
    //             label: telecaller.name || '',
    //         }));
    //         return [...options, ...telecallers];
    //     }
        
    //     if (telecallersData?.data && Array.isArray(telecallersData.data)) {
    //         const telecallers = telecallersData.data.map((telecaller) => ({
    //             value: typeof telecaller === 'object' ? (telecaller.id || null) : null,
    //             label: typeof telecaller === 'object' ? (telecaller.name || '') : telecaller,
    //         }));
    //         return [...options, ...telecallers];
    //     }
        
    //     return options;
    // }, [telecallersData]);

    // Transform API response to options format for Status Selector
    const leadStatusOptions = useMemo(() => {
        if (!leadStatusData) return [];

        // Handle different API response formats
        if (Array.isArray(leadStatusData?.lead_status) && leadStatusData?.lead_status?.length > 0) {
            if (typeof leadStatusData?.lead_status[0] === 'string') {
                return leadStatusData?.lead_status?.map((status) => ({
                    value: status,
                    label: status,
                }));
            }
            if (typeof leadStatusData?.lead_status[0] === 'object') {
                return leadStatusData?.lead_status?.map((status) => ({
                    value: status.name || status.id || status.value,
                    label: status.name || status.label || status.value,
                }));
            }
        }

        if (Array.isArray(leadStatusData) && leadStatusData.length > 0) {
            if (typeof leadStatusData[0] === 'string') {
                return leadStatusData.map((status) => ({
                    value: status,
                    label: status,
                }));
            }
            if (typeof leadStatusData[0] === 'object') {
                return leadStatusData.map((status) => ({
                    value: status.name || status.id || status.value,
                    label: status.name || status.label || status.value,
                }));
            }
        }

        if (leadStatusData?.data && Array.isArray(leadStatusData.data)) {
            return leadStatusData.data.map((status) => ({
                value: typeof status === 'string' ? status : (status.name || status.id || status.value),
                label: typeof status === 'string' ? status : (status.name || status.label || status.value),
            }));
        }

        return [];
    }, [leadStatusData]);

    // Handle status update
    const handleStatusChange = async (newStatus) => {
        if (!newStatus || newStatus === status) return; // Don't update if same value or empty
        
        const previousStatus = status; // Store previous status for rollback
        setStatus(newStatus); // Optimistic update
        
        try {
            await updateLead({
                id: id,
                initial_status: newStatus,
            }).unwrap();
            
            // Refetch lead data to ensure UI is in sync
            await refetchLead();
            toast.success('Status updated successfully!');
        } catch (error) {
            console.error('Error updating lead status:', error);
            // Revert status on error
            setStatus(previousStatus);
            const errorMessage = 
                error?.data?.message || 
                error?.data?.error || 
                error?.data?.detail ||
                error?.message ||
                'Failed to update status. Please try again.';
            toast.error(errorMessage);
        }
    };

    // Handle back navigation based on user role
    const handleBack = () => {
        if (isTelecaller) {
            navigate('/telecaller/leads');
        } else {
            navigate('/leads');
        }
    };

    // Handle log call modal
    const handleOpenLogCallModal = () => {
        setIsLogCallModalOpen(true);
    };

    const handleCloseLogCallModal = () => {
        setIsLogCallModalOpen(false);
        setCallFormData({
            callType: '',
            duration: '',
            callNote: '',
        });
    };

    const handleCallInputChange = (field) => (e) => {
        setCallFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    // Handle reminder modal
    const handleOpenReminderModal = () => {
        setIsReminderModalOpen(true);
    };

    const handleCloseReminderModal = () => {
        setIsReminderModalOpen(false);
        setReminderFormData({
            title: '',
            dueDate: '',
            dueTime: '',
            description: '',
        });
    };

    const handleReminderInputChange = (field) => (e) => {
        setReminderFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleReminderDateChange = (e) => {
        setReminderFormData((prev) => ({
            ...prev,
            dueDate: e.target.value,
        }));
    };

    const handleReminderTimeChange = (e) => {
        setReminderFormData((prev) => ({
            ...prev,
            dueTime: e.target.value,
        }));
    };

    const handleCreateReminder = async () => {
        // Validate required fields
        if (!reminderFormData.title || !reminderFormData.dueDate || !reminderFormData.dueTime) {
            toast.error('Please fill in all required fields (Title, Due Date, and Time)');
            return;
        }

        try {
            // Format time to include seconds for API (HH:mm:ss format)
            const timeParts = reminderFormData.dueTime.split(':');
            const formattedTime = timeParts.length === 2 
                ? `${reminderFormData.dueTime}:00` 
                : reminderFormData.dueTime;

            // Prepare reminder data for API
            const reminderData = {
                lead_id: parseInt(id),
                user_id: user?.id, // Use user ID from context or default
                title: reminderFormData.title,
                description: reminderFormData.description || null,
                reminder_date: reminderFormData.dueDate,
                reminder_time: formattedTime,
            };

            // Create reminder via API
            await createReminder(reminderData).unwrap();
            
            // Close modal and reset form on success
            handleCloseReminderModal();
            toast.success('Reminder created successfully!');
            
            // Note: The mutation will automatically invalidate the cache and refetch
            // due to invalidatesTags in the API definition
        } catch (error) {
            console.error('Error creating reminder:', error);
            const errorMessage = 
                error?.data?.message || 
                error?.data?.error || 
                error?.message ||
                'Failed to create reminder. Please try again.';
            toast.error(errorMessage);
        }
    };

    const handleLogCall = async () => {
        // Validate required fields
        if (!callFormData.callType || !callFormData.duration) {
            toast.error('Please fill in all required fields (Call Type and Duration)');
            return;
        }

        try {
            // Prepare call data for API
            const callData = {
                lead_id: parseInt(id),
                call_type: callFormData.callType,
                duration_seconds: parseInt(callFormData.duration),
                notes: callFormData.callNote || null,
            };

            // Create call via API
            await createLeadCall(callData).unwrap();
            
            // Close modal and reset form on success
            handleCloseLogCallModal();
            toast.success('Call logged successfully!');
            
            // Note: The mutation will automatically invalidate the cache and refetch
            // due to invalidatesTags in the API definition
        } catch (error) {
            console.error('Error logging call:', error);
            const errorMessage = 
                error?.data?.message || 
                error?.data?.error || 
                error?.data?.detail ||
                error?.message ||
                'Failed to log call. Please try again.';
            toast.error(errorMessage);
        }
    };

    // Call type options
    const callTypeOptions = [
        { value: 'outgoing', label: 'Outgoing' },
        { value: 'incoming', label: 'Incoming' },
    ];

    // Format duration from seconds to "Xm Ys" format
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (mins > 0 && secs > 0) {
            return `${mins}m ${secs}s`;
        } else if (mins > 0) {
            return `${mins}m 0s`;
        } else {
            return `0m ${secs}s`;
        }
    };

    // Format date to "Month Day, Year Hour:Minute AM/PM" format
    const formatCallDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Format reminder due date
    const formatReminderDueDate = (dateString, timeString) => {
        if (!dateString || !timeString) return '';
        // Handle time format - API might return HH:mm:ss or just HH:mm
        const timeOnly = timeString.split(' ')[0].split('.')[0]; // Remove timezone and milliseconds if present
        const dateTime = new Date(`${dateString}T${timeOnly}`);
        if (isNaN(dateTime.getTime())) {
            return `${dateString} ${timeOnly}`; // Fallback if date parsing fails
        }
        return dateTime.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    // Loading state
    if (isLoadingLead) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Error state
    if (leadError || !lead) {
        return (
            <Box sx={{ textAlign: 'center', padding: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {leadError?.data?.detail || leadError?.data?.message || 'Lead not found'}
                </Typography>
                <Button onClick={handleBack} variant="contained" sx={{ mt: 2 }}>
                    Back to Leads
                </Button>
            </Box>
        );
    }

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

    const tabs = [
        {
            label: `Call Logs (${callLogs.length})`,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Call History
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenLogCallModal}
                            sx={{
                                backgroundColor: '#1F2937',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                },
                            }}
                        >
                            Log Call
                        </Button>
                    </Box>
                    {isLoadingCalls ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : callLogs.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: 4,
                                color: '#6B7280',
                            }}
                        >
                            <Typography>No call logs yet. Log your first call to get started.</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {callLogs.map((callLog) => (
                                <Box
                                    key={callLog.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                        <PhoneIcon
                                            sx={{
                                                color: callLog.callType === 'outgoing' ? '#10B981' : '#3B82F6',
                                                fontSize: 20,
                                                mt: 0.5,
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                        color: '#1F2937',
                                                    }}
                                                >
                                                    {callLog.callType} {formatDuration(callLog.duration)}
                                                </Typography>
                                            </Box>
                                            {callLog.callNote && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: '#374151', mb: 1 }}
                                                >
                                                    {callLog.callNote}
                                                </Typography>
                                            )}
                                            <Typography
                                                variant="caption"
                                                sx={{ color: '#9CA3AF' }}
                                            >
                                                {callLog.userName} • {formatCallDate(callLog.timestamp)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            ),
        },
        {
            label: `Notes (0)`,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Notes
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                backgroundColor: '#1F2937',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                },
                            }}
                        >
                            Add Note
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            textAlign: 'center',
                            padding: 4,
                            color: '#6B7280',
                        }}
                    >
                        <Typography>No notes yet.</Typography>
                    </Box>
                </Box>
            ),
        },
        {
            label: `Reminders (${reminders.length})`,
            content: (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Reminders
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenReminderModal}
                            sx={{
                                backgroundColor: '#1F2937',
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                },
                            }}
                        >
                            Add Reminder
                        </Button>
                    </Box>
                    {isLoadingReminders ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : reminders.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: 'center',
                                padding: 4,
                                color: '#6B7280',
                            }}
                        >
                            <Typography>No reminders yet.</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {reminders.map((reminder) => (
                                <Box
                                    key={reminder.id}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                fontWeight: 600,
                                                color: '#1F2937',
                                            }}
                                        >
                                            {reminder.title}
                                        </Typography>
                                        {reminder.description && (
                                            <Typography
                                                variant="body2"
                                                sx={{ color: '#374151' }}
                                            >
                                                {reminder.description}
                                            </Typography>
                                        )}
                                        <Typography
                                            variant="caption"
                                            sx={{ color: '#9CA3AF' }}
                                        >
                                            Due: {formatReminderDueDate(reminder.reminder_date, reminder.reminder_time)} • ({reminder.userName})
                                        </Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
            ),
        },
    ];

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        color: '#6B7280',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    Back to Leads
                </Button>
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleEditClick}
                    sx={{
                        borderRadius: '10px',
                        backgroundColor: '#1F2937',
                        textTransform: 'none',
                        '&:hover': {
                            backgroundColor: '#374151',
                        },
                    }}
                >
                    Edit Lead
                </Button>
            </Box>
            <Stack spacing={3}>
                <Grid container spacing={3} sx={{ }}>
                    {/* Lead Overview */}
                    <Grid item xs={12} md={8} sx={{ width:"60%" }}>
                        <Box
                            sx={{
                                p: 3,
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                borderRadius: 1,
                                width: '100%',
                            }}
                        ><Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>
                            {lead.name}
                        </Typography>
                        <Chip
                            label={lead.status}
                            size="small"
                            sx={{
                                backgroundColor: getStatusBgColor(lead.status),
                                color: getStatusColor(lead.status),
                                fontWeight: 500,
                                fontSize: '12px',
                            }}
                        />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Lead ID: {lead.id}
                    </Typography>
                            {isEditMode ? (
                                // Edit Form
                                <Box>
                                    <Grid container spacing={2}>
                                        {/* Left Column */}
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Label required>Name</Label>
                                                <Input
                                                    value={editFormData.name}
                                                    onChange={handleEditInputChange('name')}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Label required>Phone</Label>
                                                <Input
                                                    value={editFormData.phone}
                                                    onChange={handleEditInputChange('phone')}
                                                    placeholder="+1234567890"
                                                    type="tel"
                                                    required
                                                />
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Label>Source</Label>
                                                <Selector
                                                    value={editFormData.source}
                                                    onChange={handleEditSelectChange('source')}
                                                    placeholder="Select source"
                                                    options={leadSourceOptions}
                                                    disabled={isLoadingSources}
                                                />
                                            </Box>
                                        </Grid>

                                        {/* Right Column */}
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ mb: 2 }}>
                                                <Label required>Email</Label>
                                                <Input
                                                    value={editFormData.email}
                                                    onChange={handleEditInputChange('email')}
                                                    placeholder="john@example.com"
                                                    type="email"
                                                    required
                                                />
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Label>Company</Label>
                                                <Input
                                                    value={editFormData.company}
                                                    onChange={handleEditInputChange('company')}
                                                    placeholder="Acme Inc."
                                                />
                                            </Box>
                                            <Box sx={{ mb: 2 }}>
                                                <Label>Campaign</Label>
                                                <Input
                                                    value={editFormData.campaign}
                                                    onChange={handleEditInputChange('campaign')}
                                                    placeholder="Q4 2025"
                                                />
                                            </Box>
                                            
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-start' }}>
                                        <Button
                                            variant="contained"
                                            onClick={handleSaveEdit}
                                            disabled={isUpdating}
                                            sx={{
                                                backgroundColor: '#1F2937',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    backgroundColor: '#374151',
                                                },
                                            }}
                                        >
                                            {isUpdating ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={handleCancelEdit}
                                            sx={{
                                                textTransform: 'none',
                                                borderColor: '#E5E7EB',
                                                color: '#374151',
                                                '&:hover': {
                                                    borderColor: '#D1D5DB',
                                                    backgroundColor: '#F9FAFB',
                                                },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                // View Mode
                                <>
                                    

                                    <Grid container spacing={16} >
                                        <Grid item xs={12} sm={6} >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <PhoneIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <Typography variant="body2">{lead.phone}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <BusinessIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <Typography variant="body2">{lead.company}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <LocationOnIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <Typography variant="body2">Source: {lead.source}</Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <EmailIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <Typography variant="body2">{lead.email}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <PersonIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <Typography variant="body2">{lead.assignedTo}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                                <CalendarTodayIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                                                <Typography variant="body2">Created: {lead.created}</Typography>
                                            </Box>
                                         </Grid>
                                     </Grid>
                                </>
                            )}
                         </Box>
                     </Grid>

                    {/* Quick Actions */}
                    <Grid item xs={12} md={4} sx={{ width:"35%" }}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 1,
                                width: '100%',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Quick Actions
                            </Typography>
                            <FormControl fullWidth sx={{ mb: 2}}>
                                <Label>Update Status</Label>
                                <Selector
                                    value={status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    placeholder="Select status"
                                    options={leadStatusOptions}
                                    disabled={isUpdating || isLoadingStatus || isLoadingLead}
                                    required
                                />
                                {/* <Select
                                    value={status}
                                    label="Update Status"
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    size="small"
                                    disabled={isUpdating || isLoadingStatus}
                                >
                                    {leadStatusOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select> */}
                            </FormControl>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<PhoneIcon />}
                                sx={{
                                    mb: 1,
                                    textTransform: 'none',
                                    borderColor: '#E5E7EB',
                                    color: '#374151',
                                    '&:hover': {
                                        borderColor: '#D1D5DB',
                                        backgroundColor: '#F9FAFB',
                                    },
                                }}
                            >
                                Call {lead.name}
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<EmailIcon />}
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#E5E7EB',
                                    color: '#374151',
                                    '&:hover': {
                                        borderColor: '#D1D5DB',
                                        backgroundColor: '#F9FAFB',
                                    },
                                }}
                             >
                                 Send Email
                             </Button>
                         </Box>
                     </Grid>
                 </Grid>
                <Grid container spacing={3}>
                    {/* Activity Tabs */}
                    <Grid item xs={12} md={8} sx={{  }}>
                        <Box
                            sx={{
                                width: '100%',
                            }}
                        >
                            <Tabs tabs={tabs} />
                        </Box>
                    </Grid>

                    {/* Lead Information */}
                    <Grid item xs={12} sm={4} sx={{  }}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 1,
                                width: '350px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Lead Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Created
                                    </Typography>
                                    <Typography variant="body2">{lead.createdTime || lead.created}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Last Updated
                                    </Typography>
                                    <Typography variant="body2">{lead.lastUpdated || lead.created}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Assigned To
                                    </Typography>
                                    <Typography variant="body2">{lead.assignedTo}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>

            {/* Log Call Modal */}
            <Modal
                open={isLogCallModalOpen}
                onClose={handleCloseLogCallModal}
                title="Log Call"
                subtitle="Record a call for this lead"
                maxWidth="md"
                primaryButton={{
                    label: isCreatingCall ? 'Logging...' : 'Log Call',
                    onClick: handleLogCall,
                    disabled: isCreatingCall,
                }}
                secondaryButton={{
                    label: 'Cancel',
                    onClick: handleCloseLogCallModal,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <Label required>Call Type</Label>
                        <Selector
                            value={callFormData.callType}
                            onChange={handleCallInputChange('callType')}
                            placeholder="Select call type"
                            options={callTypeOptions}
                            required
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Label required>Duration (seconds)</Label>
                        <Input
                            value={callFormData.duration}
                            onChange={handleCallInputChange('duration')}
                            placeholder="Enter duration in seconds"
                            type="number"
                            required
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Label>Call Note</Label>
                        <Input
                            value={callFormData.callNote}
                            onChange={handleCallInputChange('callNote')}
                            placeholder="Enter call notes"
                            multiline
                            rows={2}
                        />
                    </Box>
                </Box>
            </Modal>

            {/* Reminder Modal */}
            <Modal
                open={isReminderModalOpen}
                onClose={handleCloseReminderModal}
                title="Add Reminder"
                subtitle="Create a reminder for this lead"
                maxWidth="md"
                primaryButton={{
                    label: isCreatingReminder ? 'Creating...' : 'Create Reminder',
                    onClick: handleCreateReminder,
                    disabled: isCreatingReminder,
                }}
                secondaryButton={{
                    label: 'Cancel',
                    onClick: handleCloseReminderModal,
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                    <Box sx={{ width: '100%' }}>
                        <Label required>Title</Label>
                        <Input
                            value={reminderFormData.title}
                            onChange={handleReminderInputChange('title')}
                            placeholder="Enter reminder title"
                            required
                        />
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Label required>Due Date</Label>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', flex: 1 }}>
                                <Input
                                    value={reminderFormData.dueDate}
                                    onChange={handleReminderDateChange}
                                    placeholder="dd-mm-yyyy"
                                    type="date"
                                    required
                                    sx={{
                                        '& input[type="date"]::-webkit-calendar-picker-indicator': {
                                            opacity: 0,
                                            position: 'absolute',
                                            right: 0,
                                            width: '100%',
                                            height: '100%',
                                            cursor: 'pointer',
                                        },
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pointerEvents: 'none',
                                        color: '#9CA3AF',
                                    }}
                                >
                                    <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                            <Box sx={{ position: 'relative', flex: 1 }}>
                                <Input
                                    value={reminderFormData.dueTime}
                                    onChange={handleReminderTimeChange}
                                    placeholder="--:-- --"
                                    type="time"
                                    required
                                    sx={{
                                        '& input[type="time"]::-webkit-calendar-picker-indicator': {
                                            opacity: 0,
                                            position: 'absolute',
                                            right: 0,
                                            width: '100%',
                                            height: '100%',
                                            cursor: 'pointer',
                                        },
                                    }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pointerEvents: 'none',
                                        color: '#9CA3AF',
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 18 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%' }}>
                        <Label>Description</Label>
                        <Input
                            value={reminderFormData.description}
                            onChange={handleReminderInputChange('description')}
                            placeholder="Enter reminder description"
                            multiline
                            rows={3}
                        />
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default LeadDetailsContainer;

