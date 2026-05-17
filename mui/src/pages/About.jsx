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

const instruments = [
  'Erhu',
  'Pipa',
  'Guzheng',
  'Dizi',
  'Yangqin',
  'Zhongruan',
  'Percussion',
];

export default function About() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/announcements')
      .then((data) => setAnnouncements(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        title="About the Orchestra"
        subtitle="The Chinese Folk Orchestra Hub introduces a campus folk music group centered on traditional instruments, collaborative rehearsal culture, and public performance."
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
          gap: 3,
        }}
      >
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Background
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
                The orchestra brings students together through Chinese folk music,
                instrument study, ensemble rehearsal, and campus performances. The
                website is designed to make the club visible to visitors while
                giving members a practical internal system for announcements,
                event coordination, and profile management.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Mission and Values
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
                The project emphasizes cultural appreciation, disciplined rehearsal,
                peer learning, inclusive recruitment, and polished public
                presentation. Administrators can publish events, review applications,
                and maintain member information in one consistent workflow.
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Rehearsal and Performance Culture
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
                Members rehearse by instrument section and full ensemble. Public
                events can include recruitment interviews, workshops, showcases,
                seasonal concerts, and campus celebrations.
              </Typography>
            </CardContent>
          </Card>
        </Stack>
        <Stack spacing={3}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Instrument Sections
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {instruments.map((instrument) => (
                  <Chip key={instrument} label={instrument} color="secondary" variant="outlined" />
                ))}
              </Stack>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Public Announcements
              </Typography>
              {loading ? (
                <LoadingState label="Loading announcements" />
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
                <EmptyState title="No public announcements" message="Public updates will appear here." />
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
