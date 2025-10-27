import { FormControl, FormLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Dayjs } from 'dayjs';
import { useCallback } from 'react';
import { useTheme } from '@mui/material/styles';

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
              sx: {
                '& .MuiInputBase-input::placeholder': {
                  fontSize: '14px',
                  color: theme.palette.text.secondary,
                  opacity: 1,
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  '& fieldset': {
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              },
            },
          }}
        />
      </FormControl>
    </LocalizationProvider>
  );
}
