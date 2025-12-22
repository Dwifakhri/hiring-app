import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@mui/material';
import theme from '../utils/theme';
import { AuthProvider } from '@/context/auth';
import AppSnackbar from '@/components/AppSnackBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://hiring-app-sooty.vercel.app'),

  title: {
    default: 'Ohirings',
    template: '%s | Ohirings',
  },

  description: 'Ohirings – find and manage job opportunities easily.',
  applicationName: 'Ohirings',
  category: 'Business',

  openGraph: {
    title: 'Ohirings',
    description: 'Ohirings – find and manage job opportunities easily.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/thumbnailhirings.png',
        width: 800,
        height: 600,
        alt: 'Ohirings',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ohirings',
    description: 'Ohirings – find and manage job opportunities easily.',
    images: ['/thumbnailhirings.png'],
  },

  authors: [
    {
      name: 'Dwi Fakhri Chusaini',
      url: 'https://dwifakhri.vercel.app/',
    },
  ],
  creator: 'Dwi Fakhri Chusaini',
  publisher: 'Dwi Fakhri Chusaini',

  alternates: {
    canonical: '/',
  },

  keywords: [
    'Hiring Management',
    'Ohirings',
    'Job Management',
    'Job Listings',
    'Recruitment',
    'Job Search',
    'Career Opportunities',
  ],

  robots: {
    index: true,
    follow: true,
  },
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
