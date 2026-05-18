import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { zhCN } from '@mui/x-data-grid/locales';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { apiRequest } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';
import { formatDateTime } from '../utils/format.js';

const statuses = ['Pending', 'Interview Scheduled', 'Rejected', 'Passed', 'Joined'];
const statusLabelsZh = {
  Pending: '待处理',
  'Interview Scheduled': '已安排面试',
  Rejected: '未通过',
  Passed: '已通过',
  Joined: '已加入',
};

export default function AdminApplications() {
  const { language, pick } = useLanguage();
  const gridLocaleText = language === 'zh' ? zhCN.components.MuiDataGrid.defaultProps.localeText : undefined;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/applications');
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

  async function updateStatus(id, status) {
    await apiRequest(`/applications/${id}/status`, {
      method: 'PUT',
      body: { status },
    });
    await load();
  }

  async function deleteApplication() {
    if (!deleteTarget) return;
    await apiRequest(`/applications/${deleteTarget.id}`, { method: 'DELETE' });
    setDeleteTarget(null);
    await load();
  }

  const columns = useMemo(
    () => [
      { field: 'full_name', headerName: pick('Applicant', '申请人'), flex: 1, minWidth: 160 },
      { field: 'student_id', headerName: pick('Student ID', '学号'), flex: 0.8, minWidth: 130 },
      { field: 'instrument_interest', headerName: pick('Interest', '意向'), flex: 0.9, minWidth: 140 },
      { field: 'email', headerName: pick('Email', '邮箱'), flex: 1.2, minWidth: 190 },
      {
        field: 'status',
        headerName: pick('Status', '状态'),
        flex: 1,
        minWidth: 190,
        renderCell: ({ row }) => (
          <Select
            size="small"
            value={row.status}
            onChange={(event) => updateStatus(row.id, event.target.value)}
            sx={{ minWidth: 170 }}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {language === 'zh' ? statusLabelsZh[status] : status}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      {
        field: 'created_at',
        headerName: pick('Submitted', '提交时间'),
        flex: 1,
        minWidth: 180,
        valueFormatter: (value) => formatDateTime(value),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: pick('Actions', '操作'),
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityRoundedIcon />}
            label={pick('View', '查看')}
            onClick={() => setViewTarget(row)}
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

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            {pick('Manage Applications', '管理申请')}
          </Typography>
          <Typography color="text.secondary">
            {pick('View join requests and update interview status.', '查看加入申请并更新面试状态。')}
          </Typography>
        </Box>
        <Tooltip title={pick('Refresh applications', '刷新申请')}>
          <IconButton onClick={load} aria-label={pick('Refresh applications', '刷新申请')}>
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
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

      <Dialog open={Boolean(viewTarget)} onClose={() => setViewTarget(null)} maxWidth="md" fullWidth>
        <DialogTitle>{pick('Application details', '申请详情')}</DialogTitle>
        <DialogContent>
          {viewTarget && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="h5">{viewTarget.full_name}</Typography>
                <StatusChip value={viewTarget.status} />
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {[
                  [pick('Student ID', '学号'), viewTarget.student_id],
                  [pick('Email', '邮箱'), viewTarget.email],
                  [pick('Phone', '电话'), viewTarget.phone],
                  [pick('Instrument interest', '意向乐器'), viewTarget.instrument_interest],
                  [pick('Available time', '可面试时间'), viewTarget.available_time],
                  [pick('Portfolio URL', '作品链接'), viewTarget.portfolio_url || pick('Not provided', '未提供')],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography>{value}</Typography>
                  </Box>
                ))}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {pick('Music experience', '音乐经历')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewTarget.experience}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {pick('Self introduction', '自我介绍')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewTarget.introduction}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {pick('Additional message', '补充留言')}
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewTarget.message || pick('None', '无')}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTarget(null)}>{pick('Close', '关闭')}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={pick('Delete application?', '删除申请？')}
        message={pick(`Delete the application from ${deleteTarget?.full_name || 'this applicant'}?`, `确定删除${deleteTarget?.full_name || '这位申请人'}的申请？`)}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteApplication}
      />
    </Stack>
  );
}
