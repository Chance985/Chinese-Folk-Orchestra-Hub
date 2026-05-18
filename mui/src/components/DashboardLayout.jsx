import { Link as RouterLink, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import SourceRoundedIcon from '@mui/icons-material/SourceRounded';
import BrandMark from './BrandMark.jsx';
import { useAuth } from '../auth/AuthContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const drawerWidth = 268;

const adminItems = [
  { key: 'dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { key: 'members', path: '/dashboard/members', icon: <GroupRoundedIcon /> },
  { key: 'applications', path: '/dashboard/applications', icon: <AssignmentRoundedIcon /> },
  { key: 'announcements', path: '/dashboard/announcements', icon: <CampaignRoundedIcon /> },
  { key: 'events', path: '/dashboard/events', icon: <EventRoundedIcon /> },
  { key: 'resources', path: '/dashboard/resources', icon: <SourceRoundedIcon /> },
];

const memberItems = [
  { key: 'dashboard', path: '/dashboard', icon: <DashboardRoundedIcon /> },
  { key: 'profile', path: '/dashboard/profile', icon: <AccountCircleRoundedIcon /> },
  { key: 'announcements', path: '/dashboard/announcements', icon: <CampaignRoundedIcon /> },
  { key: 'events', path: '/dashboard/events', icon: <EventRoundedIcon /> },
];

const labels = {
  en: {
    dashboard: 'Dashboard',
    members: 'Members',
    applications: 'Applications',
    announcements: 'Announcements',
    events: 'Events',
    resources: 'Resources',
    profile: 'My Profile',
    publicSite: 'Public site',
    mobileTitle: 'Orchestra Hub',
    openNavigation: 'Open dashboard navigation',
    logout: 'Log out',
    roles: { admin: 'admin', member: 'member' },
  },
  zh: {
    dashboard: '控制台',
    members: '成员',
    applications: '申请',
    announcements: '公告',
    events: '活动',
    resources: '资源',
    profile: '我的资料',
    publicSite: '公开网站',
    mobileTitle: '民乐团枢纽',
    openNavigation: '打开控制台导航',
    logout: '退出登录',
    roles: { admin: '管理员', member: '成员' },
  },
};

function SidebarContent({ onNavigate }) {
  const { user, logout, isAdmin } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const items = isAdmin ? adminItems : memberItems;
  const t = labels[language];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box component={RouterLink} to="/dashboard" sx={{ p: 2.2, display: 'block' }}>
        <BrandMark />
      </Box>
      <Divider />
      <List sx={{ p: 1.2, flex: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={onNavigate}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': {
                bgcolor: 'rgba(155, 28, 32, 0.10)',
                color: 'primary.main',
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={t[item.key]} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 38, height: 38 }}>
          {user?.username?.[0]?.toUpperCase()}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 750 }}>
            {user?.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t.roles[user?.role] || user?.role}
          </Typography>
        </Box>
        <IconButton
          aria-label={t.logout}
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default function DashboardLayout() {
  const theme = useTheme();
  const { language } = useLanguage();
  const t = labels[language];
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          display: { md: 'none' },
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton aria-label={t.openNavigation} onClick={() => setOpen(true)}>
            <MenuRoundedIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            {t.mobileTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop || open}
        onClose={() => setOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: { md: drawerWidth },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: { xs: 8, md: 0 },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 3, lg: 4 },
            py: { xs: 2, md: 3 },
            maxWidth: 1500,
            mx: 'auto',
          }}
        >
          <Box sx={{ mb: 2, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
            <ButtonLikeLink />
          </Box>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

function ButtonLikeLink() {
  const { language } = useLanguage();
  const t = labels[language];

  return (
    <ListItemButton
      component={RouterLink}
      to="/"
      sx={{
        width: 'auto',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'rgba(255, 250, 240, 0.65)',
      }}
    >
      <ListItemIcon sx={{ minWidth: 34 }}>
        <PublicRoundedIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={t.publicSite} />
    </ListItemButton>
  );
}
