'use client';

import { useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { useJobsStore } from '@/store/jobs';
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

export default function JobDetail() {
  const params = useParams();
  const { jobDetail, isLoading, fetchJobById } = useJobsStore();
  useEffect(() => {
    if (typeof params.id === 'string') {
      fetchJobById(params.id);
    }
  }, [params.id]);

  return (
    <Box
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {isLoading ? (
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
            {jobDetail?.job_name}
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
            {jobDetail?.applicants?.length ? (
              <Paper sx={{ width: '100%' }}>
                <DataGrid
                  rows={jobDetail?.applicants}
                  columns={columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
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
                <Image
                  src={noCandidates}
                  alt="No Canndidates"
                  width={285}
                  loading="lazy"
                />
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
