import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { brandTokens } from '../theme/AppTheme.jsx';

export default function BrandMark({ compact = false }) {
  const { isChinese } = useLanguage();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, minWidth: 0 }}>
      <Box
        aria-hidden="true"
        sx={{
          width: 38,
          height: 38,
          borderRadius: '6px 14px 6px 14px',
          display: 'grid',
          placeItems: 'center',
          color: '#fff8eb',
          background: brandTokens.cinnabar,
          border: '1px solid rgba(255, 248, 235, 0.28)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.16), 0 8px 20px rgba(111, 17, 22, 0.18)',
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
            {isChinese ? '民乐团宣传与成员管理系统' : 'Orchestra promotion and member management'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
