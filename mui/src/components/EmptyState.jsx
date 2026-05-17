import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';

export default function EmptyState({ title = 'No records yet', message = 'New content will appear here.' }) {
  return (
    <Box
      sx={{
        minHeight: 220,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 4,
        bgcolor: 'rgba(255, 250, 240, 0.55)',
      }}
    >
      <Box>
        <Inventory2RoundedIcon color="secondary" sx={{ fontSize: 44, mb: 1 }} />
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{message}</Typography>
      </Box>
    </Box>
  );
}
