import { Box, Typography } from "@mui/material";

export function DonutChart({ principalPct, principalColor = '#60a5fa', interestColor = '#fbbf24', centerLabel, centerSub }) {
  const C = 345;
  const pDash = C * (principalPct / 100);
  const iDash = C - pDash;

  return (
    <Box sx={{ position: 'relative', width: 150, height: 150, mx: 'auto', mb: 1.75 }}>
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="75" cy="75" r="55" fill="none" stroke="#1a1d2e" strokeWidth="18" />
        <circle cx="75" cy="75" r="55" fill="none" stroke={principalColor} strokeWidth="18"
          strokeLinecap="round" strokeDasharray={`${pDash} ${C}`} />
        <circle cx="75" cy="75" r="55" fill="none" stroke={interestColor} strokeWidth="18"
          strokeLinecap="round" strokeDasharray={`${iDash} ${C}`}
          strokeDashoffset={-pDash} />
      </svg>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700 }}>{centerLabel}</Typography>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', mt: 0.125 }}>{centerSub}</Typography>
      </Box>
    </Box>
  );
}
