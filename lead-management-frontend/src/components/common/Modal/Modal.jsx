import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Modal = ({ 
  open, 
  onClose, 
  title, 
  subtitle, 
  children, 
  primaryButton, 
  secondaryButton,
  maxWidth = "md"
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
    //   fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          width: maxWidth === "md" ? "550px" : "400px",
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: '#F3F3F5',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {children}
      </DialogContent>
      {(primaryButton || secondaryButton) && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          {secondaryButton && (
            <Button
              onClick={secondaryButton.onClick}
              variant="outlined"
              sx={{
                borderColor: '#E5E7EB',
                color: 'text.primary',
                textTransform: 'none',
                borderRadius: '10px',
                padding: '8px 16px',
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              {secondaryButton.label}
            </Button>
          )}
          {primaryButton && (
            <Button
              onClick={primaryButton.onClick}
              variant="contained"
              sx={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                textTransform: 'none',
                borderRadius: '10px',
                padding: '8px 16px',
                '&:hover': {
                  backgroundColor: '#333333',
                },
              }}
            >
              {primaryButton.label}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;

