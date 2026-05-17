import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import DemoAvatar from '../components/DemoAvatar.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { apiRequest } from '../api/client.js';

export default function MemberDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest(`/members/${id}`)
      .then((data) => setMember(data.item))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <LoadingState label="Loading member profile" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      {member?.is_demo && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Demo placeholder data only, not actual orchestra members.
        </Alert>
      )}
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
              gap: 4,
              alignItems: 'start',
            }}
          >
            <Box
              sx={{
                minHeight: 260,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'rgba(155, 28, 32, 0.08)',
              }}
            >
              <DemoAvatar name={member.name} src={member.photo_url} size={160} />
            </Box>
            <Stack spacing={2.2}>
              <Box>
                <Typography variant="h3" component="h1">
                  {member.name}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {member.instrument} · {member.section} · {member.role}
                </Typography>
              </Box>
              <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>
                {member.bio}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(member.tags || []).map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" color="secondary" />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Source note: {member.source_note}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button component={RouterLink} to="/members" variant="outlined">
                  Back to showcase
                </Button>
                {member.video_url && (
                  <Button
                    component="a"
                    href={member.video_url}
                    target="_blank"
                    rel="noreferrer"
                    variant="contained"
                    endIcon={<OpenInNewRoundedIcon />}
                  >
                    Open video
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
