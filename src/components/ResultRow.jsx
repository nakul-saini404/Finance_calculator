import { Box, Typography } from "@mui/material";

export function ResultRow({ label, value, valueColor, noBorder = false }) {
  return (
    <Box sx={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      py: 1.1, borderBottom: noBorder ? 'none' : '1px solid rgba(255,255,255,0.06)',
    }}>
      <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{label}</Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, fontFamily: "'Syne', sans-serif", color: valueColor || 'text.primary' }}>
        {value}
      </Typography>
    </Box>
  );
}