import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@mui/material';
import theme from '../utils/theme';
import { AuthProvider } from '@/context/auth';
import AppSnackbar from '@/components/AppSnackBar';

export const metadata: Metadata = {
  title: 'Hiring App',
  description: 'Hiring App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppSnackbar />
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
