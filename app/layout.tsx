import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@mui/material';
import theme from '../utils/theme';
import { AuthProvider } from '@/context/auth';
import AppSnackbar from '@/components/AppSnackBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://hiring-app-sooty.vercel.app'),

  title: {
    default: 'Hiring App',
    template: '%s | Hiring App',
  },

  description: 'Hiring App – find and manage job opportunities easily.',
  applicationName: 'Hiring App',
  category: 'Business',

  openGraph: {
    title: 'Hiring App',
    description: 'Hiring App – find and manage job opportunities easily.',
    type: 'website',
    url: '/',
    images: [
      {
        url: '/thumbnailhirings.png',
        width: 800,
        height: 600,
        alt: 'Hiring App',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Hiring App',
    description: 'Hiring App – find and manage job opportunities easily.',
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
    'Hiring App',
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
