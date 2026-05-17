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
import { formatDateTime } from '../utils/format.js';

const emptyAnnouncement = {
  title: '',
  content: '',
  visible_to: 'members',
};

export default function DashboardAnnouncements() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyAnnouncement);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/announcements');
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
    setForm(emptyAnnouncement);
    setDialogOpen(true);
  }

  function openEdit(row) {
    setEditingId(row.id);
    setForm({
      title: row.title,
      content: row.content,
      visible_to: row.visible_to,
    });
    setDialogOpen(true);
  }

  async function save() {
    const method = editingId ? 'PUT' : 'POST';
    const path = editingId ? `/announcements/${editingId}` : '/announcements';
    await apiRequest(path, { method, body: form });
    setDialogOpen(false);
    await load();
  }

  async function remove() {
    if (!deleteTarget) return;
    await apiRequest(`/announcements/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    await load();
  }

  const columns = useMemo(
    () => [
      { field: 'title', headerName: 'Title', flex: 1, minWidth: 220 },
      { field: 'content', headerName: 'Content', flex: 1.4, minWidth: 260 },
      {
        field: 'visible_to',
        headerName: 'Visible to',
        width: 130,
        renderCell: ({ row }) => <StatusChip value={row.visible_to} />,
      },
      {
        field: 'updated_at',
        headerName: 'Updated',
        flex: 0.9,
        minWidth: 170,
        valueFormatter: (value) => formatDateTime(value),
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
            Announcements
          </Typography>
          <Typography color="text.secondary">Internal and public notices visible to members.</Typography>
        </Box>
        {loading ? (
          <LoadingState label="Loading announcements" />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : rows.length ? (
          <Stack spacing={2}>
            {rows.map((row) => (
              <Card key={row.id}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Typography variant="h5">{row.title}</Typography>
                    <StatusChip value={row.visible_to} />
                  </Stack>
                  <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.75 }}>
                    {row.content}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <EmptyState title="No announcements" message="Announcements will appear here." />
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            Manage Announcements
          </Typography>
          <Typography color="text.secondary">Create, edit, and delete public or internal announcements.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh announcements">
            <IconButton onClick={load} aria-label="Refresh announcements">
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New announcement
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
        <DialogTitle>{editingId ? 'Edit announcement' : 'Create announcement'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
            <TextField
              label="Content"
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              multiline
              minRows={5}
              required
            />
            <TextField
              select
              label="Visible to"
              value={form.visible_to}
              onChange={(event) => setForm((current) => ({ ...current, visible_to: event.target.value }))}
            >
              <MenuItem value="public">public</MenuItem>
              <MenuItem value="members">members</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
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
        title="Delete announcement?"
        message={`Delete "${deleteTarget?.title || 'this announcement'}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </Stack>
  );
}
