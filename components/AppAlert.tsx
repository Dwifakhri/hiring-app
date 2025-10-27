import * as React from 'react';
import { Alert, AlertTitle } from '@mui/material';

interface AppAlertProps {
  severity?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  message: string;
  onClose?: () => void;
}

export default function AppAlert({
  severity = 'info',
  title,
  message,
}: AppAlertProps) {
  return (
    <Alert
      variant="outlined"
      severity={severity}
      sx={{
        mt: 2,
        borderRadius: 2,
        alignItems: 'center',
        fontWeight: 700,
        color:
          severity === 'error'
            ? 'error.main'
            : severity === 'success'
            ? 'success.main'
            : severity === 'warning'
            ? 'warning.main'
            : 'text.primary',
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message}
    </Alert>
  );
}
