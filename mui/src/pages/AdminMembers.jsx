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
import { zhCN } from '@mui/x-data-grid/locales';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import DemoAvatar from '../components/DemoAvatar.jsx';
import { apiRequest } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
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

const fieldLabels = {
  name: ['Name', '姓名'],
  instrument: ['Instrument', '乐器'],
  section: ['Section', '声部'],
  role: ['Role', '角色'],
};

export default function AdminMembers() {
  const { language, pick } = useLanguage();
  const gridLocaleText = language === 'zh' ? zhCN.components.MuiDataGrid.defaultProps.localeText : undefined;
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
        headerName: pick('Member', '成员'),
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
      { field: 'instrument', headerName: pick('Instrument', '乐器'), flex: 0.8, minWidth: 130 },
      { field: 'section', headerName: pick('Section', '声部'), flex: 0.9, minWidth: 150 },
      {
        field: 'tags',
        headerName: pick('Tags', '标签'),
        flex: 1,
        minWidth: 180,
        valueGetter: (value) => joinTags(value),
      },
      {
        field: 'is_demo',
        headerName: pick('Demo', '演示'),
        width: 100,
        renderCell: ({ row }) =>
          row.is_demo ? <Chip size="small" label={pick('Demo', '演示')} color="warning" variant="outlined" /> : pick('No', '否'),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: pick('Actions', '操作'),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditRoundedIcon />}
            label={pick('Edit', '编辑')}
            onClick={() => openEdit(row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteRoundedIcon />}
            label={pick('Delete', '删除')}
            onClick={() => setDeleteTarget(row)}
          />,
        ],
      },
    ],
    [pick],
  );

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            {pick('Manage Members', '管理成员')}
          </Typography>
          <Typography color="text.secondary">
            {pick('Create, edit, and remove showcase profiles.', '创建、编辑和删除成员展示资料。')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title={pick('Refresh members', '刷新成员')}>
            <IconButton onClick={load} aria-label={pick('Refresh members', '刷新成员')}>
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            {pick('New member', '新建成员')}
          </Button>
        </Stack>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={gridLocaleText}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          getRowHeight={() => 72}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingId ? pick('Edit member', '编辑成员') : pick('Create member', '创建成员')}</DialogTitle>
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
                label={pick(...fieldLabels[field])}
                value={form[field] || ''}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                required
              />
            ))}
            <TextField
              label={pick('Photo URL', '照片链接')}
              value={form.photo_url || ''}
              onChange={(event) => setForm((current) => ({ ...current, photo_url: event.target.value }))}
            />
            <TextField
              label={pick('Video URL', '视频链接')}
              value={form.video_url || ''}
              onChange={(event) => setForm((current) => ({ ...current, video_url: event.target.value }))}
            />
            <TextField
              label={pick('Tags', '标签')}
              value={form.tags || ''}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              helperText={pick('Comma-separated tags', '用英文逗号分隔多个标签')}
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
            <TextField
              label={pick('Bio', '简介')}
              value={form.bio || ''}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              multiline
              minRows={4}
              required
              sx={{ gridColumn: { md: '1 / -1' } }}
            />
            <TextField
              label={pick('Source note', '来源说明')}
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
              label={pick('Mark as demo placeholder data', '标记为演示占位数据')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{pick('Cancel', '取消')}</Button>
          <Button variant="contained" onClick={saveMember}>
            {pick('Save', '保存')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={pick('Delete member?', '删除成员？')}
        message={pick(`Delete ${deleteTarget?.name || 'this member'} from the showcase?`, `确定从展示中删除${deleteTarget?.name || '这名成员'}？`)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteMember}
      />
    </Stack>
  );
}
