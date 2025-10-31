import React from 'react';
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  InputAdornment,
  useTheme,
} from '@mui/material';

interface CountryCode {
  code: string;
  label: string;
  phone: string;
}

interface AppInputSelectProps {
  label?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  options: CountryCode[];
  required?: boolean;
  starRequired?: boolean;
}

export default function AppInputSelect({
  label,
  name,
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  options,
  required = false,
  starRequired = false,
}: AppInputSelectProps) {
  const theme = useTheme();

  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel sx={{ mb: 1 }}>
          {label}
          {starRequired && <span style={{ color: 'red' }}> *</span>}
        </FormLabel>
      )}

      <TextField
        name={name}
        type="number"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="81XXXXXXX"
        sx={{
          '& .MuiInputBase-root': {
            height: 40,
            borderRadius: 1,
            fontSize: 14,
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
            borderWidth: 2,
            borderRadius: '8px',
            fontSize: 12,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <TextField
                select
                type="number"
                value={countryCode}
                onChange={(e) => onCountryCodeChange(e.target.value)}
                variant="standard"
                sx={{
                  width: '80px',
                  '& .MuiSelect-select': {
                    py: 0.5,
                    fontSize: 14,
                  },
                  '& .MuiInputBase-root:before, & .MuiInputBase-root:after': {
                    display: 'none',
                  },
                }}
              >
                {options.map((opt) => (
                  <MenuItem key={opt.code} value={opt.phone}>
                    {opt.code} {opt.phone}
                  </MenuItem>
                ))}
              </TextField>
            </InputAdornment>
          ),
        }}
      />
    </FormControl>
  );
}
