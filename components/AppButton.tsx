'use client';
import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

type AppButtonProps = {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  fullWidth?: boolean;
  variant?: 'text' | 'outlined' | 'contained';
  disabled?: boolean;
  loading?: boolean;
};

const AppButton: React.FC<AppButtonProps> = ({
  label,
  onClick,
  type = 'submit',
  color = 'primary',
  fullWidth = true,
  variant = 'contained',
  disabled = false,
  loading = false,
}) => {
  const theme = useTheme();

  const palette = theme.palette[color] || theme.palette.primary;

  return (
    <Button
      type={type}
      color={color}
      fullWidth={fullWidth}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      disableElevation
      loading={loading}
      loadingPosition="start"
      sx={{
        borderRadius: '8px',
        fontWeight: 700,
        textTransform: 'none',
        boxShadow:
          variant === 'text' ? 'none' : '0px 1px 2px 0px rgba(0, 0, 0, 0.12)',
        bgcolor: variant === 'contained' ? palette.main : 'transparent',
        borderColor: variant === 'outlined' ? palette[400] : 'transparent',
        '&:hover': {
          bgcolor: variant === 'contained' ? palette[100] : palette[500],
          borderColor: palette[100],
        },
        '&:active': {
          bgcolor: variant === 'contained' ? palette[200] : undefined,
        },
        '&:focus-visible': {
          outline: `3px solid ${palette[300]}`,
          outlineOffset: '2px',
        },
      }}
    >
      {label}
    </Button>
  );
};

export default AppButton;
