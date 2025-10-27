import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material';
import highlightJob from '@/assets/images/highlight-job.jpg';
import AppButton from '@/components/AppButton';
import ModalJob from './ModalJob';
import AppInputForm from '@/components/AppInputForm';
import JobList from './JobList';
import Image from 'next/image';
import noJobs from '@/assets/images/no-jobs.svg';
import type { Jobs } from '@/types/jobs';
import { useJobsStore } from '@/store/jobs';
import AppLoading from '@/components/AppLoading';

export default function AdminJob() {
  const [query, setQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [jobList, setJobList] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);
  const { jobs } = useJobsStore();

  useEffect(() => {
    setTimeout(() => {
      setJobList(jobs);
      setLoading(false);
    }, 1000);
  }, [jobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const filteredJobs = jobs.filter((job) => {
      return (
        job.job_name.toLowerCase().includes(query.toLowerCase()) ||
        job.job_type.toLowerCase().includes(query.toLowerCase()) ||
        job.job_description.toLowerCase().includes(query.toLowerCase())
      );
    });

    setTimeout(() => {
      setJobList(filteredJobs);
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        height="100%"
      >
        <Grid size={{ xs: 12, md: 'grow' }}>
          <Box
            sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <form onSubmit={handleSearch}>
              <AppInputForm
                name="search"
                placeholder="Search by job details"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                inputAdornment="search"
              />
            </form>
            <Box sx={{ flex: 1, minHeight: 400, position: 'relative' }}>
              {loading ? (
                <AppLoading />
              ) : jobList.length ? (
                <JobList jobs={jobList} />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}
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
                    <Image src={noJobs} alt="No Jobs" width={285} />
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 2 }}>
                      No job openings available
                    </Typography>
                    <Typography variant="subtitle2">
                      Create a job opening now and start the candidate process.
                    </Typography>
                    <AppButton
                      type="button"
                      onClick={() => setOpenModal(true)}
                      label="Create anew job"
                      color="secondary"
                      fullWidth={false}
                    />
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, md: 'auto' }} sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              maxWidth: { xs: '100%', md: 300 },
              maxHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${highlightJob.src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: 4,
            }}
          >
            <Box sx={{ width: '100%', color: 'white' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Recruit the best candidates
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 3 }}>
                Create jobs, invite, and hire with ease
              </Typography>
              <AppButton
                label="Create a new job"
                type="button"
                onClick={() => setOpenModal(true)}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <ModalJob open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
