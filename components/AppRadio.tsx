import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

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
}

export default function AppRadioGroup({
  label,
  name,
  value,
  options,
  onChange,
  row = false,
  required = false,
  starRequired = false,
}: AppRadioGroupProps) {
  return (
    <FormControl fullWidth required={required}>
      {label && (
        <FormLabel
          id={`${name}-label`}
          sx={{
            mb: 1,
            '&.Mui-focused': {
              color: 'inherit',
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
    </FormControl>
  );
}
