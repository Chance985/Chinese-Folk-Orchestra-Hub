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
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StatusChip from '../components/StatusChip.jsx';
import { apiRequest } from '../api/client.js';
import { formatDateTime } from '../utils/format.js';

const statuses = ['Pending', 'Interview Scheduled', 'Rejected', 'Passed', 'Joined'];

export default function AdminApplications() {
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
      { field: 'full_name', headerName: 'Applicant', flex: 1, minWidth: 160 },
      { field: 'student_id', headerName: 'Student ID', flex: 0.8, minWidth: 130 },
      { field: 'instrument_interest', headerName: 'Interest', flex: 0.9, minWidth: 140 },
      { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 190 },
      {
        field: 'status',
        headerName: 'Status',
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
                {status}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      {
        field: 'created_at',
        headerName: 'Submitted',
        flex: 1,
        minWidth: 180,
        valueFormatter: (value) => formatDateTime(value),
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 120,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="view"
            icon={<VisibilityRoundedIcon />}
            label="View"
            onClick={() => setViewTarget(row)}
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
            Manage Applications
          </Typography>
          <Typography color="text.secondary">
            View join requests and update interview status.
          </Typography>
        </Box>
        <Tooltip title="Refresh applications">
          <IconButton onClick={load} aria-label="Refresh applications">
            <RefreshRoundedIcon />
          </IconButton>
        </Tooltip>
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

      <Dialog open={Boolean(viewTarget)} onClose={() => setViewTarget(null)} maxWidth="md" fullWidth>
        <DialogTitle>Application details</DialogTitle>
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
                  ['Student ID', viewTarget.student_id],
                  ['Email', viewTarget.email],
                  ['Phone', viewTarget.phone],
                  ['Instrument interest', viewTarget.instrument_interest],
                  ['Available time', viewTarget.available_time],
                  ['Portfolio URL', viewTarget.portfolio_url || 'Not provided'],
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
                  Music experience
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewTarget.experience}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Self introduction
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewTarget.introduction}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Additional message
                </Typography>
                <Typography sx={{ whiteSpace: 'pre-wrap' }}>{viewTarget.message || 'None'}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewTarget(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete application?"
        message={`Delete the application from ${deleteTarget?.full_name || 'this applicant'}?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteApplication}
      />
    </Stack>
  );
}
