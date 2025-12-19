'use client';

import { useRouter } from 'next/navigation';
import { Box, Typography, Container, AppBar, Toolbar } from '@mui/material';
import AppButton from '@/components/AppButton';
import logoRa from '@/assets/images/logo-r.svg';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fafafa',
      }}
    >
      {/* Navigation */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ py: 2 }}
      >
        <Toolbar
          sx={{
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Image src={logoRa} alt="Logo" loading="lazy" />

          <AppButton
            size="large"
            label="Login"
            color="secondary"
            onClick={() => router.push('/auth/login')}
            fullWidth={false}
          />
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          py: { xs: 10, md: 20 },
        }}
      >
        <Typography
          variant="h2"
          fontWeight={700}
          sx={{
            mb: 3,
            lineHeight: 1.2,
            fontSize: { xs: '2.5rem', md: '3.75rem' },
          }}
        >
          Streamline Your{' '}
          <Typography component="span" color="primary" fontWeight={700}>
            Hiring Process
          </Typography>
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: '600px', mx: 'auto', mb: 6 }}
        >
          Manage candidates, track applications, and make better hiring
          decisions with our modern recruitment platform.
        </Typography>

        <AppButton
          label="Get Started"
          color="secondary"
          onClick={() => router.push('/auth/login')}
          fullWidth={false}
          size="large"
        />
      </Container>
    </Box>
  );
}
