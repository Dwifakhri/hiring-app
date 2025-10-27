'use client';

import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface PaletteColor {
    100?: string; // Hover
    200?: string; // Pressed
    300?: string; // Focus
    400?: string; // Border
    500?: string; // Surface
  }

  interface SimplePaletteColorOptions {
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
  }
}

const theme = createTheme({
  palette: {
    background: {
      default: '#FAFAFA',
    },
    primary: {
      main: '#01959F', // Main
      contrastText: '#fff', // Text
      100: '#01777F', // Hover
      200: '#01595F', // Pressed
      300: 'rgba(1, 149, 159, 0.2)', // Focus (20%)
      400: '#4DB5BC', // Border
      500: '#F3FBFC', // Surface
    },
    secondary: {
      main: '#FBC037', // Main
      contrastText: '#404040', // Text
      100: '#F8A92F', // Hover
      200: '#FA9810', // Pressed
      300: 'rgba(251, 192, 55, 0.2)', // Focus (20%)
      400: '#FEEABC', // Border
      500: '#FFFFF5', // Surface
    },
    error: {
      main: '#E01428', // Main
      100: '#BC1121', // Hover
      200: '#700A14', // Pressed
      300: 'rgba(224, 20, 40, 0.2)', // Focus (20%)
      400: '#F5B1B7', // Border
      500: '#FFF9FA', // Surface
    },
    warning: {
      main: '#CA7336', // Main
      100: '#B1652F', // Hover
      200: '#985628', // Pressed
      300: 'rgba(202, 115, 54, 0.2)', // Focus (20%)
      400: '#FEB17B', // Border
      500: '#FCF7F3', // Surface
    },
    success: {
      main: '#43936C', // Main
      100: '#367A59', // Hover
      200: '#20573D', // Pressed
      300: 'rgba(67, 147, 108, 0.2)', // Focus (20%)
      400: '#B8DBCA', // Border
      500: '#F7F7F7', // Surface
    },
    info: {
      main: '#1D1F20', // Main
      contrastText: '#FFFFFF',
      100: '#616161', // Hover
      200: '#404040', // Pressed
      300: '#030303ff', // Focus (20%)
      400: '#C2C2C2', // Border
      500: '#FAFAFA', // Surface
    },
    text: {
      primary: '#1D1F20', // Heading, main text, selected text
      secondary: '#616161', // Paragraph, enabled text, dark bg fill
      disabled: '#9E9E9E', // Disabled text,
    },
    divider: '#E0E0E0',
  },
  typography: {
    h1: {
      fontWeight: 700,
    },
    fontFamily: ['Nunito Sans', '-apple-system'].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          padding: '40px',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '12px',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
  },
});

export default theme;
