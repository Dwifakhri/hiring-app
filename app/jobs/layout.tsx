'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AppNavBar from '@/components/AppNavBar';
import { useJobsStore } from '@/store/jobs';
import { useEffect, useMemo } from 'react';
import { useAuth } from '@/context/auth';
import { usePathname } from 'next/navigation';

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const path = usePathname();
  const initializeJobs = useJobsStore((state) => state.initializeJobs);

  const isApplicantForm = useMemo(() => {
    return path.includes('/jobs/application/');
  }, [path]);

  useEffect(() => {
    initializeJobs();
  }, [initializeJobs]);

  return (
    <>
      <Box
        sx={{
          ...(isApplicantForm && { backgroundColor: '#fafafa' }),
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 0,
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          {!isApplicantForm && <AppNavBar />}
        </Box>

        <Container
          maxWidth={`${user?.role === 'admin' ? 'xl' : 'lg'}`}
          sx={{
            flex: 1,
            py: 3,
            display: 'flex',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {children}
        </Container>
      </Box>
    </>
  );
}
