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
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { joinTags } from '../utils/format.js';

export default function MemberProfile() {
  const { user } = useAuth();
  const { pick } = useLanguage();
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
      setSuccess(pick('Profile changes saved.', '资料修改已保存。'));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!user?.member_id) {
    return (
      <EmptyState
        title={pick('No linked member profile', '没有关联的成员资料')}
        message={pick('This account is not linked to a member showcase profile yet.', '此账号尚未关联成员展示资料。')}
      />
    );
  }

  if (loading) return <LoadingState label={pick('Loading profile', '正在加载资料')} />;

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h3" component="h1">
          {pick('My Profile', '我的资料')}
        </Typography>
        <Typography color="text.secondary">
          {pick(
            'Member accounts can update their bio, media links, and public showcase tags.',
            '成员账号可以更新简介、媒体链接和公开展示标签。',
          )}
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
                    {pick('Demo placeholder data only, not actual orchestra members.', '仅为演示占位数据，不代表真实乐团成员。')}
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
                {pick('Edit Showcase Details', '编辑展示资料')}
              </Typography>
              <Typography color="text.secondary">
                {pick(
                  'Instrument, section, and role are managed by admins to keep roster records consistent.',
                  '乐器、声部和角色由管理员维护，以保持成员名册一致。',
                )}
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
                label={pick('Photo URL', '照片链接')}
                value={form.photo_url}
                onChange={(event) => setForm((current) => ({ ...current, photo_url: event.target.value }))}
              />
              <TextField
                label={pick('Video URL', '视频链接')}
                value={form.video_url}
                onChange={(event) => setForm((current) => ({ ...current, video_url: event.target.value }))}
              />
              <TextField
                label={pick('Tags', '标签')}
                helperText={pick('Comma-separated showcase tags', '用英文逗号分隔多个展示标签')}
                value={form.tags}
                onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                sx={{ gridColumn: { md: '1 / -1' } }}
              />
              <TextField
                label={pick('Bio', '简介')}
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
                {saving ? pick('Saving...', '保存中...') : pick('Save profile', '保存资料')}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
