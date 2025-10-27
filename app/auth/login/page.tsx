'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Typography, Card, Box, Link } from '@mui/material';
import Image from 'next/image';
import AppButton from '@/components/AppButton';
import AppInputForm from '@/components/AppInputForm';
import AppAlert from '@/components/AppAlert';
import logoRakamin from '@/assets/images/logo-rakamin.svg';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setAlert({ type: 'error', message: 'Invalid credentials' });
    } else {
      setAlert({ type: 'success', message: 'Login successful!' });
      router.push('/jobs');
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-[500px]"
      noValidate
    >
      <Image
        src={logoRakamin}
        alt="Logo Rakamin"
        width={150}
        height={50}
        priority
      />

      <Card
        sx={{
          padding: {
            xs: '24px',
            md: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          },
        }}
      >
        <Typography fontWeight={700} variant="h6">
          Login to Rakamin
        </Typography>

        {alert && <AppAlert severity={alert.type} message={alert.message} />}

        <AppInputForm
          label="Email"
          name="email"
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          required
          helperText="Required"
        />
        <AppInputForm
          label="Password"
          name="password"
          type="password"
          placeholder="********"
          value={formData.password}
          onChange={handleChange}
          required
          helperText="Required"
          inputAdornment="password"
        />
        <Box sx={{ marginLeft: 'auto' }}>
          <Link color="primary" href="#">
            Forgot Password?
          </Link>
        </Box>
        <AppButton
          label="Login"
          color="secondary"
          loading={loading}
          disabled={loading}
          type="submit"
        />
      </Card>
    </form>
  );
}
