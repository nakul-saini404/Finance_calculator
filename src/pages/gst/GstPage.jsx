import { Box, Typography, Select, MenuItem, TextField, InputAdornment, Divider } from '@mui/material';
import { useGstCalc } from '../../hooks/useGstCalc';
import { GST_RATES, GST_COMMON_ITEMS } from '../../constants/constants';
import { fmtR } from '../../utils/format';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';
import { SegControl } from '../../components/SegControl';
import { useState } from 'react';

export function GstPage() {
  const [gstRate,    setGstRate]    = useState(18);
  const [customRate, setCustomRate] = useState(0);
  const [direction,  setDirection]  = useState('add');
  const [txnType,    setTxnType]    = useState('intra');
  const [amount,     setAmount]     = useState(10000);

  const activeRate = gstRate === 'custom' ? customRate : gstRate;
  const results = useGstCalc({ amount, rate: activeRate, direction, txnType });

  const dirOptions = [
    { value: 'add',    label: '➕ Add GST to Price' },
    { value: 'remove', label: '➖ Extract GST from Price' },
  ];

  return (
    <Box sx={{ p: '30px 28px', overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader icon="🧾" title="GST Calculator" subtitle="Add / Remove GST · CGST · SGST · IGST · All rates — India 🇮🇳" iconBg="rgba(251,191,36,0.12)" />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: 2.25, alignItems: 'start' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SectionCard title="GST Settings" subtitle="Select rate, enter amount, choose transaction type" accent="#fbbf24">
            {/* Rate Grid */}
            <Typography sx={{ fontSize: 11.5, fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1.25 }}>GST Rate</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mb: 2.25 }}>
              {GST_RATES.map((r) => (
                <Box
                  key={r.id}
                  onClick={() => setGstRate(r.rate)}
                  sx={{
                    background: gstRate === r.rate ? 'rgba(251,191,36,0.12)' : '#141520',
                    border: `1px solid ${gstRate === r.rate ? '#fbbf24' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 2.25, p: 1.375, textAlign: 'center', cursor: 'pointer', transition: 'all .15s',
                  }}
                >
                  <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: gstRate === r.rate ? '#fbbf24' : 'text.primary' }}>
                    {r.rate === 'custom' ? '✏️' : `${r.rate}%`}
                  </Typography>
                  <Typography sx={{ fontSize: 10, color: gstRate === r.rate ? '#fbbf24' : 'text.disabled', mt: 0.25 }}>{r.label}</Typography>
                </Box>
              ))}
            </Box>

            {gstRate === 'custom' && (
              <TextField type="number" label="Custom Rate %" value={customRate} onChange={(e) => setCustomRate(Number(e.target.value))} size="small" fullWidth sx={{ mb: 2 }}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
            )}

            <SegControl options={dirOptions} value={direction} onChange={setDirection} />

            {/* Amount */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: 11.5, fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  {direction === 'add' ? 'Amount (Excl. GST)' : 'Amount (Incl. GST)'}
                </Typography>
                <Box sx={{ background: '#1a1d2e', px: 1.25, py: 0.25, borderRadius: 1.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>₹{Number(amount).toLocaleString('en-IN')}</Typography>
                </Box>
              </Box>
              <TextField type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} size="small" fullWidth
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} />
            </Box>

            {/* Transaction Type */}
            <Select value={txnType} onChange={(e) => setTxnType(e.target.value)} size="small" fullWidth sx={{ mb: 2 }}>
              <MenuItem value="intra">🏙 Intra-State (Same State) — CGST + SGST</MenuItem>
              <MenuItem value="inter">🌐 Inter-State (Different State) — IGST</MenuItem>
            </Select>

            <Box sx={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 2.25, p: 1.25, fontSize: 12.5, color: 'text.secondary', lineHeight: 1.6 }}>
              ℹ️ Intra-state splits GST equally into CGST + SGST. Inter-state applies full IGST.
            </Box>
          </SectionCard>

          {/* Common Items */}
          <SectionCard title="Common Items Reference" accent="#fbbf24">
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75, mt: 1.75 }}>
              {GST_COMMON_ITEMS.map((item) => (
                <Box key={item.label} onClick={() => { setGstRate(item.rate); }}
                  sx={{ px: 1.5, py: 1, background: '#141520', borderRadius: 2, cursor: 'pointer', fontSize: 12.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background .15s', '&:hover': { background: '#1a1d2e' } }}>
                  <span>{item.label}</span>
                  <Typography sx={{ fontWeight: 600, fontSize: 12.5, color: item.rate === 0 ? '#34d399' : item.rate <= 12 ? '#60a5fa' : item.rate <= 18 ? '#fbbf24' : '#f87171' }}>
                    {item.rate}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Box>

        {/* RIGHT */}
        <Box sx={{ position: 'sticky', top: 20 }}>
          <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 2.75 }}>
            <ResultCard label="GST Amount" value={fmtR(results.gstAmt)} color="#fbbf24" bgColor="rgba(251,191,36,0.06)" borderColor="rgba(251,191,36,0.18)" />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25, mb: 2 }}>
              {[
                { label: 'Base Amount',        value: fmtR(results.base),   color: 'text.primary' },
                { label: `GST (${activeRate}%)`, value: fmtR(results.gstAmt), color: '#fbbf24' },
              ].map((tile) => (
                <Box key={tile.label} sx={{ background: '#141520', borderRadius: 2.5, p: 1.75 }}>
                  <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.75 }}>{tile.label}</Typography>
                  <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: tile.color }}>{tile.value}</Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 1.5 }} />
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1.25 }}>
              {txnType === 'intra' ? 'CGST + SGST Split' : 'IGST'}
            </Typography>

            {txnType === 'intra' ? (
              <>
                <ResultRow label={`CGST (${results.cgstRate}%)`} value={fmtR(results.cgst)} valueColor="#60a5fa" />
                <ResultRow label={`SGST (${results.sgstRate}%)`} value={fmtR(results.sgst)} valueColor="#c084fc" />
              </>
            ) : (
              <ResultRow label={`IGST (${results.igstRate}%)`} value={fmtR(results.igst)} valueColor="#fbbf24" />
            )}

            <Divider sx={{ my: 1.5 }} />
            <ResultRow label="Total (incl. GST)"  value={fmtR(results.total)}           valueColor="#34d399" />
            <ResultRow label="Effective Rate"      value={`${results.effectiveRate}%`}   noBorder />

            {/* Visual bar */}
            <Box sx={{ mt: 1.75 }}>
              <Typography sx={{ fontSize: 11, color: 'text.disabled', mb: 0.75 }}>Amount Breakdown</Typography>
              <Box sx={{ height: 8, background: '#1a1d2e', borderRadius: 1, overflow: 'hidden', display: 'flex' }}>
                <Box sx={{ width: `${results.basePct}%`, background: '#60a5fa', height: '100%', borderRadius: '4px 0 0 4px', transition: 'width .3s' }} />
                <Box sx={{ width: `${100 - results.basePct}%`, background: '#fbbf24', height: '100%', borderRadius: '0 4px 4px 0', transition: 'width .3s' }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
