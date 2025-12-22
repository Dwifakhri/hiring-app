/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Typography, Card, Link } from '@mui/material';
import Image from 'next/image';
import AppButton from '@/components/AppButton';
import AppInputForm from '@/components/AppInputForm';
import AppAlert from '@/components/AppAlert';
import logoHi from '@/assets/images/logo-r.svg';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { registerSchema, type registerSchemaType } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/axios';
import { getErrorResponse } from '@/utils/getErrorResponse';

export default function Register() {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<registerSchemaType> = async (data) => {
    setAlert(null);
    try {
      const res = await api.post('/auth/register', data);
      setAlert({ type: 'success', message: res.data.message });
      router.push('/auth/login');
    } catch (error: any) {
      setAlert({ type: 'error', message: getErrorResponse(error) });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-[500px]"
      noValidate
    >
      <Image
        src={logoHi}
        alt="Logo Ohirings"
        width={150}
        height={50}
        priority
      />

      <Card
        sx={{
          padding: { xs: '24px', md: '40px' },
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Typography fontWeight={700} variant="h6">
          Register to Ohirings
        </Typography>

        <Typography variant="body2" mt={-1}>
          Already have an account?{' '}
          <Link color="primary" href="/auth/login">
            Login
          </Link>
        </Typography>
        {alert && <AppAlert severity={alert.type} message={alert.message} />}
        {/* Email Field */}
        <AppInputForm
          label="Full Name"
          type="text"
          placeholder="Full name"
          required
          starRequired
          error={!!errors.full_name}
          helperText={errors.full_name?.message}
          {...register('full_name')}
        />
        <AppInputForm
          label="Email"
          type="email"
          placeholder="your@mail.com"
          required
          starRequired
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email')}
        />
        {/* Password Field */}
        <AppInputForm
          label="Password"
          type="password"
          placeholder="********"
          required
          starRequired
          inputAdornment="password"
          error={!!errors.password}
          helperText={errors.password?.message}
          {...register('password')}
        />
        {/* Password Field */}
        <AppInputForm
          label="Confirm Password"
          type="password"
          placeholder="********"
          required
          starRequired
          inputAdornment="password"
          error={!!errors.confirm_password}
          helperText={errors.confirm_password?.message}
          {...register('confirm_password')}
        />
        <AppButton
          label="Register"
          color="secondary"
          loading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
        />
      </Card>
    </form>
  );
}
