import { useState } from 'react';
import { forwardRef } from 'react';
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
  error?: boolean;
  helperText?: string;
  required?: boolean;
  starRequired?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  inputAdornment?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AppInputForm = forwardRef<HTMLInputElement, AppInputFormProps>(
  (
    {
      label,
      name,
      type = 'text',
      placeholder,
      error = false,
      helperText = '',
      required = false,
      starRequired = false,
      autoFocus = false,
      autoComplete,
      inputAdornment = '',
      value,
      onChange,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);

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
              type="button"
              aria-label={
                showPassword ? 'hide the password' : 'display the password'
              }
              onClick={handleClickShowPassword}
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
          inputRef={ref}
          id={name}
          name={name}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={error}
          endAdornment={renderEndAdornment()}
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
);
AppInputForm.displayName = 'AppInputForm';
export default AppInputForm;
