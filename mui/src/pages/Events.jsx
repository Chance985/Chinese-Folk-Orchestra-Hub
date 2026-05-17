import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { apiRequest } from '../api/client.js';
import { formatDateTime } from '../utils/format.js';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/events')
      .then((data) => setEvents(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        title="Events"
        subtitle="Browse performances, recruitment interviews, rehearsals, and club activities. Public visitors only see public events; logged-in users can also see member-only events."
      />
      {loading ? (
        <LoadingState label="Loading events" />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : events.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2 }}>
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  <Chip label={event.type} color="secondary" />
                  <StatusChip value={event.visibility} />
                </Stack>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {event.title}
                </Typography>
                <Stack spacing={1} sx={{ mb: 2, color: 'text.secondary' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthRoundedIcon fontSize="small" />
                    <Typography>{formatDateTime(event.event_date)}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnRoundedIcon fontSize="small" />
                    <Typography>{event.location}</Typography>
                  </Stack>
                </Stack>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {event.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <EmptyState title="No events yet" message="Events will appear after an admin creates them." />
      )}
    </Container>
  );
}
