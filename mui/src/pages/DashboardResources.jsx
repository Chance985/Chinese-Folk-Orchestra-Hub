import { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { zhCN } from '@mui/x-data-grid/locales';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LoadingState from '../components/LoadingState.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const emptyResource = {
  resource_type: '',
  website_source: '',
  what_was_used: '',
  how_modified: '',
};

const fieldLabels = {
  resource_type: ['Resource type', '资源类型'],
  website_source: ['Source', '来源'],
  what_was_used: ['What was used', '使用内容'],
  how_modified: ['How modified', '修改方式'],
};

export default function DashboardResources() {
  const { isAdmin } = useAuth();
  const { language, pick } = useLanguage();
  const gridLocaleText = language === 'zh' ? zhCN.components.MuiDataGrid.defaultProps.localeText : undefined;
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyResource);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/resources');
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

  async function save() {
    await apiRequest('/resources', { method: 'POST', body: form });
    setForm(emptyResource);
    setDialogOpen(false);
    await load();
  }

  const columns = useMemo(
    () => [
      { field: 'resource_type', headerName: pick(...fieldLabels.resource_type), flex: 0.8, minWidth: 180 },
      { field: 'website_source', headerName: pick(...fieldLabels.website_source), flex: 1, minWidth: 220 },
      { field: 'what_was_used', headerName: pick(...fieldLabels.what_was_used), flex: 1.3, minWidth: 260 },
      { field: 'how_modified', headerName: pick(...fieldLabels.how_modified), flex: 1.2, minWidth: 260 },
    ],
    [pick],
  );

  if (loading) return <LoadingState label={pick('Loading resource declarations', '正在加载资源声明')} />;

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            {pick('External Resources', '外部资源')}
          </Typography>
          <Typography color="text.secondary">
            {pick(
              'Academic integrity record for templates, libraries, generated assets, and demo data.',
              '记录模板、库、生成素材和演示数据的学术诚信来源。',
            )}
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
            {pick('Add resource', '添加资源')}
          </Button>
        )}
      </Stack>
      <Alert severity="warning">
        {pick(
          'Member profiles are demo placeholder data only unless an admin replaces them with real club records.',
          '成员资料在管理员替换为真实社团记录前，仅作为演示占位数据。',
        )}
      </Alert>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          localeText={gridLocaleText}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{pick('Add resource declaration', '添加资源声明')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {Object.keys(emptyResource).map((field) => (
              <TextField
                key={field}
                label={pick(...fieldLabels[field])}
                value={form[field]}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                required
                multiline={field.includes('what') || field.includes('how')}
                minRows={field.includes('what') || field.includes('how') ? 3 : undefined}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{pick('Cancel', '取消')}</Button>
          <Button variant="contained" onClick={save}>
            {pick('Save', '保存')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
