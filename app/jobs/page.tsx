'use client';
import { useAuth } from '@/context/auth';
import { Box } from '@mui/material';
import AdminJobs from './components/Admin/AdminJobs';
import ApplicantJobs from './components/applicant/ApplicantJobs';

export default function Jobs() {
  const { user, status } = useAuth();

  if (status === 'loading') {
    return null;
  }
  return (
    <>
      <Box width="100%">
        {user?.role === 'admin' ? <AdminJobs /> : <ApplicantJobs />}
      </Box>
    </>
  );
}
