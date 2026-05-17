import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SectionHeader({ title, subtitle, align = 'left' }) {
  return (
    <Box sx={{ textAlign: align, maxWidth: align === 'center' ? 780 : 860, mb: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
