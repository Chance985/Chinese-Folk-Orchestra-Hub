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
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LoadingState from '../components/LoadingState.jsx';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

const emptyResource = {
  resource_type: '',
  website_source: '',
  what_was_used: '',
  how_modified: '',
};

export default function DashboardResources() {
  const { isAdmin } = useAuth();
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
      { field: 'resource_type', headerName: 'Resource type', flex: 0.8, minWidth: 180 },
      { field: 'website_source', headerName: 'Source', flex: 1, minWidth: 220 },
      { field: 'what_was_used', headerName: 'What was used', flex: 1.3, minWidth: 260 },
      { field: 'how_modified', headerName: 'How modified', flex: 1.2, minWidth: 260 },
    ],
    [],
  );

  if (loading) return <LoadingState label="Loading resource declarations" />;

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h3" component="h1">
            External Resources
          </Typography>
          <Typography color="text.secondary">
            Academic integrity record for templates, libraries, generated assets, and demo data.
          </Typography>
        </Box>
        {isAdmin && (
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
            Add resource
          </Button>
        )}
      </Stack>
      <Alert severity="warning">
        Member profiles are demo placeholder data only unless an admin replaces them with real club records.
      </Alert>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 620, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add resource declaration</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {Object.keys(emptyResource).map((field) => (
              <TextField
                key={field}
                label={field.replaceAll('_', ' ')}
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
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
