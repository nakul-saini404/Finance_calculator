import { Box, Typography } from "@mui/material";

export function PageHeader({ icon, title, subtitle, iconBg }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, mb: 3.5 }}>
      <Box sx={{ width: 48, height: 48, borderRadius: 3.25, background: iconBg || 'rgba(52,211,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 23, fontWeight: 800, letterSpacing: '-0.5px' }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.disabled', mt: 0.375 }}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}