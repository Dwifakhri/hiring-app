'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Divider,
  List,
  ListItemButton,
  Grid,
} from '@mui/material';
import CompanyDefault from '@/assets/images/default-company-avatar.jpg';

import { MapPin, Briefcase } from 'react-feather';
import AppButton from '@/components/AppButton';
import AppLoading from '@/components/AppLoading';
import { Jobs } from '@/types/jobs';
import { useJobsStore } from '@/store/jobs';
import Image from 'next/image';
import noJobs from '@/assets/images/no-jobs.svg';

export default function ApplicantJobs() {
  const router = useRouter();
  const [jobList, setJobList] = useState<Jobs[]>([]);
  const [selectedJob, setSelectedJob] = useState<Jobs | null>(null);
  const [loading, setLoading] = useState(true);
  const { jobs, getJobById } = useJobsStore();

  useEffect(() => {
    setTimeout(() => {
      // Filter for active jobs only
      const activeJobs = jobs.filter((job) => job.status === 'active');
      setJobList(activeJobs);
      setLoading(false);
    }, 1000);
  }, [jobs]);

  // Get full job details when a job is selected
  useEffect(() => {
    if (selectedJob) {
      const fullJobDetail = getJobById(selectedJob.id);
      setTimeout(() => {
        if (fullJobDetail) {
          setSelectedJob(fullJobDetail);
        }
      }, 500);
    }
  }, [selectedJob?.id, getJobById]);

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`;
  };

  const handleApplyJob = (jobId: number) => {
    // Navigate to application page
    router.push(`/jobs/application/${jobId}`);
  };

  return (
    <Grid container spacing={2}>
      <>
        {loading ? (
          <AppLoading />
        ) : jobList.length > 0 ? (
          <>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'auto',
                  p: 2,
                  height: { md: 'calc(100vh - 124px)' },
                }}
              >
                <List>
                  {jobList.map((job) => (
                    <ListItemButton
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      selected={selectedJob?.id === job.id}
                      sx={{
                        p: 0,
                        mb: 1,
                        backgroundColor: '#ffff',
                        ...(selectedJob?.id === job.id
                          ? {
                              border: '2px solid',
                              borderColor: 'primary.main',
                              bgcolor: 'primary.500',
                            }
                          : {
                              border: '1px solid',
                              borderColor: 'divider',
                            }),

                        borderRadius: '8px',
                        '&.Mui-selected': {
                          '&:focus': {
                            border: '2px solid',
                            borderColor: 'primary.main',
                          },
                          '&:hover': {
                            bgcolor: 'primary.500',
                          },
                        },
                      }}
                    >
                      <Box
                        color="info"
                        display="flex"
                        flexDirection="column"
                        gap={1}
                        sx={{
                          p: 2,
                          width: '100%',
                          boxShadow: 'none',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar
                            src={CompanyDefault.src}
                            sx={{
                              width: 48,
                              height: 48,
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                            variant="square"
                          />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {job.job_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight={400}
                              color="text.secondary"
                            >
                              {job.company}
                            </Typography>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            pt: 1,
                            borderBottom: '2px dotted ',
                            borderColor: 'divider',
                            textAlign: 'center',
                          }}
                        ></Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <MapPin size={12} />
                          <Typography variant="body2" color="info.100">
                            {job.location}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Briefcase size={12} />
                          <Typography variant="body2" color="info.100">
                            {formatSalary(
                              job.salary_range.min,
                              job.salary_range.max
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, md: 8 }}
              overflow={'auto'}
              sx={{ height: { md: 'calc(100vh - 124px)' } }}
            >
              <Box
                sx={{
                  flex: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'auto',
                  p: 3,
                }}
              >
                {selectedJob ? (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 3,
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Avatar
                          src={CompanyDefault.src}
                          sx={{
                            width: 64,
                            height: 64,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: 'divider',
                          }}
                          variant="square"
                        />
                        <Box display="flex" flexDirection="column">
                          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                            <Chip
                              sx={{
                                borderRadius: '4px',
                                p: '2px 8px',
                              }}
                              label={selectedJob.job_type}
                              color="success"
                              size="small"
                            />
                          </Box>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {selectedJob.job_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                              {selectedJob.company}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <AppButton
                        fullWidth={false}
                        label="Apply"
                        color="secondary"
                        onClick={() => handleApplyJob(selectedJob.id)}
                      />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Job Details Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ mb: 2 }}
                      >
                        Job Details
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1.5,
                        }}
                      >
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <MapPin size={16} />
                          <Typography variant="body2">
                            <strong>Location:</strong> {selectedJob.location}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Briefcase size={16} />
                          <Typography variant="body2">
                            <strong>Salary:</strong>{' '}
                            {formatSalary(
                              selectedJob.salary_range.min,
                              selectedJob.salary_range.max
                            )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Type:</strong>
                          </Typography>
                          <Chip
                            label={selectedJob.job_type}
                            size="small"
                            color="success"
                            sx={{ height: 20 }}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Department:</strong>{' '}
                            {selectedJob.department}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {/* Job Description Section */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ mb: 2 }}
                      >
                        Job Description
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        lineHeight="24px"
                      >
                        {selectedJob.job_description}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Select a job to view details
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </>
        ) : (
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
              Please wait for the next batch of openings.
            </Typography>
          </Box>
        )}
      </>
    </Grid>
  );
}
