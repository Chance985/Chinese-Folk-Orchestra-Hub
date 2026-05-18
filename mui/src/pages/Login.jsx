import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import BrandMark from '../components/BrandMark.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Login() {
  const { pick } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!username || !password) {
      setError(pick('Username and password are required.', '请输入用户名和密码。'));
      return;
    }
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100dvh - 76px)',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '0.9fr 1.1fr' },
            gap: 4,
            alignItems: 'stretch',
          }}
        >
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Stack spacing={3}>
                <BrandMark />
                <Box>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {pick('Member and Admin Login', '成员与管理员登录')}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                    {pick(
                      'Role-based authentication protects the internal dashboard. Administrators can manage core records; members can view announcements, rehearsals, and their profile.',
                      '基于角色的登录保护内部控制台。管理员可以管理核心记录；成员可以查看公告、排练和个人资料。',
                    )}
                  </Typography>
                </Box>
                <Alert severity="info">
                  {pick(
                    'Test usernames are documented in the README. Passwords are not displayed in the public website UI.',
                    '测试账号记录在 README 中。公开网站界面不会显示密码。',
                  )}
                </Alert>
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.2}>
                  <LockRoundedIcon color="primary" sx={{ fontSize: 44 }} />
                  <Typography variant="h4" component="h1">
                    {pick('Sign in', '登录')}
                  </Typography>
                  <TextField
                    label={pick('Username', '用户名')}
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    autoComplete="username"
                    required
                    autoFocus
                  />
                  <TextField
                    label={pick('Password', '密码')}
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  {error && <Alert severity="error">{error}</Alert>}
                  <Button type="submit" variant="contained" size="large" disabled={submitting}>
                    {submitting ? pick('Signing in...', '登录中...') : pick('Sign in', '登录')}
                  </Button>
                  <Button component={RouterLink} to="/join" variant="text">
                    {pick('Apply to join the orchestra', '申请加入乐团')}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
