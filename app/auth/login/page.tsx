'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Typography, Card, Box, Link } from '@mui/material';
import Image from 'next/image';
import AppButton from '@/components/AppButton';
import AppInputForm from '@/components/AppInputForm';
import AppAlert from '@/components/AppAlert';
import logoHi from '@/assets/images/logo-r.svg';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { loginSchema, type loginSchemaType } from '@/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Login() {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit: SubmitHandler<loginSchemaType> = async (data) => {
    setAlert(null);

    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setAlert({ type: 'error', message: 'Invalid credentials' });
    } else {
      setAlert({ type: 'success', message: 'Login successful!' });
      router.push('/jobs');
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
          Login to Ohirings
        </Typography>

        <Typography variant="body2" mt={-1}>
          Don&apos;t have an account?{' '}
          <Link color="primary" href="/auth/register">
            Register
          </Link>
        </Typography>

        {alert && <AppAlert severity={alert.type} message={alert.message} />}

        {/* Email Field */}
        <AppInputForm
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
          starRequired
          autoFocus
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

        <Box sx={{ marginLeft: 'auto' }}>
          <Link color="primary" href="#">
            Forgot Password?
          </Link>
        </Box>

        <AppButton
          label="Login"
          color="secondary"
          loading={isSubmitting}
          disabled={isSubmitting}
          type="submit"
        />
      </Card>
    </form>
  );
}
