import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { zhCN } from '@mui/x-data-grid/locales';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { apiRequest } from '../api/client.js';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const roleLabels = {
  en: { admin: 'Admin', member: 'Member', president: 'President' },
  zh: { admin: '管理员', member: '成员', president: '队长' },
};

export default function AdminUsers() {
  const { language, pick } = useLanguage();
  const gridLocaleText = language === 'zh' ? zhCN.components.MuiDataGrid.defaultProps.localeText : undefined;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/auth/users');
      setRows(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function openRoleDialog(user) {
    setEditTarget(user);
    setSelectedRole(user.role);
    setDialogOpen(true);
  }

  async function saveRole() {
    setSaving(true);
    setError('');
    try {
      await apiRequest(`/auth/users/${editTarget.id}/role`, {
        method: 'PUT',
        body: { role: selectedRole },
      });
      setDialogOpen(false);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      field: 'username',
      headerName: pick('Username', '用户名'),
      flex: 1,
      minWidth: 140,
    },
    {
      field: 'role',
      headerName: pick('Role', '角色'),
      flex: 0.8,
      minWidth: 120,
      renderCell: ({ value }) => roleLabels[language][value] || value,
    },
    {
      field: 'member_name',
      headerName: pick('Linked Member', '关联成员'),
      flex: 1.2,
      minWidth: 160,
      renderCell: ({ row }) => row.member_chinese_name ? `${row.member_name} (${row.member_chinese_name})` : row.member_name || pick('None', '无'),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: pick('Actions', '操作'),
      width: 100,
      getActions: ({ row }) => [
        <GridActionsCellItem
          key="edit-role"
          icon={<EditRoundedIcon />}
          label={pick('Change role', '更改角色')}
          onClick={() => openRoleDialog(row)}
        />,
      ],
    },
  ];

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            {pick('Manage Users', '管理用户')}
          </Typography>
          <Typography color="text.secondary">
            {pick('View and manage user accounts and roles.', '查看和管理用户账号及角色。')}
          </Typography>
        </Box>
        <Tooltip title={pick('Refresh users', '刷新用户')}>
          <IconButton onClick={loadUsers} aria-label={pick('Refresh users', '刷新用户')}>
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 560, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={gridLocaleText}
          loading={loading}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          getRowHeight={() => 64}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {pick(`Change role of ${editTarget?.username || 'user'}`, `更改 ${editTarget?.username || '用户'} 的角色`)}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>{pick('Role', '角色')}</InputLabel>
            <Select value={selectedRole} label={pick('Role', '角色')} onChange={(e) => setSelectedRole(e.target.value)}>
              <MenuItem value="member">{roleLabels[language].member}</MenuItem>
              <MenuItem value="president">{roleLabels[language].president}</MenuItem>
              <MenuItem value="admin">{roleLabels[language].admin}</MenuItem>
            </Select>
            <FormHelperText>
              {pick(
                'Member: regular access. President: manage members & announcements. Admin: full control including user management.',
                '成员：普通访问。队长：管理成员与公告。管理员：完全控制包括用户管理。',
              )}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{pick('Cancel', '取消')}</Button>
          <Button variant="contained" onClick={saveRole} disabled={saving}>
            {saving ? pick('Saving...', '保存中...') : pick('Save', '保存')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
