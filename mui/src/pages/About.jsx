import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SectionHeader from '../components/SectionHeader.jsx';
import LoadingState from '../components/LoadingState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { apiRequest } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const copy = {
  en: {
    title: 'About the Orchestra',
    subtitle:
      'The Chinese Folk Orchestra Hub introduces a campus folk music group centered on traditional instruments, collaborative rehearsal culture, and public performance.',
    cards: [
      [
        'Background',
        'The orchestra brings students together through Chinese folk music, instrument study, ensemble rehearsal, and campus performances. The website makes the club visible to visitors while giving members a practical internal system for announcements, event coordination, and profile management.',
      ],
      [
        'Mission and Values',
        'The project emphasizes cultural appreciation, disciplined rehearsal, peer learning, inclusive recruitment, and polished public presentation. Administrators can publish events, review applications, and maintain member information in one consistent workflow.',
      ],
      [
        'Rehearsal and Performance Culture',
        'Members rehearse by instrument section and full ensemble. Public events can include recruitment interviews, workshops, showcases, seasonal concerts, and campus celebrations.',
      ],
    ],
    instrumentTitle: 'Instrument Sections',
    instruments: ['Erhu', 'Pipa', 'Guzheng', 'Dizi', 'Yangqin', 'Zhongruan', 'Percussion'],
    announcementTitle: 'Public Announcements',
    loading: 'Loading announcements',
    emptyTitle: 'No public announcements',
    emptyMessage: 'Public updates will appear here.',
  },
  zh: {
    title: '关于乐团',
    subtitle: '民乐团枢纽介绍以传统乐器、协作排练和公开演出为核心的校园民乐团。',
    cards: [
      [
        '背景',
        '乐团通过民乐学习、乐器训练、合奏排练和校园演出把学生连接在一起。网站让访客了解社团，也为成员提供公告、活动协调和资料管理的内部系统。',
      ],
      [
        '使命与价值',
        '项目强调文化理解、规范排练、同伴学习、开放招新和清晰的公开展示。管理员可以在统一流程中发布活动、审核申请并维护成员信息。',
      ],
      [
        '排练与演出文化',
        '成员按乐器声部和全团合奏进行排练。公开活动可以包含招新面试、工作坊、展示、季节音乐会和校园庆典。',
      ],
    ],
    instrumentTitle: '乐器声部',
    instruments: ['二胡', '琵琶', '古筝', '笛子', '扬琴', '中阮', '打击乐'],
    announcementTitle: '公开公告',
    loading: '正在加载公告',
    emptyTitle: '暂无公开公告',
    emptyMessage: '公开更新会显示在这里。',
  },
};

export default function About() {
  const { language } = useLanguage();
  const t = copy[language];
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/announcements')
      .then((data) => setAnnouncements(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader title={t.title} subtitle={t.subtitle} />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          {t.cards.map(([title, body]) => (
            <Card key={title}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  {title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
                  {body}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {t.instrumentTitle}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {t.instruments.map((instrument) => (
                  <Chip key={instrument} label={instrument} color="secondary" variant="outlined" />
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {t.announcementTitle}
              </Typography>
              {loading ? (
                <LoadingState label={t.loading} />
              ) : announcements.length ? (
                <Stack spacing={2}>
                  {announcements.map((announcement) => (
                    <Box key={announcement.id}>
                      <Typography sx={{ fontWeight: 800 }}>{announcement.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {announcement.content}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <EmptyState title={t.emptyTitle} message={t.emptyMessage} />
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
