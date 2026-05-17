import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DemoAvatar from '../components/DemoAvatar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function MemberProfile() {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(Boolean(user?.member_id));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.member_id) return;
    apiRequest(`/members/${user.member_id}`)
      .then((data) => setMember(data.item))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.member_id]);

  if (!user?.member_id) {
    return (
      <EmptyState
        title="No linked member profile"
        message="This account is not linked to a member showcase profile yet."
      />
    );
  }

  if (loading) return <LoadingState label="Loading profile" />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h3" component="h1">
          My Profile
        </Typography>
        <Typography color="text.secondary">
          Member accounts can view their linked profile. Admins manage edits from the Members page.
        </Typography>
      </Box>
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
            <DemoAvatar name={member.name} src={member.photo_url} size={132} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3">{member.name}</Typography>
              <Typography variant="h6" color="text.secondary">
                {member.instrument} · {member.section} · {member.role}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.75 }}>
                {member.bio}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                {(member.tags || []).map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" color="secondary" />
                ))}
              </Stack>
              {member.is_demo && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Demo placeholder data only, not actual orchestra members.
                </Alert>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
