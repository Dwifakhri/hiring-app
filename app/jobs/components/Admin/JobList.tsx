'use client';

import { formatCurrency } from '@/utils/formatNumber';
import AppButton from '@/components/AppButton';
import { Box, Card, Chip, Typography } from '@mui/material';
import type { Jobs } from '@/types/jobs';
import { useRouter } from 'next/navigation';

interface JobListProps {
  jobs: Jobs[];
}

export default function JobList({ jobs }: JobListProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'success' as const,
          backgroundColor: 'success.500',
          borderColor: 'success.400',
        };
      case 'draft':
        return {
          color: 'warning' as const,
          backgroundColor: 'warning.500',
          borderColor: 'warning.400',
        };
      case 'inactive':
        return {
          color: 'error' as const,
          backgroundColor: 'error.500',
          borderColor: 'error.400',
        };
      default:
        return {
          color: 'default' as const,
          backgroundColor: 'grey.300',
          borderColor: 'grey.400',
        };
    }
  };

  const handleManageJob = (jobId: number) => {
    router.push(`/jobs/detail/${jobId}/applicants`);
  };

  return (
    <div className="mt-4">
      {jobs.map((job) => {
        const statusColors = getStatusColor(job.status);
        return (
          <Card
            key={job.id}
            sx={{
              p: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              mb: 2,
              boxShadow: '0px 4px 8px 0px #0000001A',
            }}
          >
            <Box display="flex" columnGap={2}>
              <Chip
                variant="outlined"
                label={job.status}
                color={statusColors.color}
                sx={{
                  'span.MuiChip-label': {
                    p: 0,
                  },
                  fontSize: '14px',
                  fontWeight: 700,
                  p: '4px 16px',
                  backgroundColor: statusColors.backgroundColor,
                  borderRadius: '8px',
                  borderColor: statusColors.borderColor,
                  textTransform: 'capitalize',
                }}
              />
              <Chip
                variant="outlined"
                label={`Started on ${formatDate(job.created_date)}`}
                color="default"
                sx={{
                  'span.MuiChip-label': {
                    p: 0,
                  },
                  p: '4px 16px',
                  borderRadius: '4px',
                  borderColor: 'divider',
                }}
              />
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="end">
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>
                  {job.job_name}
                </Typography>
                <Typography variant="subtitle1">
                  {formatCurrency(job.salary_min)} -{' '}
                  {formatCurrency(job.salary_max)}
                </Typography>
              </Box>
              <AppButton
                label="Manage Job"
                variant="contained"
                fullWidth={false}
                disabled={job.status !== 'active'}
                onClick={() => handleManageJob(job.id)}
              />
            </Box>
          </Card>
        );
      })}
    </div>
  );
}
