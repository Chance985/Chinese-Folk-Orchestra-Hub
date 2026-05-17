import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';

const ink = '#201718';
const paper = '#fff8eb';
const cinnabar = '#9b1c20';
const gold = '#b88324';
const jade = '#1f6f61';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: cinnabar,
      dark: '#6f1116',
      light: '#c54843',
      contrastText: '#fffaf0',
    },
    secondary: {
      main: gold,
      dark: '#7d5518',
      light: '#e1b15f',
      contrastText: ink,
    },
    success: {
      main: jade,
    },
    background: {
      default: '#fbf2e3',
      paper,
    },
    text: {
      primary: ink,
      secondary: '#6f5f56',
    },
    divider: alpha('#6f1116', 0.16),
  },
  typography: {
    fontFamily:
      'Inter, "Noto Sans SC", "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
      lineHeight: 1.08,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 760,
      lineHeight: 1.14,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 720,
      lineHeight: 1.18,
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 700,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 8px 24px rgba(54, 20, 16, 0.08)',
    '0 14px 42px rgba(54, 20, 16, 0.12)',
    ...Array(22).fill('0 18px 52px rgba(54, 20, 16, 0.14)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
          background:
            'radial-gradient(circle at 10% 0%, rgba(184, 131, 36, 0.16), transparent 32rem), linear-gradient(180deg, #fbf2e3 0%, #fff8eb 44%, #fbf2e3 100%)',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 40,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid rgba(111, 17, 22, 0.13)',
          backgroundImage:
            'linear-gradient(180deg, rgba(255, 250, 240, 0.96), rgba(255, 248, 235, 0.9))',
          boxShadow: '0 12px 36px rgba(54, 20, 16, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: 'rgba(255, 250, 240, 0.8)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 650,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: paper,
        },
        columnHeaders: {
          backgroundColor: '#f5e4ca',
        },
      },
    },
  },
});

export const brandTokens = {
  ink,
  paper,
  cinnabar,
  gold,
  jade,
};

export default function AppTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
