import { Box, Button } from '@mui/material';
import { ChevronRight } from 'react-feather';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Box
            key={index}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Button
              component={item.href ? Link : 'button'}
              href={item.href}
              variant={isLast ? 'contained' : 'outlined'}
              color="info"
              disableElevation
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '12px',
                px: 2,
                py: 0.5,
                fontSize: '14px',
                ...(isLast && {
                  backgroundColor: 'grey.100',
                  color: 'text.primary',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: 'grey.200',
                    boxShadow: 'none',
                  },
                }),
              }}
            >
              {item.label}
            </Button>

            {!isLast && <ChevronRight fontSize={20} />}
          </Box>
        );
      })}
    </Box>
  );
}
