import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@mui/material';
import theme from '../utils/theme';
import { AuthProvider } from '@/context/auth';
import AppSnackbar from '@/components/AppSnackBar';

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
});

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
      <body className={nunito.className}>
        <AuthProvider>
          <AppSnackbar />
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
