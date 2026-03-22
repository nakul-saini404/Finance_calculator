import { Box, Typography } from "@mui/material";

const PAGE_TITLES = {
  home: 'Calculators',
  emi:  'EMI Calculator',
  gst:  'GST Calculator',
  tax:  'Income Tax',
  sip:  'SIP Calculator',
  loan: 'Loan Eligibility',
};

export function Topbar({ activePage }) {
  return (
    <Box sx={{
      height: 56, background: '#0f1018',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', px: 3.5, gap: 1.5,
      flexShrink: 0, position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 13 }}>
        {/* <Typography sx={{ fontSize: 13, color: 'text.disabled' }}>FinVault</Typography>
        <Typography sx={{ fontSize: 13, color: 'text.disabled', mx: 0.25 }}>/</Typography> */}
        <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary' }}>
          {PAGE_TITLES[activePage] || activePage}
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }} />

      {/* <Box sx={{
        fontSize: 11, px: 1.5, py: 0.5, borderRadius: 5, fontWeight: 600,
        background: 'rgba(52,211,153,0.12)', color: '#34d399',
        border: '1px solid rgba(52,211,153,0.2)',
      }}>
        Live Results
      </Box> */}
    </Box>
  );
}