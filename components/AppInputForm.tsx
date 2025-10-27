import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  FormHelperText,
  OutlinedInput,
} from '@mui/material';
import { AlertTriangle, Eye, EyeOff, Search } from 'react-feather';

interface AppInputFormProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  starRequired?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  inputAdornment?: string;
}

export default function AppInputForm({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onSubmit,
  error = false,
  helperText = '',
  required = false,
  starRequired = false,
  autoFocus = false,
  autoComplete,
  inputAdornment = '',
}: AppInputFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const renderEndAdornment = () => {
    if (inputAdornment === 'search') {
      return (
        <InputAdornment position="end">
          <IconButton edge="end">
            <Search size={20} color="#01959F" />
          </IconButton>
        </InputAdornment>
      );
    }

    if (inputAdornment === 'password') {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label={
              showPassword ? 'hide the password' : 'display the password'
            }
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            onMouseUp={handleMouseUpPassword}
            edge="end"
          >
            {!showPassword ? (
              <EyeOff size={16} color="black" />
            ) : (
              <Eye size={16} color="black" />
            )}
          </IconButton>
        </InputAdornment>
      );
    }
    return null;
  };

  const renderStartAdornment = () => {
    if (inputAdornment === 'number') {
      return (
        <InputAdornment position="start">
          <p className="font-bold">Rp</p>
        </InputAdornment>
      );
    }
    return null;
  };

  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel
          htmlFor={name}
          className="mb-2"
          sx={{
            '&.Mui-focused': {
              color: 'inherit',
            },
          }}
        >
          {label}
          {starRequired && <span style={{ color: 'red' }}>*</span>}
        </FormLabel>
      )}
      <OutlinedInput
        id={name}
        name={name}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        color={error ? 'error' : 'primary'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        error={error}
        endAdornment={renderEndAdornment()}
        startAdornment={renderStartAdornment()}
        sx={{
          fontSize: '14px',
          height: '40px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        }}
        slotProps={{
          notchedOutline: {
            sx: {
              borderWidth: '2px',
              borderColor: 'divider',
              borderRadius: '8px',
            },
          },
          input: {
            sx: {
              p: '10px 14px',
              borderRadius: '8px',
            },
          },
        }}
      />
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
