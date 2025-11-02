'use client';

import {
  Avatar,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Typography,
} from '@mui/material';
import AppButton from '@/components/AppButton';
import AppInputForm from '@/components/AppInputForm';
import AvatarProfile from '@/assets/images/avatar-photo.png';
import { AlertTriangle, ArrowLeft, Upload } from 'react-feather';
import { useState, useEffect, useMemo } from 'react';
import AppDatePicker from '@/components/AppDatePicker';
import dayjs from 'dayjs';
import AppRadioGroup from '@/components/AppRadio';
import AppAutocomplete from '@/components/AppAutoComplete';
import provinces from '@/database/provinces.json';
import AppInputSelect from '@/components/AppInputSelect';
import { useJobsStore } from '@/store/jobs';
import { useParams, useRouter } from 'next/navigation';
import { Jobs, Applicant } from '@/types/jobs';
import { useStatusStore } from '@/store/status';
import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const ModalProfileCam = dynamic(
  () => import('@/app/jobs/components/applicant/ModalProfileCam'),
  { ssr: false }
);

interface ApplyJobFormInputs {
  full_name: string;
  photo_profile: string;
  birth: string;
  gender: string;
  domicile: string;
  phone: string;
  email: string;
  country_code: string;
  linkedin: string;
}

export default function Application() {
  const params = useParams();
  const router = useRouter();
  const { setStatus } = useStatusStore();
  const jobId = Number(params.id);
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const { getJobById, jobs, updateJob } = useJobsStore();
  const [job, setJob] = useState<Jobs | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoProfile, setPhotoProfile] = useState<string>('');
  const countries = [
    { code: '🇮🇩', label: 'Indonesia', phone: '+62' },
    { code: '🇲🇾', label: 'Malaysia', phone: '+60' },
    { code: '🇸🇬', label: 'Singapore', phone: '+65' },
  ];

  // Create dynamic validation schema based on job configuration
  const validationSchema = useMemo(() => {
    if (!job) return yup.object().shape({});

    const config = job.profile_configuration;
    const schema: Record<string, yup.StringSchema> = {};

    if (config.full_name !== 'off') {
      schema.full_name =
        config.full_name === 'mandatory'
          ? yup.string().required('Full name is required')
          : yup.string();
    }

    if (config.photo_profile !== 'off') {
      schema.photo_profile =
        config.photo_profile === 'mandatory'
          ? yup.string().required('Photo profile is required')
          : yup.string();
    }

    if (config.birth !== 'off') {
      schema.birth =
        config.birth === 'mandatory'
          ? yup.string().required('Birth date is required')
          : yup.string();
    }

    if (config.gender !== 'off') {
      schema.gender =
        config.gender === 'mandatory'
          ? yup.string().required('Gender is required')
          : yup.string();
    }

    if (config.domicile !== 'off') {
      schema.domicile =
        config.domicile === 'mandatory'
          ? yup.string().required('Domicile is required')
          : yup.string();
    }

    if (config.phone !== 'off') {
      schema.phone =
        config.phone === 'mandatory'
          ? yup.string().required('Phone number is required')
          : yup.string();
      schema.country_code =
        config.phone === 'mandatory'
          ? yup.string().required('Country code is required')
          : yup.string();
    }

    if (config.email !== 'off') {
      schema.email =
        config.email === 'mandatory'
          ? yup
              .string()
              .required('Email is required')
              .email('Invalid email format')
          : yup.string().email('Invalid email format');
    }

    if (config.linkedin !== 'off') {
      schema.linkedin =
        config.linkedin === 'mandatory'
          ? yup
              .string()
              .required('LinkedIn is required')
              .url('LinkedIn must be a valid URL')
          : yup.string().url('LinkedIn must be a valid URL');
    }

    return yup.object().shape(schema);
  }, [job]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobFormInputs>({
    // @ts-expect-error - yup resolver type inference issue with optional fields
    resolver: yupResolver(validationSchema),
    mode: 'onTouched',
    defaultValues: {
      full_name: '',
      photo_profile: '',
      birth: '',
      gender: '',
      domicile: '',
      phone: '',
      email: '',
      country_code: '+62',
      linkedin: '',
    },
  });

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

  const handlePhotoProfile = (photo: string) => {
    setPhotoProfile(photo);
    setValue('photo_profile', photo, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ApplyJobFormInputs> = async (data) => {
    if (!job) return;

    setLoading(true);
    try {
      // Check if already applied by checking email in applicants array
      const alreadyApplied = job.applicants.some(
        (applicant) => applicant.email === data.email
      );

      if (alreadyApplied) {
        setStatus({ status: 'error', message: 'You have already applied' });
        setLoading(false);
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
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        country_code: data.country_code,
        domicile: data.domicile.trim(),
        gender: data.gender,
        linkedin: data.linkedin.trim() || '',
        birth: data.birth || '',
        photo_profile: data.photo_profile || '',
      };

      // Update job in store
      const updatedApplicants = [...job.applicants, newApplicant];
      updateJob(jobId, { applicants: updatedApplicants });

      // Success feedback + redirect
      setTimeout(() => {
        setStatus({
          status: 'success',
          message: '🎉 Your application was sent!',
        });
        setLoading(false);
        router.push('/jobs');
      }, 1000);
    } catch (error) {
      setStatus({
        status: 'error',
        message: 'Something went wrong. Please try again.',
      });
      setLoading(false);
    }
  };

  if (loading || !job) {
    return <AppLoading />;
  }

  return (
    <>
      <Box sx={{ backgroundColor: '#fff' }} width={700} mx="auto">
        {/* @ts-expect-error - react-hook-form type inference issue with yup resolver */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                <Box display="flex" gap={1} flexDirection="column">
                  <Typography variant="subtitle1" fontWeight={700}>
                    Photo Profile{' '}
                    {job.profile_configuration.photo_profile ===
                      'mandatory' && <span className="text-red-500">*</span>}
                  </Typography>
                  {photoProfile ? (
                    <Avatar
                      variant="rounded"
                      src={photoProfile}
                      sx={{ width: 128, height: 128 }}
                    />
                  ) : (
                    <Avatar
                      src={AvatarProfile.src}
                      sx={{ width: 128, height: 128 }}
                    />
                  )}
                  <Button
                    onClick={() => setOpenModalProfile(true)}
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
                  {errors.photo_profile?.message && (
                    <FormHelperText
                      id="filled-weight-helper-text"
                      component="div"
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        <AlertTriangle size={14} color={'#d32f2f'} />
                        <Typography
                          variant="body2"
                          color="error"
                          component="span"
                        >
                          {errors.photo_profile?.message}
                        </Typography>
                      </Box>
                    </FormHelperText>
                  )}
                </Box>
              )}

              {/* Conditionally render Full Name */}
              {job.profile_configuration.full_name !== 'off' && (
                <AppInputForm
                  label="Full name"
                  placeholder="Enter your full name"
                  {...(job.profile_configuration.full_name === 'mandatory' && {
                    required: true,
                    starRequired: true,
                  })}
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                  {...register('full_name')}
                />
              )}

              {/* Conditionally render Date of Birth */}
              {job.profile_configuration.birth !== 'off' && (
                <Controller
                  name="birth"
                  control={control}
                  render={({ field }) => (
                    <AppDatePicker
                      label="Date of Birth"
                      name="birth"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newDate) =>
                        field.onChange(
                          newDate ? newDate.format('YYYY-MM-DD') : ''
                        )
                      }
                      {...(job.profile_configuration.birth === 'mandatory' && {
                        starRequired: true,
                      })}
                      disableFuture
                      placeholder="30 January 2001"
                      error={!!errors.birth}
                      helperText={errors.birth?.message}
                    />
                  )}
                />
              )}

              {/* Conditionally render Gender */}
              {job.profile_configuration.gender !== 'off' && (
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <AppRadioGroup
                      label="Pronoun (gender)"
                      name="gender"
                      value={field.value}
                      onChange={field.onChange}
                      row
                      {...(job.profile_configuration.gender === 'mandatory' && {
                        starRequired: true,
                      })}
                      options={[
                        { label: 'She/her (Female)', value: 'female' },
                        { label: 'He/him (Male)', value: 'male' },
                      ]}
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                    />
                  )}
                />
              )}

              {/* Conditionally render Domicile/Province */}
              {job.profile_configuration.domicile !== 'off' && (
                <Controller
                  name="domicile"
                  control={control}
                  render={({ field }) => (
                    <AppAutocomplete
                      label="Province"
                      name="domicile"
                      placeholder="Choose your domicile"
                      options={provinces}
                      value={
                        provinces.find((p) => p.name === field.value) || null
                      }
                      onChange={(newValue) =>
                        field.onChange(newValue?.name || '')
                      }
                      getOptionLabel={(option) => option.name}
                      {...(job.profile_configuration.domicile ===
                        'mandatory' && {
                        starRequired: true,
                      })}
                      error={!!errors.domicile}
                      helperText={errors.domicile?.message}
                    />
                  )}
                />
              )}

              {/* Conditionally render Phone Number */}
              {job.profile_configuration.phone !== 'off' && (
                <Controller
                  name="phone"
                  control={control}
                  render={({ field: phoneField }) => (
                    <Controller
                      name="country_code"
                      control={control}
                      render={({ field: countryCodeField }) => (
                        <AppInputSelect
                          label="Phone Number"
                          value={phoneField.value}
                          onChange={phoneField.onChange}
                          countryCode={countryCodeField.value}
                          onCountryCodeChange={countryCodeField.onChange}
                          options={countries}
                          {...(job.profile_configuration.phone ===
                            'mandatory' && {
                            required: true,
                            starRequired: true,
                          })}
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                        />
                      )}
                    />
                  )}
                />
              )}

              {/* Conditionally render Email */}
              {job.profile_configuration.email !== 'off' && (
                <AppInputForm
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  {...(job.profile_configuration.email === 'mandatory' && {
                    required: true,
                    starRequired: true,
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register('email')}
                />
              )}

              {/* Conditionally render LinkedIn */}
              {job.profile_configuration.linkedin !== 'off' && (
                <AppInputForm
                  label="Link Linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  {...(job.profile_configuration.linkedin === 'mandatory' && {
                    required: true,
                    starRequired: true,
                  })}
                  error={!!errors.linkedin}
                  helperText={errors.linkedin?.message}
                  {...register('linkedin')}
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
              loading={isSubmitting}
              disabled={isSubmitting}
              type="submit"
            />
          </Box>
        </form>
      </Box>
      <ModalProfileCam
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
        onSubmitPhoto={handlePhotoProfile}
      />
    </>
  );
}
