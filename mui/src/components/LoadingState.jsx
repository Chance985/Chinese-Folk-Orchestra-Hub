import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function LoadingState({ label = 'Loading content' }) {
  return (
    <Box
      sx={{
        minHeight: 220,
        display: 'grid',
        placeItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress color="secondary" />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  );
}
