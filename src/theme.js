import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#09090f',
      paper: '#0f1018',
    },
    primary:   { main: '#34d399' },
    secondary: { main: '#60a5fa' },
    warning:   { main: '#fbbf24' },
    error:     { main: '#f87171' },
    info:      { main: '#c084fc' },
    success:   { main: '#2dd4bf' },
    text: {
      primary:   '#eef0fa',
      secondary: '#8b8fa8',
      disabled:  '#4e5168',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    h1: { fontFamily: "'Syne', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
    h4: { fontFamily: "'Syne', sans-serif", fontWeight: 700 },
    h5: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Syne', sans-serif", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0f1018',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#141520',
          borderRadius: 9,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.18)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#34d399',
          },
        },
        notchedOutline: { borderColor: 'rgba(255,255,255,0.12)' },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: { color: '#34d399' },
        track: { height: 4, borderRadius: 2 },
        rail:  { height: 4, borderRadius: 2, backgroundColor: '#1a1d2e' },
        thumb: {
          width: 17, height: 17,
          border: '2.5px solid #09090f',
          '&:hover': { boxShadow: '0 0 0 8px rgba(52,211,153,0.16)' },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#4e5168',
          borderColor: 'rgba(255,255,255,0.12)',
          borderRadius: '8px !important',
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            color: '#eef0fa',
            backgroundColor: '#0f1018',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#8b8fa8' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 9,
          fontFamily: "'DM Sans', sans-serif",
        },
        containedPrimary: {
          backgroundColor: '#34d399',
          color: '#09090f',
          '&:hover': { backgroundColor: '#4ade80' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: 'rgba(255,255,255,0.06)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 9 },
      },
    },
  },
});

export default theme;