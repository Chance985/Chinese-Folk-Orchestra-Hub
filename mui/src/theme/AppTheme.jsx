import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';

const ink = '#201718';
const paper = '#fff8eb';
const cinnabar = '#9b1c20';
const gold = '#b88324';
const jade = '#1f6f61';
const clay = '#7a5a47';

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
      secondary: '#675b52',
    },
    divider: alpha('#6f1116', 0.16),
  },
  typography: {
    fontFamily:
      '"Outfit", "Noto Sans SC", "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
        '@keyframes cfFadeUp': {
          from: {
            opacity: 0,
            transform: 'translate3d(0, 16px, 0)',
          },
          to: {
            opacity: 1,
            transform: 'translate3d(0, 0, 0)',
          },
        },
        '@keyframes cfBreath': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: 0.72,
          },
          '50%': {
            transform: 'scale(1.16)',
            opacity: 1,
          },
        },
        '@keyframes cfShimmer': {
          from: {
            transform: 'translateX(-110%)',
          },
          to: {
            transform: 'translateX(110%)',
          },
        },
        '@keyframes cfImageDrift': {
          from: {
            transform: 'scale(1.055) translate3d(-0.8%, 0, 0)',
          },
          to: {
            transform: 'scale(1.03) translate3d(0, 0, 0)',
          },
        },
        body: {
          minWidth: 320,
          background:
            'linear-gradient(180deg, #fbf2e3 0%, #fff8eb 42%, #fbf2e3 100%)',
          color: ink,
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
          transition:
            'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), background-color 240ms cubic-bezier(0.16, 1, 0.3, 1), border-color 240ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:active': {
            transform: 'translateY(1px) scale(0.99)',
          },
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
          boxShadow: '0 14px 42px rgba(54, 20, 16, 0.075)',
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
          transition:
            'background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&.Mui-focused': {
            backgroundColor: '#fffaf0',
            boxShadow: '0 0 0 3px rgba(155, 28, 32, 0.08)',
          },
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
  clay,
};

export default function AppTheme({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
