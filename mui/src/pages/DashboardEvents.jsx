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
import { zhCN } from '@mui/x-data-grid/locales';
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
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatDateTime, toDateTimeInputValue } from '../utils/format.js';

const emptyEvent = {
  title: '',
  type: 'Performance',
  event_date: '',
  location: '',
  description: '',
  visibility: 'public',
};

const eventTypes = [
  ['Performance', '演出'],
  ['Rehearsal', '排练'],
  ['Recruitment', '招新'],
  ['Workshop', '工作坊'],
  ['Club Activity', '社团活动'],
];

export default function DashboardEvents() {
  const { isAdmin } = useAuth();
  const { language, pick } = useLanguage();
  const gridLocaleText = language === 'zh' ? zhCN.components.MuiDataGrid.defaultProps.localeText : undefined;
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
      { field: 'title', headerName: pick('Title', '标题'), flex: 1, minWidth: 220 },
      {
        field: 'type',
        headerName: pick('Type', '类型'),
        flex: 0.7,
        minWidth: 130,
        valueFormatter: (value) => eventTypes.find(([type]) => type === value)?.[language === 'zh' ? 1 : 0] || value,
      },
      {
        field: 'event_date',
        headerName: pick('Date/time', '日期时间'),
        flex: 0.9,
        minWidth: 180,
        valueFormatter: (value) => formatDateTime(value),
      },
      { field: 'location', headerName: pick('Location', '地点'), flex: 0.9, minWidth: 180 },
      {
        field: 'visibility',
        headerName: pick('Visibility', '可见范围'),
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
    [language, pick],
  );

  if (!isAdmin) {
    return (
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h3" component="h1">
            {pick('Events and Rehearsals', '活动与排练')}
          </Typography>
          <Typography color="text.secondary">
            {pick('Member-visible rehearsals and public events.', '成员可查看的排练和公开活动。')}
          </Typography>
        </Box>
        {loading ? (
          <LoadingState label={pick('Loading events', '正在加载活动')} />
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
                    {(language === 'zh' ? eventTypes.find(([type]) => type === row.type)?.[1] : row.type) || row.type} / {formatDateTime(row.event_date)} / {row.location}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.75 }}>
                    {row.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <EmptyState title={pick('No events', '暂无活动')} message={pick('Events will appear here.', '活动会显示在这里。')} />
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            {pick('Manage Events', '管理活动')}
          </Typography>
          <Typography color="text.secondary">
            {pick('Create, edit, and delete performances, interviews, and rehearsals.', '创建、编辑和删除演出、面试与排练。')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Tooltip title={pick('Refresh events', '刷新活动')}>
            <IconButton onClick={load} aria-label={pick('Refresh events', '刷新活动')}>
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            {pick('New event', '新建活动')}
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
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? pick('Edit event', '编辑活动') : pick('Create event', '创建活动')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label={pick('Title', '标题')}
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              required
            />
            <TextField
              select
              label={pick('Event type', '活动类型')}
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
            >
              {eventTypes.map(([type, zhType]) => (
                <MenuItem key={type} value={type}>
                  {language === 'zh' ? zhType : type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={pick('Date/time', '日期时间')}
              type="datetime-local"
              value={form.event_date}
              onChange={(event) => setForm((current) => ({ ...current, event_date: event.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label={pick('Location', '地点')}
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              required
            />
            <TextField
              label={pick('Description', '描述')}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              multiline
              minRows={4}
              required
            />
            <TextField
              select
              label={pick('Visibility', '可见范围')}
              value={form.visibility}
              onChange={(event) => setForm((current) => ({ ...current, visibility: event.target.value }))}
            >
              <MenuItem value="public">{pick('public', '公开')}</MenuItem>
              <MenuItem value="members">{pick('members', '成员可见')}</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{pick('Cancel', '取消')}</Button>
          <Button variant="contained" onClick={save}>
            {pick('Save', '保存')}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={pick('Delete event?', '删除活动？')}
        message={pick(`Delete "${deleteTarget?.title || 'this event'}"?`, `确定删除“${deleteTarget?.title || '这场活动'}”？`)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </Stack>
  );
}
