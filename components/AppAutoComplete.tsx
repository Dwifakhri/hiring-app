import {
  Autocomplete,
  TextField,
  FormControl,
  FormLabel,
  useTheme,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { AlertTriangle } from 'react-feather';

interface AppAutocompleteProps<T> {
  label?: string;
  placeholder?: string;
  name: string;
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  getOptionLabel: (option: T) => string;
  required?: boolean;
  starRequired?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function AppAutocomplete<T>({
  label,
  placeholder,
  name,
  options,
  value,
  onChange,
  getOptionLabel,
  required = false,
  starRequired = false,
  fullWidth = true,
  disabled = false,
  error = false,
  helperText,
}: AppAutocompleteProps<T>) {
  const theme = useTheme();

  return (
    <FormControl fullWidth={fullWidth}>
      {label && (
        <FormLabel
          htmlFor={name}
          sx={{
            mb: 1,
            '&.Mui-focused': { color: 'inherit' },
          }}
        >
          {label}
          {starRequired && <span style={{ color: 'red' }}> *</span>}
        </FormLabel>
      )}

      <Autocomplete
        disablePortal
        options={options}
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        getOptionLabel={getOptionLabel}
        disabled={disabled}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            placeholder={placeholder}
            required={required}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '& fieldset': {
                  borderWidth: '2px',
                  borderColor: error
                    ? theme.palette.error.main
                    : theme.palette.divider,
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
              },
            }}
          />
        )}
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
  );
}
