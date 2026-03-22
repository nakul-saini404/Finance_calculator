import { Box } from "@mui/material";

export function SipBarChart({ data, investedColor = '#60a5fa', returnsColor = '#c084fc', height = 80 }) {
  const maxV = Math.max(...data.map((d) => d.tot), 1);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height }}>
      {data.map((d, i) => {
        const totalH = (d.tot / maxV) * 100;
        const invH   = (d.inv / maxV) * 100;
        const retH   = totalH - invH;
        return (
          <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <Box sx={{ width: '100%', height: `${retH}%`, background: returnsColor, opacity: 0.85, borderRadius: '3px 3px 0 0', minHeight: retH > 0 ? 2 : 0 }} />
            <Box sx={{ width: '100%', height: `${invH}%`, background: investedColor, minHeight: invH > 0 ? 2 : 0 }} />
          </Box>
        );
      })}
    </Box>
  );
}