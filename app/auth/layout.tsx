import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            height: '100svh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}{' '}
        </Box>
      </Container>
    </React.Fragment>
  );
}
