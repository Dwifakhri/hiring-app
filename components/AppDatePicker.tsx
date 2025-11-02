import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { AlertTriangle } from 'react-feather';

interface AppDatePickerProps {
  label?: string;
  name: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  required?: boolean;
  starRequired?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  disableFuture?: boolean;
  disablePast?: boolean;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

export default function AppDatePicker({
  label,
  name,
  value,
  onChange,
  required = false,
  starRequired = false,
  minDate,
  maxDate,
  disableFuture,
  disablePast,
  placeholder = 'Select date',
  error = false,
  helperText,
}: AppDatePickerProps) {
  const handleChange = useCallback(
    (newValue: Dayjs | null) => {
      onChange(newValue);
    },
    [onChange]
  );

  const theme = useTheme();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl fullWidth>
        {label && (
          <FormLabel
            htmlFor={name}
            sx={{
              mb: 1,
              '&.Mui-focused': {
                color: 'inherit',
              },
            }}
          >
            {label}
            {starRequired && <span style={{ color: 'red' }}>*</span>}
          </FormLabel>
        )}
        <DesktopDatePicker
          value={value}
          onChange={handleChange}
          minDate={minDate}
          maxDate={maxDate}
          disableFuture={disableFuture}
          disablePast={disablePast}
          localeText={{}}
          slotProps={{
            textField: {
              required,
              fullWidth: true,
              size: 'small',
              name,
              placeholder,
              error,
              sx: {
                '& .MuiPickersOutlinedInput-root': {
                  borderRadius: '8px',
                  fontSize: '14px',
                  '& fieldset': {
                    borderColor: error ? theme.palette.error.main : 'divider',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: error
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: error
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '14px',
                  color: theme.palette.text.secondary,
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderWidth: '2px',
                    borderColor: error ? theme.palette.error.main : 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: error
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: error
                      ? theme.palette.error.main
                      : theme.palette.primary.main,
                  },
                },
              },
            },
          }}
        />
        {error && (
          <FormHelperText id="filled-weight-helper-text" component="div">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AlertTriangle size={14} color={'#d32f2f'} />
              <Typography variant="body2" color="error" component="span">
                {helperText}
              </Typography>
            </Box>
          </FormHelperText>
        )}
      </FormControl>
    </LocalizationProvider>
  );
}
