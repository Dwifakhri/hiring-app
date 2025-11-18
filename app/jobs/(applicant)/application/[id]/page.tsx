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
import { useStatusStore } from '@/store/status';
import AppLoading from '@/components/AppLoading';
import dynamic from 'next/dynamic';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getErrorResponse } from '@/utils/getErrorResponse';

const ModalProfileCam = dynamic(
  () => import('@/app/jobs/components/applicant/ModalProfileCam'),
  { ssr: false }
);

interface ApplyJobFormInputs {
  full_name?: string;
  photo_profile?: string;
  birth?: string;
  gender?: string;
  domicile?: string;
  phone?: string;
  email?: string;
  country_code?: string;
  linkedin?: string;
}

export default function Application() {
  const params = useParams();
  const router = useRouter();
  const { setStatus } = useStatusStore();
  const jobId = params.id?.toString() || '';
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const { fetchJobById, jobDetail, isLoading, isLoadingAction, applyForJob } =
    useJobsStore();
  const [photoProfile, setPhotoProfile] = useState<string>('');
  const countries = [
    { code: '🇮🇩', label: 'Indonesia', phone: '+62' },
    { code: '🇲🇾', label: 'Malaysia', phone: '+60' },
    { code: '🇸🇬', label: 'Singapore', phone: '+65' },
  ];

  // Create dynamic validation schema based on job configuration
  const validationSchema = useMemo(() => {
    if (!jobDetail) return z.object();

    const config = jobDetail?.profile_config;
    const schema: Record<string, z.ZodTypeAny> = {};
    if (config?.full_name !== 'off') {
      schema.full_name =
        config?.full_name === 'mandatory'
          ? z.string().nonempty('Full name is required')
          : z.string();
    }

    if (config?.photo_profile !== 'off') {
      schema.photo_profile =
        config?.photo_profile === 'mandatory'
          ? z.string().nonempty('Photo profile is required')
          : z.string();
    }

    if (config?.birth !== 'off') {
      schema.birth =
        config?.birth === 'mandatory'
          ? z.string().nonempty('Birth date is required')
          : z.string();
    }

    if (config?.gender !== 'off') {
      schema.gender =
        config?.gender === 'mandatory'
          ? z.string().nonempty('Gender is required')
          : z.string();
    }

    if (config?.domicile !== 'off') {
      schema.domicile =
        config?.domicile === 'mandatory'
          ? z.string().nonempty('Domicile is required')
          : z.string();
    }

    if (config?.phone !== 'off') {
      schema.phone =
        config?.phone === 'mandatory'
          ? z.string().nonempty('Phone number is required')
          : z.string();
      schema.country_code =
        config?.phone === 'mandatory'
          ? z.string().nonempty('Country code is required')
          : z.string();
    }

    if (config?.email !== 'off') {
      schema.email =
        config?.email === 'mandatory'
          ? z
              .string()
              .nonempty('Email is required')
              .email('Invalid email format')
          : z.string().email('Invalid email format');
    }

    if (config?.linkedin !== 'off') {
      schema.linkedin =
        config?.linkedin === 'mandatory'
          ? z
              .string()
              .nonempty('LinkedIn is required')
              .url('LinkedIn must be a valid URL')
          : z.string().url('LinkedIn must be a valid URL');
    }

    return z.object(schema);
  }, [jobDetail]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyJobFormInputs>({
    // @ts-expect-error - z resolver type inference issue with optional fields
    resolver: zodResolver(validationSchema),
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

  useEffect(() => {
    fetchJobById(jobId);
  }, []);

  const handlePhotoProfile = (photo: string) => {
    setPhotoProfile(photo);
    setValue('photo_profile', photo, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<ApplyJobFormInputs> = async (data) => {
    try {
      const newApplicant = {
        full_name: data.full_name?.trim() || '',
        email: data.email?.trim() || '',
        phone: data.phone?.trim() || '',
        country_code: data.country_code || '',
        domicile: data.domicile?.trim() || '',
        gender: data.gender || '',
        linkedin: data.linkedin?.trim() || '',
        birth: data.birth || '',
        photo_profile: data.photo_profile || '',
      };

      await applyForJob(newApplicant, jobId);

      setTimeout(() => {
        router.push('/jobs/application/success');
      }, 500);
    } catch (error) {
      const message = getErrorResponse(error);
      setStatus({
        status: 'error',
        message: message,
      });
    }
  };

  return (
    <>
      <Box sx={{ backgroundColor: '#fff' }} width={700} mx="auto">
        {isLoading ? (
          <AppLoading />
        ) : (
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
                    Apply {jobDetail?.job_name} at {jobDetail?.company}
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
                {jobDetail?.profile_config?.photo_profile !== 'off' && (
                  <Box display="flex" gap={1} flexDirection="column">
                    <Typography variant="subtitle1" fontWeight={700}>
                      Photo Profile{' '}
                      {jobDetail?.profile_config?.photo_profile ===
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
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
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
                {jobDetail?.profile_config?.full_name !== 'off' && (
                  <AppInputForm
                    label="Full name"
                    placeholder="Enter your full name"
                    {...(jobDetail?.profile_config?.full_name ===
                      'mandatory' && {
                      required: true,
                      starRequired: true,
                    })}
                    error={!!errors.full_name}
                    helperText={errors.full_name?.message}
                    {...register('full_name')}
                  />
                )}

                {/* Conditionally render Date of Birth */}
                {jobDetail?.profile_config?.birth !== 'off' && (
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
                        {...(jobDetail?.profile_config?.birth ===
                          'mandatory' && {
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
                {jobDetail?.profile_config?.gender !== 'off' && (
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <AppRadioGroup
                        label="Pronoun (gender)"
                        name="gender"
                        value={field.value || ''}
                        onChange={field.onChange}
                        row
                        {...(jobDetail?.profile_config?.gender ===
                          'mandatory' && {
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
                {jobDetail?.profile_config?.domicile !== 'off' && (
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
                        {...(jobDetail?.profile_config?.domicile ===
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
                {jobDetail?.profile_config?.phone !== 'off' && (
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
                            value={phoneField.value || ''}
                            onChange={phoneField.onChange}
                            countryCode={countryCodeField.value || '+62'}
                            onCountryCodeChange={countryCodeField.onChange}
                            options={countries}
                            {...(jobDetail?.profile_config?.phone ===
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
                {jobDetail?.profile_config?.email !== 'off' && (
                  <AppInputForm
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    {...(jobDetail?.profile_config?.email === 'mandatory' && {
                      required: true,
                      starRequired: true,
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    {...register('email')}
                  />
                )}

                {/* Conditionally render LinkedIn */}
                {jobDetail?.profile_config?.linkedin !== 'off' && (
                  <AppInputForm
                    label="Link Linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    {...(jobDetail?.profile_config?.linkedin ===
                      'mandatory' && {
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
                label={`${
                  jobDetail?.has_applied ? 'Already Applied' : 'Apply'
                }`}
                loading={isSubmitting || isLoadingAction}
                disabled={
                  isSubmitting || isLoadingAction || jobDetail?.has_applied
                }
                type="submit"
              />
            </Box>
          </form>
        )}
      </Box>
      <ModalProfileCam
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
        onSubmitPhoto={handlePhotoProfile}
      />
    </>
  );
}
