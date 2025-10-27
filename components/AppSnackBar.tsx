'use client';
import * as React from 'react';
import { Box, Typography, Snackbar, IconButton } from '@mui/material';
import { X, CheckCircle, XCircle } from 'react-feather';
import { useStatusStore } from '@/store/status';

export default function AppSnackbar() {
  const { status, message, setStatus } = useStatusStore();
  const [open, setOpen] = React.useState(false);

  // Open snackbar when message or status changes
  React.useEffect(() => {
    if (message && status) {
      setOpen(true);
    }
  }, [message, status]);

  const handleClose = () => {
    setOpen(false);
    // reset status after closing
    setTimeout(() => setStatus({ status: '', message: '' }), 300);
  };

  // pick color and icon based on status
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle size={24} color="#2C8E8B" />;
      case 'error':
        return <XCircle size={24} color="#D32F2F" />;
      default:
        return null;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#fff',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: '16px',
          padding: '12px 10px 12px 24px',
          minWidth: 320,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '12px',
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
            background:
              status === 'success'
                ? '#2C8E8B'
                : status === 'error'
                ? '#D32F2F'
                : '#0288D1',
          },
        }}
      >
        {getIcon()}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: '#333',
            flexGrow: 1,
            ml: 0.5,
          }}
        >
          {message}
        </Typography>

        <IconButton onClick={handleClose} sx={{ color: '#333' }}>
          <X size={22} />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
