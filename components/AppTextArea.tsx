import {
  FormControl,
  FormLabel,
  Box,
  Typography,
  FormHelperText,
  TextareaAutosize,
} from '@mui/material';
import { AlertTriangle } from 'react-feather';

interface AppTextAreaProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  starRequired?: boolean;
}

export default function AppInputForm({
  label,
  name,
  placeholder,
  value,
  onChange,
  error = false,
  helperText = '',
  required = false,
  starRequired = false,
}: AppTextAreaProps) {
  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel htmlFor={name} className="mb-2">
          {label}
          {starRequired && <span style={{ color: 'red' }}>*</span>}
        </FormLabel>
      )}
      <Box
        sx={{
          '& textarea': {
            fontSize: '14px',
            padding: '10px 14px',
            borderWidth: '2px',
            borderColor: 'divider',
            borderRadius: '8px',
            borderStyle: 'solid',
            fontFamily: 'inherit',
            width: '100%',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
            outline: 'none',
            '&:hover': {
              borderColor: 'primary.main',
            },
            '&:focus': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
          },
        }}
      >
        <TextareaAutosize
          required={required}
          name={name}
          minRows={4}
          aria-label="maximum height"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </Box>
      {error && (
        <FormHelperText id="filled-weight-helper-text">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AlertTriangle size={16} color={'error'} />
            <Typography variant="body2" color="text.error">
              {helperText}
            </Typography>
          </Box>
        </FormHelperText>
      )}
    </FormControl>
  );
}
