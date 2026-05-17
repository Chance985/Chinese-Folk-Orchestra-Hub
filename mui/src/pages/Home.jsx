import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { brandTokens } from '../theme/AppTheme.jsx';

const highlights = [
  {
    title: 'Member Showcase',
    text: 'Browse demo musician profiles by instrument section, role, tags, and performance focus.',
    icon: <GroupRoundedIcon />,
    path: '/members',
  },
  {
    title: 'Join Us',
    text: 'Submit an interview request with instrument interest, experience, and portfolio link.',
    icon: <PersonAddAlt1RoundedIcon />,
    path: '/join',
  },
  {
    title: 'Events',
    text: 'View public performances, recruitment interviews, rehearsals, and club activities.',
    icon: <CalendarMonthRoundedIcon />,
    path: '/events',
  },
  {
    title: 'Member Login',
    text: 'Members and admins can access internal announcements, profiles, and management tools.',
    icon: <LoginRoundedIcon />,
    path: '/login',
  },
];

export default function Home() {
  return (
    <Box>
      <Box
        sx={{
          minHeight: { xs: 'auto', md: 'min(760px, calc(100dvh - 132px))' },
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 7, md: 9 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '0.92fr 1.08fr' },
              gap: { xs: 5, lg: 7 },
              alignItems: 'center',
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: 42, sm: 56, md: 72 },
                    maxWidth: 760,
                    color: brandTokens.ink,
                  }}
                >
                  Chinese Folk Orchestra Hub
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ mt: 2, color: 'primary.main', fontWeight: 800 }}
                >
                  民乐团宣传与团内成员管理系统
                </Typography>
              </Box>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ maxWidth: 680, lineHeight: 1.72, fontWeight: 500 }}
              >
                A dynamic public website and internal management platform for a Chinese
                Folk Orchestra club, combining member showcase, recruitment applications,
                event publishing, announcements, and role-based administration.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  component={RouterLink}
                  to="/join"
                  variant="contained"
                  size="large"
                  startIcon={<PersonAddAlt1RoundedIcon />}
                >
                  Apply to Join
                </Button>
                <Button
                  component={RouterLink}
                  to="/members"
                  variant="outlined"
                  size="large"
                  startIcon={<GroupRoundedIcon />}
                >
                  View Members
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['Erhu', 'Pipa', 'Guzheng', 'Dizi', 'Yangqin', 'Zhongruan', 'Percussion'].map(
                  (item) => (
                    <Chip key={item} label={item} variant="outlined" color="secondary" />
                  ),
                )}
              </Stack>
            </Stack>

            <Box
              sx={{
                position: 'relative',
                minHeight: { xs: 320, sm: 420, lg: 560 },
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 28px 72px rgba(54, 20, 16, 0.24)',
                border: '1px solid rgba(255, 248, 235, 0.44)',
              }}
            >
              <Box
                component="img"
                src="/assets/orchestra-hero.png"
                alt="Chinese folk orchestra rehearsal with traditional instruments"
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: { xs: 320, sm: 420, lg: 560 },
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  bottom: 24,
                  p: 2.5,
                  borderRadius: 2,
                  color: '#fff8eb',
                  bgcolor: 'rgba(32, 23, 24, 0.72)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Typography variant="h6">Traditional sound, modern coordination</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,248,235,0.82)' }}>
                  Built for public promotion, auditions, rehearsals, and admin workflows.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ maxWidth: 820, mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            A club website with real workflows
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
            The system presents the orchestra to visitors while giving members and
            administrators a structured dashboard for daily club operations.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          {highlights.map((item) => (
            <Card
              key={item.title}
              component={RouterLink}
              to={item.path}
              sx={{
                color: 'inherit',
                transition: 'transform 180ms ease, box-shadow 180ms ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 18px 48px rgba(54, 20, 16, 0.14)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {item.text}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
