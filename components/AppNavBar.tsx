'use client';
import * as React from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import avatar from '@/assets/images/avatar.jpg';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useAuth } from '@/context/auth';
import { usePathname } from 'next/navigation';
import AppBreadcrumb from './AppBreadcrumb';

export default function AppNavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { user } = useAuth();
  const pathname = usePathname();
  const listLabel: Record<string, string> = {
    '/jobs/detail/id/applicants': 'Application List',
    '/jobs': 'Jobs List',
  };

  const labelPage = React.useMemo(() => {
    return listLabel[pathname] || '';
  }, [pathname]);

  // Generate breadcrumb items for nested routes
  const breadcrumbItems = React.useMemo(() => {
    // Check if route is nested (has more than 2 segments)
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length <= 1) {
      return [];
    }

    // Check if we're on a detail/applicants page
    const isApplicantsPage = pathname.includes('/applicants');

    if (isApplicantsPage) {
      return [
        {
          label: 'Job list',
          href: '/jobs',
        },
        {
          label: 'Manage Candidate',
        },
      ];
    }

    return [];
  }, [pathname]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fff' }}
    >
      <Container maxWidth={`${user?.role === 'admin' ? 'xl' : 'lg'}`}>
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: { xs: 1, sm: 0 },
          }}
        >
          {breadcrumbItems.length > 0 ? (
            <AppBreadcrumb items={breadcrumbItems} />
          ) : (
            <Typography
              variant="h6"
              noWrap
              sx={{
                display: 'flex',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              {labelPage}
            </Typography>
          )}

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                src={avatar.src}
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: { xs: 'auto', sm: '200px' },
                    maxWidth: '100%',
                    left: { xs: 0, sm: 'auto' },
                    right: 20,
                    borderRadius: { xs: 0, sm: 1 },
                    mt: { xs: 0, sm: '45px' },
                    backgroundColor: 'background.paper',
                  },
                },
              }}
            >
              {/* Profile section */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Avatar alt="Remy Sharp" src={avatar.src} />
                <Box>
                  <Typography fontWeight={600}>{user?.full_name}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="capitalize"
                  >
                    {user?.role}
                  </Typography>
                </Box>
              </Box>

              {/* Menu items */}
              <MenuItem
                sx={{
                  justifyContent: 'start',
                  textAlign: 'center',
                  py: 1.5,
                }}
              >
                <Link href="/jobs">Jobs</Link>
              </MenuItem>
              <MenuItem
                onClick={() => signOut()}
                sx={{
                  justifyContent: 'start',
                  textAlign: 'center',
                  py: 1.5,
                }}
              >
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
