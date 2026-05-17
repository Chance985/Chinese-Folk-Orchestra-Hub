import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DemoAvatar from '../components/DemoAvatar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { joinTags } from '../utils/format.js';

export default function MemberProfile() {
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(Boolean(user?.member_id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    bio: '',
    photo_url: '',
    video_url: '',
    tags: '',
  });

  useEffect(() => {
    if (!user?.member_id) return;
    apiRequest(`/members/${user.member_id}`)
      .then((data) => {
        setMember(data.item);
        setForm({
          bio: data.item.bio || '',
          photo_url: data.item.photo_url || '',
          video_url: data.item.video_url || '',
          tags: joinTags(data.item.tags),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user?.member_id]);

  async function saveProfile() {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      const data = await apiRequest(`/members/${user.member_id}/profile`, {
        method: 'PUT',
        body: payload,
      });
      setMember(data.item);
      setForm({
        bio: data.item.bio || '',
        photo_url: data.item.photo_url || '',
        video_url: data.item.video_url || '',
        tags: joinTags(data.item.tags),
      });
      setSuccess('Profile changes saved.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user?.member_id) {
    return (
      <EmptyState
        title="No linked member profile"
        message="This account is not linked to a member showcase profile yet."
      />
    );
  }

  if (loading) return <LoadingState label="Loading profile" />;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h3" component="h1">
          My Profile
        </Typography>
        <Typography color="text.secondary">
          Member accounts can update their bio, media links, and public showcase tags.
        </Typography>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {member && (
        <Card>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
              <DemoAvatar name={member.name} src={member.photo_url} size={132} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3">{member.name}</Typography>
                <Typography variant="h6" color="text.secondary">
                  {member.instrument} / {member.section} / {member.role}
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
      )}

      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h5" component="h2">
                Edit Showcase Details
              </Typography>
              <Typography color="text.secondary">
                Instrument, section, and role are managed by admins to keep roster records consistent.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2,
              }}
            >
              <TextField
                label="Photo URL"
                value={form.photo_url}
                onChange={(event) => setForm((current) => ({ ...current, photo_url: event.target.value }))}
              />
              <TextField
                label="Video URL"
                value={form.video_url}
                onChange={(event) => setForm((current) => ({ ...current, video_url: event.target.value }))}
              />
              <TextField
                label="Tags"
                helperText="Comma-separated showcase tags"
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                sx={{ gridColumn: { md: '1 / -1' } }}
              />
              <TextField
                label="Bio"
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                multiline
                minRows={5}
                required
                sx={{ gridColumn: { md: '1 / -1' } }}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save profile'}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
