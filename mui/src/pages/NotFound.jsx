import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
      <Box>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Page not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The requested page does not exist.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          Return home
        </Button>
      </Box>
    </Box>
  );
}
