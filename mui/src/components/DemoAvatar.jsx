import Avatar from '@mui/material/Avatar';
import { initials } from '../utils/format.js';

const gradients = [
  'linear-gradient(135deg, #9b1c20, #b88324)',
  'linear-gradient(135deg, #201718, #9b1c20)',
  'linear-gradient(135deg, #1f6f61, #b88324)',
  'linear-gradient(135deg, #633019, #c54843)',
];

export default function DemoAvatar({ name, src, size = 72 }) {
  return (
    <Avatar
      alt={name}
      src={src || undefined}
      sx={{
        width: size,
        height: size,
        fontSize: Math.max(18, size / 3.2),
        fontWeight: 800,
        color: '#fff8eb',
        bgcolor: 'primary.main',
        background: src ? undefined : gradients[String(name || '').length % gradients.length],
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
