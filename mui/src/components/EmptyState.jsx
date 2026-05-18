import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function EmptyState({ title, message }) {
  const { pick } = useLanguage();
  const resolvedTitle = title || pick('No records yet', '暂无记录');
  const resolvedMessage = message || pick('New content will appear here.', '新的内容会显示在这里。');

  return (
    <Box
      sx={{
        minHeight: 220,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: '8px',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        p: 4,
        bgcolor: 'rgba(255, 250, 240, 0.62)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.34)',
      }}
    >
      <Box>
        <Inventory2RoundedIcon color="secondary" sx={{ fontSize: 42, mb: 1 }} />
        <Typography variant="h6">{resolvedTitle}</Typography>
        <Typography color="text.secondary">{resolvedMessage}</Typography>
      </Box>
    </Box>
  );
}
