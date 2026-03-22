import { Box } from "@mui/material";

export function AmortBarChart({ data, principalColor = '#60a5fa', interestColor = '#fbbf24', height = 90 }) {
  const maxV = Math.max(...data.map((d) => d.principal + d.interest), 1);
  const take = data.slice(0, 24);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height }}>
      {take.map((d, i) => (
        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
          <Box sx={{ width: '100%', height: `${(d.interest / maxV) * 100}%`, background: interestColor, borderRadius: '3px 3px 0 0', transition: 'height .5s ease', minHeight: d.interest > 0 ? 2 : 0 }} />
          <Box sx={{ width: '100%', height: `${(d.principal / maxV) * 100}%`, background: principalColor, minHeight: d.principal > 0 ? 2 : 0 }} />
        </Box>
      ))}
    </Box>
  );
}