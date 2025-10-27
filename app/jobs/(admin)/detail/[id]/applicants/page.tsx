'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useJobsStore } from '@/store/jobs';
import type { Applicant } from '@/types/jobs';
import noCandidates from '@/assets/images/no-candidates.svg';
import Image from 'next/image';

const columns: GridColDef[] = [
  {
    field: 'full_name',
    headerName: 'Full Name',
    width: 180,
    cellClassName: 'sticky-column',
    headerClassName: 'sticky-column-header',
  },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'birth', headerName: 'Birth', width: 150 },
  { field: 'domicile', headerName: 'Domicile', width: 150 },
  { field: 'gender', headerName: 'Gender', width: 120 },
  { field: 'linkedin', headerName: 'LinkedIn', width: 250 },
];
const paginationModel = { page: 0, pageSize: 5 };

// Format date to "DD Month YYYY"
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export default function JobDetail() {
  const params = useParams();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState({
    id: 0,
    job_name: '',
    created_date: '',
  });

  useEffect(() => {
    if (params.id) {
      const timeoutId = setTimeout(() => {
        const jobId = Number(params.id);
        const jobDetail = useJobsStore.getState().getJobById(jobId);

        if (jobDetail) {
          setDetail({
            id: jobDetail?.id || 0,
            job_name: jobDetail?.job_name || '',
            created_date: jobDetail?.created_date || '',
          });
          const formattedApplicants = jobDetail.applicants.map(
            (applicant: Applicant) => ({
              id: applicant.id,
              full_name: applicant.full_name,
              email: applicant.email,
              phone: `${applicant.country_code}${applicant.phone}`,
              birth: formatDate(applicant.birth),
              domicile: applicant.domicile,
              gender: applicant.gender,
              linkedin: applicant.linkedin,
            })
          );
          setRows(formattedApplicants);
        }
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [params.id]);

  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography fontSize="18px" fontWeight={700} mb={2}>
            {detail?.job_name}
          </Typography>
          <Box
            sx={{
              gap: '8px',
              p: '24px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
            }}
          >
            {rows.length > 0 ? (
              <Paper sx={{ width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                  loading={loading}
                  sx={{
                    border: 0,
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#a14545ff',
                      fontWeight: 600,
                    },
                  }}
                />
              </Paper>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: 1,
                }}
              >
                <Image src={noCandidates} alt="No Canndidates" width={285} />
                <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                  No candidates found
                </Typography>
                <Typography variant="subtitle2">
                  Share your job vacancies so that more candidates will apply.
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
