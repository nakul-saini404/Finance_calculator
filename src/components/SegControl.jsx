import { Box } from "@mui/material";

export function SegControl({ options, value, onChange, sx = {} }) {
  return (
    <Box sx={{ display: 'flex', background: '#141520', borderRadius: 2.5, p: 0.375, mb: 2.5, ...sx }}>
      {options.map((opt) => (
        <Box
          key={opt.value}
          onClick={() => onChange(opt.value)}
          sx={{
            flex: 1, py: 1, px: 1.25, borderRadius: 2, textAlign: 'center',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all .15s',
            color: value === opt.value ? 'text.primary' : 'text.disabled',
            background: value === opt.value ? '#0f1018' : 'transparent',
            boxShadow: value === opt.value ? '0 1px 8px rgba(0,0,0,0.5)' : 'none',
            userSelect: 'none',
            '&:hover': { color: value !== opt.value ? 'text.secondary' : undefined },
          }}
        >
          {opt.label}
        </Box>
      ))}
    </Box>
  );
}