import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { AlertTriangle } from 'react-feather';

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface AppRadioGroupProps {
  label?: string;
  name: string;
  value: string;
  options: RadioOption[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  row?: boolean;
  required?: boolean;
  starRequired?: boolean;
  error?: boolean;
  helperText?: string;
}

export default function AppRadioGroup({
  label,
  name,
  value,
  options,
  onChange,
  row = false,
  starRequired = false,
  error = false,
  helperText,
}: AppRadioGroupProps) {
  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel
          id={`${name}-label`}
          sx={{
            mb: 1,
            color: 'rgba(0, 0, 0, 0.6)',
            '&.Mui-focused': {
              color: 'inherit',
            },
            '&.Mui-error': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
          }}
        >
          {label}
          {starRequired && <span style={{ color: 'red' }}> *</span>}
        </FormLabel>
      )}
      <RadioGroup
        row={row}
        aria-labelledby={`${name}-label`}
        name={name}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio size="small" />}
            label={option.label}
            disabled={option.disabled}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: 13, // smaller text
              },
            }}
          />
        ))}
      </RadioGroup>
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
