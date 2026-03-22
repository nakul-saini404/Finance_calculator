import { Box, Typography } from "@mui/material";

export function LegendRow({ items }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 1.25 }}>
      {items.map((item) => (
        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.625 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '2px', background: item.color }} />
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}