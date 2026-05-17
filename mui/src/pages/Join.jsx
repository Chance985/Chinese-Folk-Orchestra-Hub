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

export default function Join() {
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
        if (!String(form[field]).trim()) nextErrors[field] = 'This field is required.';
      },
    );
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
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
        title="Join Us"
        subtitle="Submit an online application and interview request. Applications are saved to the SQLite database with Pending status for admin review."
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
                label="Full name"
                value={form.full_name}
                onChange={(event) => update('full_name', event.target.value)}
                required
                error={Boolean(errors.full_name)}
                helperText={errors.full_name}
              />
              <TextField
                label="Student ID"
                value={form.student_id}
                onChange={(event) => update('student_id', event.target.value)}
                required
                error={Boolean(errors.student_id)}
                helperText={errors.student_id}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                required
                error={Boolean(errors.email)}
                helperText={errors.email}
              />
              <TextField
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                required
                error={Boolean(errors.phone)}
                helperText={errors.phone}
              />
              <TextField
                select
                label="Interested instrument / section"
                value={form.instrument_interest}
                onChange={(event) => update('instrument_interest', event.target.value)}
                required
                error={Boolean(errors.instrument_interest)}
                helperText={errors.instrument_interest}
              >
                {instruments.map((instrument) => (
                  <MenuItem key={instrument} value={instrument}>
                    {instrument}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Available interview time"
                value={form.available_time}
                onChange={(event) => update('available_time', event.target.value)}
                required
                error={Boolean(errors.available_time)}
                helperText={errors.available_time || 'Example: Friday 3:00 PM or June 12 after class'}
              />
              <TextField
                label="Portfolio or video link"
                value={form.portfolio_url}
                onChange={(event) => update('portfolio_url', event.target.value)}
                helperText="Optional link to a performance recording or portfolio"
                sx={{ gridColumn: { md: '1 / -1' } }}
              />
              <TextField
                label="Music experience"
                multiline
                minRows={4}
                value={form.experience}
                onChange={(event) => update('experience', event.target.value)}
                required
                error={Boolean(errors.experience)}
                helperText={errors.experience}
              />
              <TextField
                label="Self introduction"
                multiline
                minRows={4}
                value={form.introduction}
                onChange={(event) => update('introduction', event.target.value)}
                required
                error={Boolean(errors.introduction)}
                helperText={errors.introduction}
              />
              <TextField
                label="Additional message"
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
                {submitting ? 'Submitting...' : 'Submit application'}
              </Button>
              <Typography variant="body2" color="text.secondary">
                Default status after submission: Pending.
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={success} autoHideDuration={5000} onClose={() => setSuccess(false)}>
        <Alert severity="success" variant="filled">
          Application submitted successfully.
        </Alert>
      </Snackbar>
    </Container>
  );
}
