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

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Members', path: '/members' },
  { label: 'Events', path: '/events' },
  { label: 'Join Us', path: '/join' },
  { label: 'Resources', path: '/resources' },
];

function NavButton({ item, onClick }) {
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
      {item.label}
    </Button>
  );
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          top: 0,
          backdropFilter: 'blur(18px)',
          bgcolor: 'rgba(251, 242, 227, 0.82)',
          borderBottom: '1px solid',
          borderColor: 'divider',
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
                <NavButton key={item.path} item={item} />
              ))}
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button
                startIcon={<LoginRoundedIcon />}
                variant="outlined"
                onClick={() => navigate(user ? '/dashboard' : '/login')}
              >
                {user ? 'Dashboard' : 'Login'}
              </Button>
              <Button
                startIcon={<PersonAddAlt1RoundedIcon />}
                variant="contained"
                onClick={() => navigate('/join')}
              >
                Apply
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
        <Box sx={{ p: 2, bgcolor: 'background.default' }}>
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
              {item.label}
            </MenuItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setOpen(false);
              navigate(user ? '/dashboard' : '/login');
            }}
          >
            {user ? 'Dashboard' : 'Login'}
          </Button>
        </Box>
      </Drawer>

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}
