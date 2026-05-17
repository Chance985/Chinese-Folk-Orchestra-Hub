import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { brandTokens } from '../theme/AppTheme.jsx';

export default function BrandMark({ compact = false }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, minWidth: 0 }}>
      <Box
        aria-hidden="true"
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          color: '#fff8eb',
          background: `linear-gradient(135deg, ${brandTokens.cinnabar}, ${brandTokens.gold})`,
          boxShadow: '0 8px 20px rgba(111, 17, 22, 0.22)',
          flex: '0 0 auto',
        }}
      >
        <MusicNoteRoundedIcon fontSize="small" />
      </Box>
      {!compact && (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, lineHeight: 1.05, color: brandTokens.ink }}
          >
            Chinese Folk Orchestra Hub
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', lineHeight: 1, display: 'block' }}
          >
            民乐团宣传与团内成员管理系统
          </Typography>
        </Box>
      )}
    </Box>
  );
}
