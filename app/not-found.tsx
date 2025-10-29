'use client';

import { Box, Typography, Container } from '@mui/material';
import AppButton from '@/components/AppButton';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          fontWeight={700}
          color="primary"
          sx={{ fontSize: { xs: '4rem', md: '6rem' }, mb: 2 }}
        >
          404
        </Typography>

        <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          The page you are looking for does not exist or has been moved.
        </Typography>

        <AppButton
          label="Return Home"
          color="secondary"
          onClick={() => router.push('/')}
          fullWidth={false}
        />
      </Box>
    </Container>
  );
}
