import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../i18n/LanguageContext.jsx';

function SkeletonLine({ width = '100%' }) {
  return (
    <Box
      sx={{
        width,
        height: 12,
        borderRadius: 999,
        bgcolor: 'rgba(155, 28, 32, 0.08)',
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.56), transparent)',
          animation: 'cfShimmer 1400ms cubic-bezier(0.16, 1, 0.3, 1) infinite',
        },
      }}
    />
  );
}

export default function LoadingState({ label }) {
  const { pick } = useLanguage();
  const resolvedLabel = label || pick('Loading content', '正在加载内容');

  return (
    <Box
      sx={{
        minHeight: 260,
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 4 },
      }}
    >
      <Stack
        spacing={2}
        sx={{
          width: 'min(560px, 100%)',
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '8px',
          bgcolor: 'rgba(255, 250, 240, 0.62)',
        }}
      >
        <Typography color="text.secondary" sx={{ fontWeight: 700 }}>
          {resolvedLabel}
        </Typography>
        <SkeletonLine width="82%" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="64%" />
      </Stack>
    </Box>
  );
}
