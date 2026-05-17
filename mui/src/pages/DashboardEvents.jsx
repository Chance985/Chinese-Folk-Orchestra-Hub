import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { formatDateTime, toDateTimeInputValue } from '../utils/format.js';

const emptyEvent = {
  title: '',
  type: 'Performance',
  event_date: '',
  location: '',
  description: '',
  visibility: 'public',
};

export default function DashboardEvents() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/events');
      setRows(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyEvent);
    setDialogOpen(true);
  }

  function openEdit(row) {
    setEditingId(row.id);
    setForm({
      title: row.title,
      type: row.type,
      event_date: toDateTimeInputValue(row.event_date),
      location: row.location,
      description: row.description,
      visibility: row.visibility,
    });
    setDialogOpen(true);
  }

  async function save() {
    const method = editingId ? 'PUT' : 'POST';
    const path = editingId ? `/events/${editingId}` : '/events';
    await apiRequest(path, { method, body: form });
    setDialogOpen(false);
    await load();
  }

  async function remove() {
    if (!deleteTarget) return;
    await apiRequest(`/events/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    await load();
  }

  const columns = useMemo(
    () => [
      { field: 'title', headerName: 'Title', flex: 1, minWidth: 220 },
      { field: 'type', headerName: 'Type', flex: 0.7, minWidth: 130 },
      {
        field: 'event_date',
        headerName: 'Date/time',
        flex: 0.9,
        minWidth: 180,
        valueFormatter: (value) => formatDateTime(value),
      },
      { field: 'location', headerName: 'Location', flex: 0.9, minWidth: 180 },
      {
        field: 'visibility',
        headerName: 'Visibility',
        width: 130,
        renderCell: ({ row }) => <StatusChip value={row.visibility} />,
      },
      {
        field: 'actions',
        type: 'actions',
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditRoundedIcon />}
            label="Edit"
            onClick={() => openEdit(row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteRoundedIcon />}
            label="Delete"
            onClick={() => setDeleteTarget(row)}
          />,
        ],
      },
    ],
    [],
  );

  if (!isAdmin) {
    return (
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h3" component="h1">
            Events and Rehearsals
          </Typography>
          <Typography color="text.secondary">Member-visible rehearsals and public events.</Typography>
        </Box>
        {loading ? (
          <LoadingState label="Loading events" />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : rows.length ? (
          <Stack spacing={2}>
            {rows.map((row) => (
              <Card key={row.id}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="h5">{row.title}</Typography>
                    <StatusChip value={row.visibility} />
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {row.type} · {formatDateTime(row.event_date)} · {row.location}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.75 }}>
                    {row.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <EmptyState title="No events" message="Events will appear here." />
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            Manage Events
          </Typography>
          <Typography color="text.secondary">Create, edit, and delete performances, interviews, and rehearsals.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh events">
            <IconButton onClick={load} aria-label="Refresh events">
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New event
          </Button>
        </Stack>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit event' : 'Create event'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
            <TextField
              select
              label="Event type"
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
            >
              {['Performance', 'Rehearsal', 'Recruitment', 'Workshop', 'Club Activity'].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date/time"
              type="datetime-local"
              value={form.event_date}
              onChange={(event) => setForm((current) => ({ ...current, event_date: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              required
            />
            <TextField
              label="Description"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              multiline
              minRows={4}
              required
            />
            <TextField
              select
              label="Visibility"
              value={form.visibility}
              onChange={(event) => setForm((current) => ({ ...current, visibility: event.target.value }))}
            >
              <MenuItem value="public">public</MenuItem>
              <MenuItem value="members">members</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete event?"
        message={`Delete "${deleteTarget?.title || 'this event'}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </Stack>
  );
}
