import Chip from '@mui/material/Chip';

const statusColor = {
  Pending: 'warning',
  'Interview Scheduled': 'info',
  Rejected: 'error',
  Passed: 'success',
  Joined: 'success',
  public: 'success',
  members: 'secondary',
  admin: 'primary',
};

export default function StatusChip({ value }) {
  return (
    <Chip
      size="small"
      label={value}
      color={statusColor[value] || 'default'}
      variant={value === 'public' ? 'filled' : 'outlined'}
    />
  );
}
