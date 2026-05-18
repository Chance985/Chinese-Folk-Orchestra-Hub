import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onCancel,
  onConfirm,
}) {
  const { pick } = useLanguage();
  const resolvedConfirmLabel = confirmLabel || pick('Delete', '删除');

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{pick('Cancel', '取消')}</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          {resolvedConfirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
