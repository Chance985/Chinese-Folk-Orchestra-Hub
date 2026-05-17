import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DemoAvatar from '../components/DemoAvatar.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { apiRequest } from '../api/client.js';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [instrument, setInstrument] = useState('');
  const [section, setSection] = useState('');

  useEffect(() => {
    setLoading(true);
    apiRequest('/members')
      .then((data) => setMembers(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const instruments = useMemo(
    () => [...new Set(members.map((member) => member.instrument).filter(Boolean))],
    [members],
  );
  const sections = useMemo(
    () => [...new Set(members.map((member) => member.section).filter(Boolean))],
    [members],
  );
  const filtered = members.filter((member) => {
    const haystack = `${member.name} ${member.instrument} ${member.section} ${member.role} ${member.bio} ${(member.tags || []).join(' ')}`.toLowerCase();
    return (
      (!search || haystack.includes(search.toLowerCase())) &&
      (!instrument || member.instrument === instrument) &&
      (!section || member.section === section)
    );
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeader
        title="Member Showcase"
        subtitle="Demo placeholder profiles are used to test layout, search, filtering, and detail pages. These records are not actual orchestra members."
      />
      <Alert severity="warning" sx={{ mb: 3 }}>
        Demo placeholder data only, not actual orchestra members.
      </Alert>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr' },
              gap: 2,
            }}
          >
            <TextField
              label="Search members"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{ startAdornment: <SearchRoundedIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            />
            <FormControl>
              <InputLabel>Instrument</InputLabel>
              <Select value={instrument} label="Instrument" onChange={(event) => setInstrument(event.target.value)}>
                <MenuItem value="">All instruments</MenuItem>
                {instruments.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Section</InputLabel>
              <Select value={section} label="Section" onChange={(event) => setSection(event.target.value)}>
                <MenuItem value="">All sections</MenuItem>
                {sections.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
      {loading ? (
        <LoadingState label="Loading member showcase" />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : filtered.length ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          {filtered.map((member, index) => (
            <Card
              key={member.id}
              sx={{
                animation: `cfFadeUp 520ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 55}ms both`,
                transition:
                  'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 18px 48px rgba(54, 20, 16, 0.11)',
                },
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <DemoAvatar name={member.name} src={member.photo_url} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6">{member.name}</Typography>
                    <Typography color="text.secondary">
                      {member.instrument} · {member.section}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                  <Chip size="small" label={member.role} color="secondary" />
                  {member.is_demo && <Chip size="small" label="Demo data" color="warning" variant="outlined" />}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, flex: 1 }}>
                  {member.bio}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                  {(member.tags || []).slice(0, 4).map((tag) => (
                    <Chip key={tag} size="small" label={tag} variant="outlined" />
                  ))}
                </Stack>
                <Button component={RouterLink} to={`/members/${member.id}`} variant="outlined" sx={{ mt: 2 }}>
                  View profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <EmptyState title="No matching members" message="Try changing the search or filter settings." />
      )}
    </Container>
  );
}
