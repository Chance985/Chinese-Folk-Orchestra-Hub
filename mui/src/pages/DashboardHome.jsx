import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatDateTime } from '../utils/format.js';

const statIcons = {
  members: <GroupRoundedIcon />,
  pendingApplications: <AssignmentRoundedIcon />,
  upcomingEvents: <EventRoundedIcon />,
  announcements: <CampaignRoundedIcon />,
};

const eventTypeLabelsZh = {
  Performance: '演出',
  Rehearsal: '排练',
  Recruitment: '招新',
  Workshop: '工作坊',
  'Club Activity': '社团活动',
};

function StatCard({ label, value, icon, helper }) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="text.secondary" variant="body2" sx={{ mb: 0.8 }}>
              {label}
            </Typography>
            <Typography variant="h3">{value}</Typography>
          </Box>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {helper}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DashboardHome() {
  const { language, pick } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const requests = [
          apiRequest('/dashboard/summary'),
          apiRequest('/events'),
          apiRequest('/announcements'),
        ];
        if (isAdmin) requests.push(apiRequest('/applications'));
        const [summaryData, eventsData, announcementData, applicationData] =
          await Promise.all(requests);
        setSummary(summaryData.summary);
        setEvents(eventsData.items || []);
        setAnnouncements(announcementData.items || []);
        setApplications(applicationData?.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  if (loading) return <LoadingState label={pick('Loading dashboard', '正在加载控制台')} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  const stats = [
    {
      key: 'members',
      label: pick('Total members', '成员总数'),
      value: summary?.members ?? 0,
      helper: pick('Showcase records in the member profile database', '成员资料库中的展示记录'),
    },
    {
      key: 'pendingApplications',
      label: pick('Pending applications', '待处理申请'),
      value: summary?.pendingApplications ?? 0,
      helper: isAdmin ? pick('Applications waiting for review', '等待审核的申请') : pick('Visible to admins only', '仅管理员可见'),
    },
    {
      key: 'upcomingEvents',
      label: pick('Upcoming events', '即将开始的活动'),
      value: summary?.upcomingEvents ?? 0,
      helper: pick('Public and member-visible events', '公开和成员可见活动'),
    },
    {
      key: 'announcements',
      label: pick('Announcements', '公告'),
      value: summary?.announcements ?? 0,
      helper: pick('Public, member, and admin notices', '公开、成员和管理员公告'),
    },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h3" component="h1">
          {isAdmin ? pick('Admin Dashboard', '管理员控制台') : pick('Member Dashboard', '成员控制台')}
        </Typography>
        <Typography color="text.secondary">
          {pick('Signed in as', '当前登录')} {user.username} / {pick(user.role, user.role === 'admin' ? '管理员' : '成员')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {stats.map((stat) => (
          <StatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            helper={stat.helper}
            icon={statIcons[stat.key]}
          />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {pick('Upcoming events', '即将开始的活动')}
            </Typography>
            {events.length ? (
              <Stack spacing={2}>
                {events.slice(0, 4).map((event) => (
                  <Box key={event.id}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                      <Typography sx={{ fontWeight: 800 }}>{event.title}</Typography>
                      <Chip size="small" label={language === 'zh' ? eventTypeLabelsZh[event.type] || event.type : event.type} color="secondary" />
                      <StatusChip value={event.visibility} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {formatDateTime(event.event_date)} · {event.location}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState
                title={pick('No events', '暂无活动')}
                message={pick('Events created by admins will appear here.', '管理员创建的活动会显示在这里。')}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {pick('Announcements', '公告')}
            </Typography>
            {announcements.length ? (
              <Stack spacing={2}>
                {announcements.slice(0, 4).map((announcement) => (
                  <Box key={announcement.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography sx={{ fontWeight: 800 }}>{announcement.title}</Typography>
                      <StatusChip value={announcement.visible_to} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {announcement.content}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <EmptyState
                title={pick('No announcements', '暂无公告')}
                message={pick('Internal notices will appear here.', '内部通知会显示在这里。')}
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {isAdmin && (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {pick('Recent applications', '最近申请')}
            </Typography>
            {applications.length ? (
              <Stack spacing={1.5}>
                {applications.slice(0, 5).map((application) => (
                  <Stack
                    key={application.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    justifyContent="space-between"
                    sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 1.5 }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{application.full_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {application.instrument_interest} · {application.email}
                      </Typography>
                    </Box>
                    <StatusChip value={application.status} />
                  </Stack>
                ))}
              </Stack>
            ) : (
              <EmptyState
                title={pick('No applications yet', '暂无申请')}
                message={pick('Submitted join forms will appear here.', '提交的加入申请会显示在这里。')}
              />
            )}
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
