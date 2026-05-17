import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
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
import DemoAvatar from '../components/DemoAvatar.jsx';
import { apiRequest } from '../api/client.js';
import { joinTags } from '../utils/format.js';

const emptyMember = {
  name: '',
  instrument: '',
  section: '',
  role: '',
  bio: '',
  photo_url: '',
  video_url: '',
  tags: '',
  source_note: 'Created by admin in local system.',
  is_demo: false,
};

export default function AdminMembers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyMember);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/members');
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
    setForm(emptyMember);
    setDialogOpen(true);
  }

  function openEdit(member) {
    setEditingId(member.id);
    setForm({
      ...member,
      tags: joinTags(member.tags),
      is_demo: Boolean(member.is_demo),
    });
    setDialogOpen(true);
  }

  async function saveMember() {
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    const path = editingId ? `/members/${editingId}` : '/members';
    const method = editingId ? 'PUT' : 'POST';
    await apiRequest(path, { method, body: payload });
    setDialogOpen(false);
    await load();
  }

  async function deleteMember() {
    if (!deleteTarget) return;
    await apiRequest(`/members/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    await load();
  }

  const columns = useMemo(
    () => [
      {
        field: 'profile',
        headerName: 'Member',
        flex: 1.2,
        minWidth: 210,
        sortable: false,
        renderCell: ({ row }) => (
          <Stack direction="row" spacing={1.2} alignItems="center" sx={{ py: 1 }}>
            <DemoAvatar name={row.name} src={row.photo_url} size={42} />
            <Box>
              <Typography sx={{ fontWeight: 800 }}>{row.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {row.role}
              </Typography>
            </Box>
          </Stack>
        ),
      },
      { field: 'instrument', headerName: 'Instrument', flex: 0.8, minWidth: 130 },
      { field: 'section', headerName: 'Section', flex: 0.9, minWidth: 150 },
      {
        field: 'tags',
        headerName: 'Tags',
        flex: 1,
        minWidth: 180,
        valueGetter: (value) => joinTags(value),
      },
      {
        field: 'is_demo',
        headerName: 'Demo',
        width: 100,
        renderCell: ({ row }) =>
          row.is_demo ? <Chip size="small" label="Demo" color="warning" variant="outlined" /> : 'No',
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
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

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            Manage Members
          </Typography>
          <Typography color="text.secondary">Create, edit, and remove showcase profiles.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh members">
            <IconButton onClick={load} aria-label="Refresh members">
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New member
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
          getRowHeight={() => 72}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? 'Edit member' : 'Create member'}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2,
              pt: 1,
            }}
          >
            {['name', 'instrument', 'section', 'role'].map((field) => (
              <TextField
                key={field}
                label={field.replace('_', ' ')}
                value={form[field] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                required
              />
            ))}
            <TextField
              label="Photo URL"
              value={form.photo_url || ''}
              onChange={(event) => setForm((current) => ({ ...current, photo_url: event.target.value }))}
            />
            <TextField
              label="Video URL"
              value={form.video_url || ''}
              onChange={(event) => setForm((current) => ({ ...current, video_url: event.target.value }))}
            />
            <TextField
              label="Tags"
              value={form.tags || ''}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              helperText="Comma-separated tags"
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
            <TextField
              label="Bio"
              value={form.bio || ''}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              multiline
              minRows={4}
              required
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
            <TextField
              label="Source note"
              value={form.source_note || ''}
              onChange={(event) => setForm((current) => ({ ...current, source_note: event.target.value }))}
              multiline
              minRows={2}
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(form.is_demo)}
                  onChange={(event) => setForm((current) => ({ ...current, is_demo: event.target.checked }))}
                />
              }
              label="Mark as demo placeholder data"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveMember}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete member?"
        message={`Delete ${deleteTarget?.name || 'this member'} from the showcase?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteMember}
      />
    </Stack>
  );
}
