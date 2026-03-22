import { Paper, Typography } from '@mui/material';

export function SectionCard({ title, subtitle, accent = '#34d399', children, sx = {} }) {
  return (
    <Paper sx={{ p: 3.25, ...sx }}>
      {title && (
        <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ color: accent }}>◈</span> {title}
        </Typography>
      )}
      {subtitle && (
        <Typography sx={{ fontSize: 12.5, color: 'text.disabled', mb: 2.5 }}>{subtitle}</Typography>
      )}
      {children}
    </Paper>
  );
}