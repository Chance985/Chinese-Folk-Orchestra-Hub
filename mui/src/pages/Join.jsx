import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SectionHeader from '../components/SectionHeader.jsx';
import { apiRequest } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const initialForm = {
  full_name: '',
  student_id: '',
  email: '',
  phone: '',
  instrument_interest: '',
  experience: '',
  introduction: '',
  portfolio_url: '',
  available_time: '',
  message: '',
};

const instruments = ['Erhu', 'Pipa', 'Guzheng', 'Dizi', 'Yangqin', 'Zhongruan', 'Percussion', 'Other'];
const instrumentsZh = ['二胡', '琵琶', '古筝', '笛子', '扬琴', '中阮', '打击乐', '其他'];

export default function Join() {
  const { language, pick } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  }

  function validate() {
    const nextErrors = {};
    ['full_name', 'student_id', 'email', 'phone', 'instrument_interest', 'experience', 'introduction', 'available_time'].forEach(
      (field) => {
        if (!String(form[field]).trim()) nextErrors[field] = pick('This field is required.', '此项为必填。');
      },
    );
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = pick('Enter a valid email address.', '请输入有效的邮箱地址。');
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setServerError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      await apiRequest('/applications', {
        method: 'POST',
        body: form,
      });
      setForm(initialForm);
      setSuccess(true);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        title={pick('Join Us', '加入我们')}
        subtitle={pick(
          'Submit an online application and interview request. Applications are saved to the SQLite database with Pending status for admin review.',
          '提交线上申请和面试请求。申请会以“待处理”状态保存到 SQLite 数据库，供管理员审核。',
        )}
      />
      <Card>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              <TextField
                label={pick('Full name', '姓名')}
                value={form.full_name}
                onChange={(event) => update('full_name', event.target.value)}
                required
                error={Boolean(errors.full_name)}
                helperText={errors.full_name}
              />
              <TextField
                label={pick('Student ID', '学号')}
                value={form.student_id}
                onChange={(event) => update('student_id', event.target.value)}
                required
                error={Boolean(errors.student_id)}
                helperText={errors.student_id}
              />
              <TextField
                label={pick('Email', '邮箱')}
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                required
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                label={pick('Phone', '电话')}
                type="tel"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                required
                error={Boolean(errors.phone)}
                helperText={errors.phone}
              />
              <TextField
                select
                label={pick('Interested instrument / section', '意向乐器 / 声部')}
                value={form.instrument_interest}
                onChange={(event) => update('instrument_interest', event.target.value)}
                required
                error={Boolean(errors.instrument_interest)}
                helperText={errors.instrument_interest}
              >
                {instruments.map((instrument, index) => (
                  <MenuItem key={instrument} value={instrument}>
                    {language === 'zh' ? instrumentsZh[index] : instrument}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={pick('Available interview time', '可面试时间')}
                value={form.available_time}
                onChange={(event) => update('available_time', event.target.value)}
                required
                error={Boolean(errors.available_time)}
                helperText={errors.available_time || pick('Example: Friday 3:00 PM or June 12 after class', '例如：周五下午 3 点，或 6 月 12 日课后')}
              />
              <TextField
                label={pick('Portfolio or video link', '作品集或视频链接')}
                value={form.portfolio_url}
                onChange={(event) => update('portfolio_url', event.target.value)}
                helperText={pick('Optional link to a performance recording or portfolio', '可选：填写演奏录音、视频或作品集链接')}
                sx={{ gridColumn: { md: '1 / -1' } }}
              />
              <TextField
                label={pick('Music experience', '音乐经历')}
                multiline
                minRows={4}
                value={form.experience}
                onChange={(event) => update('experience', event.target.value)}
                required
                error={Boolean(errors.experience)}
                helperText={errors.experience}
              />
              <TextField
                label={pick('Self introduction', '自我介绍')}
                multiline
                minRows={4}
                value={form.introduction}
                onChange={(event) => update('introduction', event.target.value)}
                required
                error={Boolean(errors.introduction)}
                helperText={errors.introduction}
              />
              <TextField
                label={pick('Additional message', '补充留言')}
                multiline
                minRows={3}
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                sx={{ gridColumn: { md: '1 / -1' } }}
              />
            </Box>
            {serverError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {serverError}
              </Alert>
            )}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                startIcon={<SendRoundedIcon />}
              >
                {submitting ? pick('Submitting...', '提交中...') : pick('Submit application', '提交申请')}
              </Button>
              <Typography variant="body2" color="text.secondary">
                {pick('Default status after submission: Pending.', '提交后的默认状态：待处理。')}
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={success} autoHideDuration={5000} onClose={() => setSuccess(false)}>
        <Alert severity="success" variant="filled">
          {pick('Application submitted successfully.', '申请提交成功。')}
        </Alert>
      </Snackbar>
    </Container>
  );
}
