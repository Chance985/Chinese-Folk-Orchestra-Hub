import { useState } from 'react';
import { Link as RouterLink, NavLink, Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import BrandMark from './BrandMark.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const navItems = [
  { key: 'home', path: '/' },
  { key: 'about', path: '/about' },
  { key: 'members', path: '/members' },
  { key: 'events', path: '/events' },
  { key: 'join', path: '/join' },
  { key: 'resources', path: '/resources' },
];

const navLabels = {
  en: {
    home: 'Home',
    about: 'About',
    members: 'Members',
    events: 'Events',
    join: 'Join Us',
    resources: 'Resources',
    dashboard: 'Dashboard',
    login: 'Login',
    apply: 'Apply',
    language: '中文',
  },
  zh: {
    home: '首页',
    about: '关于',
    members: '成员',
    events: '活动',
    join: '加入我们',
    resources: '资源',
    dashboard: '控制台',
    login: '登录',
    apply: '申请加入',
    language: 'EN',
  },
};

function NavButton({ item, label, onClick }) {
  return (
    <Button
      component={NavLink}
      to={item.path}
      onClick={onClick}
      size="small"
      sx={{
        color: 'text.primary',
        '&.active': {
          color: 'primary.main',
          bgcolor: 'rgba(155, 28, 32, 0.08)',
        },
      }}
    >
      {label}
    </Button>
  );
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const labels = navLabels[language];

  return (
    <Box>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          top: 0,
          backdropFilter: 'blur(18px)',
          bgcolor: 'rgba(255, 248, 235, 0.86)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.36)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 76, gap: 2 }}>
            <Box component={RouterLink} to="/" sx={{ flexGrow: { xs: 1, md: 0 } }}>
              <BrandMark />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 3, flexGrow: 1 }}>
              {navItems.map((item) => (
                <NavButton key={item.path} item={item} label={labels[item.key]} />
              ))}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button variant="text" onClick={toggleLanguage}>
                {labels.language}
              </Button>
              <Button
                startIcon={<LoginRoundedIcon />}
                variant="outlined"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
              >
                {user ? labels.dashboard : labels.login}
              </Button>
              <Button
                startIcon={<PersonAddAlt1RoundedIcon />}
                variant="contained"
                onClick={() => navigate('/join')}
              >
                {labels.apply}
              </Button>
            </Box>
            <IconButton
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="top" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <BrandMark />
            <IconButton aria-label="Close navigation" onClick={() => setOpen(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          {navItems.map((item) => (
            <MenuItem
              key={item.path}
              component={RouterLink}
              to={item.path}
              onClick={() => setOpen(false)}
            >
              {labels[item.key]}
            </MenuItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <Button fullWidth variant="text" onClick={toggleLanguage}>
            {labels.language}
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setOpen(false);
              navigate(user ? '/dashboard' : '/login');
            }}
          >
            {user ? labels.dashboard : labels.login}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={() => {
              setOpen(false);
              navigate('/join');
            }}
          >
            {labels.apply}
          </Button>
        </Box>
      </Drawer>

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}
