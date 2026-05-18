import Chip from '@mui/material/Chip';
import { useLanguage } from '../i18n/LanguageContext.jsx';

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

const statusLabel = {
  zh: {
    Pending: '待处理',
    'Interview Scheduled': '已安排面试',
    Rejected: '未通过',
    Passed: '已通过',
    Joined: '已加入',
    public: '公开',
    members: '成员可见',
    admin: '管理员可见',
  },
};

export default function StatusChip({ value }) {
  const { language } = useLanguage();
  const label = statusLabel[language]?.[value] || value;

  return (
    <Chip
      size="small"
      label={label}
      color={statusColor[value] || 'default'}
      variant={value === 'public' ? 'filled' : 'outlined'}
    />
  );
}
