import { CircularProgress, Box, Typography } from '@mui/material';

export default function AppLoading({
  text,
  size = 40,
}: {
  text?: string;
  size?: number;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        position: 'absolute',
        flexDirection: 'column',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {text && <Typography variant="subtitle1">{text}</Typography>}
      <CircularProgress size={size} />
    </Box>
  );
}
