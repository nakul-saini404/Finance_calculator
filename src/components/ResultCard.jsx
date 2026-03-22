import { Box, Typography } from "@mui/material";

export function ResultCard({ label, value, color = '#34d399', bgColor, borderColor }) {
  return (
    <Box sx={{
      borderRadius: 3, p: 2.25, mb: 2,
      background:   bgColor    || `rgba(52,211,153,0.06)`,
      border:       `1px solid ${borderColor || 'rgba(52,211,153,0.15)'}`,
    }}>
      <Typography sx={{ fontSize: 10.5, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.2px', mb: 0.75 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', color, lineHeight: 1 }}>
        {value}
      </Typography>
    </Box>
  );
}