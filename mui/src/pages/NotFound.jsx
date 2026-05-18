import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function NotFound() {
  const { pick } = useLanguage();

  return (
    <Box sx={{ minHeight: '70dvh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
      <Box>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {pick('Page not found', '页面未找到')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {pick('The requested page does not exist.', '你访问的页面不存在。')}
        </Typography>
        <Button component={RouterLink} to="/" variant="contained">
          {pick('Return home', '返回首页')}
        </Button>
      </Box>
    </Box>
  );
}
