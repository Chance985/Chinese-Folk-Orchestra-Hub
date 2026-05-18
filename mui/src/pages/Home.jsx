import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { brandTokens } from '../theme/AppTheme.jsx';

const icons = {
  members: <GroupRoundedIcon />,
  join: <PersonAddAlt1RoundedIcon />,
  events: <CalendarMonthRoundedIcon />,
  login: <LoginRoundedIcon />,
};

const copy = {
  en: {
    overline: 'Orchestra promotion and member management',
    title: 'Chinese Folk Orchestra Hub',
    summary:
      'A public orchestra site and internal dashboard for applications, events, announcements, member profiles, and admin review.',
    primaryCta: 'Apply to Join',
    secondaryCta: 'View Events',
    audienceTitle: 'One site, two audiences',
    audienceText:
      'Visitors get a clear public front door. Members and admins get the operating surface behind it.',
    operations: [
      ['Public site', 'Home, about, members, events, join form'],
      ['Member space', 'Announcements, event visibility, linked profile view'],
      ['Admin review', 'Applications, members, events, resources, announcements'],
    ],
    workflowTitle: 'Built around rehearsal work',
    workflowText:
      'The visible pages stay simple, while the dashboard handles the recurring tasks: auditions, announcements, events, member edits, and resource records.',
    workflows: [
      {
        title: 'Member Showcase',
        text: 'Search profiles by instrument, section, role, and rehearsal focus.',
        icon: icons.members,
        path: '/members',
      },
      {
        title: 'Application Desk',
        text: 'Collect audition requests with availability and portfolio links.',
        icon: icons.join,
        path: '/join',
      },
      {
        title: 'Event Board',
        text: 'Publish performances, rehearsals, interviews, and club activities.',
        icon: icons.events,
        path: '/events',
      },
      {
        title: 'Role Dashboard',
        text: 'Route members and admins into the tools they actually need.',
        icon: icons.login,
        path: '/login',
      },
    ],
    instruments: ['Erhu', 'Pipa', 'Guzheng', 'Dizi', 'Yangqin', 'Zhongruan', 'Percussion'],
    finalTitle: 'Ready for the next audition cycle.',
    finalText: 'Submit an application or review the demo member directory.',
    finalPrimary: 'Apply',
    finalSecondary: 'Members',
    heroAlt: 'Chinese folk orchestra rehearsal with traditional instruments',
  },
  zh: {
    overline: '民乐团宣传与成员管理',
    title: '民乐团枢纽',
    summary: '面向访客的民乐团宣传网站，也是处理报名、活动、公告、成员资料和管理员审核的内部管理平台。',
    primaryCta: '申请加入',
    secondaryCta: '查看活动',
    audienceTitle: '一个站点，服务两类用户',
    audienceText: '访客可以快速了解乐团；成员和管理员可以进入后台处理日常事务。',
    operations: [
      ['公开网站', '首页、关于、成员展示、活动列表、加入申请'],
      ['成员空间', '公告、成员可见活动、关联个人资料'],
      ['管理员审核', '报名申请、成员、活动、资源和公告管理'],
    ],
    workflowTitle: '围绕排练与招新流程设计',
    workflowText: '公开页面保持清晰克制，后台负责反复出现的工作：招新、公告、活动、成员编辑和资源记录。',
    workflows: [
      {
        title: '成员展示',
        text: '按乐器、声部、角色和排练方向检索成员资料。',
        icon: icons.members,
        path: '/members',
      },
      {
        title: '报名处理',
        text: '收集面试时间、意向乐器和作品链接。',
        icon: icons.join,
        path: '/join',
      },
      {
        title: '活动发布',
        text: '发布演出、排练、招新面试和社团活动。',
        icon: icons.events,
        path: '/events',
      },
      {
        title: '角色后台',
        text: '让成员和管理员进入各自需要的管理界面。',
        icon: icons.login,
        path: '/login',
      },
    ],
    instruments: ['二胡', '琵琶', '古筝', '笛子', '扬琴', '中阮', '打击乐'],
    finalTitle: '为下一轮招新做好准备。',
    finalText: '提交加入申请，或查看演示成员目录。',
    finalPrimary: '申请',
    finalSecondary: '成员',
    heroAlt: '民乐团排练现场与传统乐器',
  },
};

export default function Home() {
  const { language } = useLanguage();
  const t = copy[language];

  return (
    <Box>
      <Box
        component="section"
        sx={{
          minHeight: { xs: 'calc(100svh - 132px)', md: 'calc(100svh - 118px)' },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: '#fff8eb',
          backgroundColor: '#2a1716',
        }}
      >
        <Box
          component="img"
          src="/assets/orchestra-hero.png"
          alt={t.heroAlt}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: { xs: '58% center', md: 'center' },
            filter: 'saturate(0.92) contrast(1.04)',
            transform: 'scale(1.03)',
            animation: 'cfImageDrift 9000ms cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(32,23,24,0.92) 0%, rgba(32,23,24,0.74) 36%, rgba(32,23,24,0.18) 72%), linear-gradient(180deg, rgba(32,23,24,0.28), rgba(32,23,24,0.5))',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 5, md: 7 } }}>
          <Stack
            spacing={2.4}
            sx={{
              width: { xs: '100%', md: 'min(620px, 52vw)' },
              animation: 'cfFadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,248,235,0.74)',
                fontWeight: 800,
                letterSpacing: '0.08em',
              }}
            >
              {t.overline}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 42, sm: 56, md: 72 },
                color: '#fff8eb',
                textShadow: '0 18px 42px rgba(0,0,0,0.28)',
              }}
            >
              {t.title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,248,235,0.82)',
                lineHeight: 1.7,
                maxWidth: 560,
                fontWeight: 500,
              }}
            >
              {t.summary}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                to="/join"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  bgcolor: '#fff8eb',
                  color: brandTokens.cinnabar,
                  '&:hover': { bgcolor: '#f4e2c5' },
                }}
              >
                {t.primaryCta}
              </Button>
              <Button
                component={RouterLink}
                to="/events"
                variant="outlined"
                size="large"
                startIcon={<CalendarMonthRoundedIcon />}
                sx={{
                  color: '#fff8eb',
                  borderColor: 'rgba(255,248,235,0.56)',
                  '&:hover': {
                    borderColor: '#fff8eb',
                    bgcolor: 'rgba(255,248,235,0.1)',
                  },
                }}
              >
                {t.secondaryCta}
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 9 } }}>
        <Box
          component="section"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.85fr 1.15fr' },
            gap: { xs: 4, lg: 8 },
            alignItems: 'start',
          }}
        >
          <Box sx={{ position: { lg: 'sticky' }, top: { lg: 112 } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 48 }, mb: 1.5 }}>
              {t.audienceTitle}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.76, maxWidth: 560 }}>
              {t.audienceText}
            </Typography>
          </Box>
          <Box>
            {t.operations.map(([label, text], index) => (
              <Box
                key={label}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' },
                  gap: { xs: 0.75, sm: 3 },
                  py: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  animation: `cfFadeUp 560ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms both`,
                }}
              >
                <Typography sx={{ fontWeight: 850, color: 'primary.main' }}>{label}</Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box
          component="section"
          sx={{
            mt: { xs: 7, md: 10 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.18fr 0.82fr' },
            gap: { xs: 4, lg: 7 },
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
              borderTop: '1px solid',
              borderLeft: { md: '1px solid' },
              borderColor: 'divider',
            }}
          >
            {t.workflows.map((item, index) => (
              <Box
                key={item.title}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'inherit',
                  minHeight: 210,
                  p: { xs: 2.5, md: 3.5 },
                  borderRight: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  transition:
                    'background-color 260ms cubic-bezier(0.16, 1, 0.3, 1), transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
                  animation: `cfFadeUp 560ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms both`,
                  '&:hover': {
                    bgcolor: 'rgba(155, 28, 32, 0.055)',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <Stack spacing={2} sx={{ height: '100%' }}>
                  <Box sx={{ color: 'primary.main' }}>{item.icon}</Box>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.72 }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>

          <Box>
            <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 48 }, mb: 2 }}>
              {t.workflowTitle}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.76, mb: 3 }}>
              {t.workflowText}
            </Typography>
            <Stack spacing={1.2}>
              {t.instruments.map((item, index) => (
                <Box
                  key={item}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography sx={{ fontWeight: 760 }}>{item}</Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: index % 2 ? brandTokens.gold : brandTokens.cinnabar,
                      animation: 'cfBreath 2400ms cubic-bezier(0.16, 1, 0.3, 1) infinite',
                      animationDelay: `${index * 120}ms`,
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>

      <Box
        component="section"
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: brandTokens.ink,
          color: '#fff8eb',
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            py: { xs: 6, md: 8 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1, color: '#fff8eb' }}>
              {t.finalTitle}
            </Typography>
            <Typography sx={{ color: 'rgba(255,248,235,0.72)', lineHeight: 1.7 }}>
              {t.finalText}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={RouterLink}
              to="/join"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                bgcolor: '#fff8eb',
                color: brandTokens.ink,
                '&:hover': { bgcolor: '#f4e2c5' },
              }}
            >
              {t.finalPrimary}
            </Button>
            <Button
              component={RouterLink}
              to="/members"
              variant="outlined"
              size="large"
              sx={{
                color: '#fff8eb',
                borderColor: 'rgba(255,248,235,0.48)',
                '&:hover': {
                  borderColor: '#fff8eb',
                  bgcolor: 'rgba(255,248,235,0.08)',
                },
              }}
            >
              {t.finalSecondary}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
