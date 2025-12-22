'use client';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import AppButton from '@/components/AppButton';
import successPost from '@/assets/images/success-post.svg';
import { useRouter } from 'next/navigation';

export default function SuccessApplyJob() {
  const router = useRouter();
  return (
    <Box
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      m="auto"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
        }}
      >
        <Image src={successPost} alt="No Jobs" width={285} />
        <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
          🎉 Your application was sent!
        </Typography>
        <Typography variant="subtitle1" fontWeight="400" textAlign="center">
          Congratulations! You&apos;ve taken the first step towards a rewarding
          career at Ohirings.
          <br />
          We look forward to learning more about you during the application
          process.
        </Typography>
        <AppButton
          type="button"
          label="Back to Jobs"
          color="secondary"
          onClick={() => router.push('/jobs')}
          fullWidth={false}
        />
      </Box>
    </Box>
  );
}
