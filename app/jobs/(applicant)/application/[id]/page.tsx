'use client';

import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import AppButton from '@/components/AppButton';
import AppInputForm from '@/components/AppInputForm';
import AvatarProfile from '@/assets/images/avatar-photo.png';
import { ArrowLeft, Upload } from 'react-feather';
import { useState, useEffect } from 'react';
import AppDatePicker from '@/components/AppDatePicker';
import dayjs from 'dayjs';
import AppRadioGroup from '@/components/AppRadio';
import AppAutocomplete from '@/components/AppAutoComplete';
import provinces from '@/database/provinces.json';
import AppPhoneInput from '@/components/AppInputSelect';
import { useJobsStore } from '@/store/jobs';
import { useParams, useRouter } from 'next/navigation';
import { Jobs, Applicant } from '@/types/jobs';
import { useStatusStore } from '@/store/status';
import AppLoading from '@/components/AppLoading';

export default function Application() {
  const params = useParams();
  const router = useRouter();
  const { setStatus } = useStatusStore();
  const jobId = Number(params.id);
  const { getJobById, jobs, updateJob } = useJobsStore();
  const [job, setJob] = useState<Jobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: '',
    photo_profile: '',
    birth: '',
    gender: '',
    domicile: '',
    phone: '',
    email: '',
    country_code: '',
    linkedin: '',
  });
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [province, setProvince] = useState<{ id: string; name: string } | null>(
    null
  );
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+62');
  const countries = [
    { code: '🇮🇩', label: 'Indonesia', phone: '+62' },
    { code: '🇲🇾', label: 'Malaysia', phone: '+60' },
    { code: '🇸🇬', label: 'Singapore', phone: '+65' },
  ];

  // Get job details from store
  useEffect(() => {
    let isMounted = true;

    const fetchJob = () => {
      // Wait for jobs to be loaded from store
      if (jobs.length === 0) {
        // Jobs not yet initialized, wait for next render
        return;
      }

      const jobDetail = getJobById(jobId);

      if (isMounted) {
        if (jobDetail) {
          setJob(jobDetail);
          setLoading(false);
        } else {
          // If job not found after jobs are loaded, redirect back
          setLoading(false);
          router.push('/jobs');
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [jobId, getJobById, router, jobs]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!job) return;

    // Check if already applied by checking email in applicants array
    const alreadyApplied = job.applicants.some(
      (applicant) => applicant.email === form.email
    );

    if (alreadyApplied) {
      setStatus({ status: 'error', message: 'You have already applied' });
      return;
    }

    // Generate unique ID for the new applicant
    const newApplicantId =
      job.applicants.length > 0
        ? Math.max(...job.applicants.map((a) => a.id)) + 1
        : 1;

    // Create new applicant object
    const newApplicant: Applicant = {
      id: newApplicantId,
      full_name: form.full_name,
      email: form.email,
      phone: phone,
      country_code: countryCode,
      domicile: province?.name || form.domicile,
      gender: form.gender,
      linkedin: form.linkedin,
      birth: date ? date.format('YYYY-MM-DD') : form.birth,
    };

    // Add applicant to job's applicants array
    const updatedApplicants = [...job.applicants, newApplicant];

    // Update job in store
    updateJob(jobId, { applicants: updatedApplicants });

    // Show success message and redirect
    setStatus({ status: 'success', message: '🎉 Your application was sent!' });
    setTimeout(() => {
      router.push('/jobs');
    }, 1000);
  };

  if (loading || !job) {
    return <AppLoading />;
  }

  return (
    <Box sx={{ backgroundColor: '#fff' }} width={700} mx="auto">
      <form onSubmit={handleSubmit}>
        <Box
          p="40px"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            borderWidth: '1px',
            borderColor: 'divider',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton color="info" onClick={() => router.back()}>
                <ArrowLeft />
              </IconButton>
              <Typography variant="h6" fontWeight={700}>
                Apply {job.job_name} at {job.company}
              </Typography>
            </Box>
            <Typography variant="subtitle2">
              ℹ️ This field required to fill
            </Typography>
          </Box>
          <Box
            sx={{
              px: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
            }}
          >
            <span className="text-red-500 font-bold">* Required</span>

            {/* Conditionally render Photo Profile */}
            {job.profile_configuration.photo_profile !== 'off' && (
              <Box display="flex" gap={2} flexDirection="column">
                <Typography variant="subtitle1" fontWeight={700}>
                  Photo Profile{' '}
                  {job.profile_configuration.photo_profile === 'mandatory' && (
                    <span className="text-red-500">*</span>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Upload a professional photo for your application
                </Typography>
                <Avatar
                  src={AvatarProfile.src}
                  sx={{ width: 128, height: 128 }}
                />
                <Button
                  variant="outlined"
                  color="info"
                  sx={{
                    width: 'fit-content',
                    borderRadius: '8px',
                    boxShadow: '0px 1px 2px 0px #0000001F',
                    borderColor: 'divider',
                    textTransform: 'none',
                    p: '4px 16px',
                    fontWeight: 700,
                  }}
                >
                  <Upload
                    size={14}
                    fontWeight={700}
                    style={{ marginRight: 4 }}
                  />{' '}
                  Take a Picture
                </Button>
              </Box>
            )}

            {/* Conditionally render Full Name */}
            {job.profile_configuration.full_name !== 'off' && (
              <AppInputForm
                name="full_name"
                label="Full name"
                value={form.full_name}
                onChange={handleChange}
                {...(job.profile_configuration.full_name === 'mandatory' && {
                  required: true,
                  starRequired: true,
                })}
                placeholder="Enter your full name"
                helperText="Please provide your full legal name"
              />
            )}

            {/* Conditionally render Date of Birth */}
            {job.profile_configuration.birth !== 'off' && (
              <AppDatePicker
                label="Date of Birth"
                name="birth"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                {...(job.profile_configuration.birth === 'mandatory' && {
                  starRequired: true,
                })}
                disableFuture
                placeholder="30 January 2001"
              />
            )}

            {/* Conditionally render Gender */}
            {job.profile_configuration.gender !== 'off' && (
              <AppRadioGroup
                label="Pronoun (gender)"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                row
                {...(job.profile_configuration.gender === 'mandatory' && {
                  starRequired: true,
                })}
                options={[
                  { label: 'She/her (Female)', value: 'female' },
                  { label: 'He/him (Male)', value: 'male' },
                ]}
              />
            )}

            {/* Conditionally render Domicile/Province */}
            {job.profile_configuration.domicile !== 'off' && (
              <AppAutocomplete
                label="Province"
                name="province"
                placeholder="Select a province"
                options={provinces}
                value={province}
                onChange={setProvince}
                getOptionLabel={(option) => option.name}
                {...(job.profile_configuration.domicile === 'mandatory' && {
                  starRequired: true,
                })}
              />
            )}

            {/* Conditionally render Phone Number */}
            {job.profile_configuration.phone !== 'off' && (
              <AppPhoneInput
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                countryCode={countryCode}
                onCountryCodeChange={setCountryCode}
                options={countries}
                {...(job.profile_configuration.phone === 'mandatory' && {
                  starRequired: true,
                })}
              />
            )}

            {/* Conditionally render Email */}
            {job.profile_configuration.email !== 'off' && (
              <AppInputForm
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                {...(job.profile_configuration.email === 'mandatory' && {
                  required: true,
                  starRequired: true,
                })}
                placeholder="Enter your email address"
                helperText="We'll use this email to contact you"
              />
            )}

            {/* Conditionally render LinkedIn */}
            {job.profile_configuration.linkedin !== 'off' && (
              <AppInputForm
                name="linkedin"
                label="Link Linkedin"
                type="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                {...(job.profile_configuration.linkedin === 'mandatory' && {
                  required: true,
                  starRequired: true,
                })}
                placeholder="https://linkedin.com/in/username"
                helperText="Provide your LinkedIn profile URL"
              />
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: '24px 40px',
          }}
        >
          <AppButton
            label="Submit"
            // disabled={disabledSubmit}
            type="submit"
          />
        </Box>
        {/* </Box> */}
      </form>
    </Box>
  );
}
