import { Box, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { useFdCalc } from '../../hooks/useFdCalc';
import { fmt, fmtR } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';

/* ── tiny bar chart (no recharts dep needed, pure SVG) ── */
function MiniBarChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 80, mt: 1 }}>
      {data.map((d, i) => {
        const pct = (d.value / maxVal) * 100;
        const invPct = (d.invested / maxVal) * 100;
        return (
          <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <Box sx={{ width: '100%', height: 72, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '3px 3px 0 0', overflow: 'hidden', background: '#1a1d2e' }}>
              <Box sx={{ width: '100%', height: `${pct}%`, background: 'linear-gradient(180deg, #f59e0b, #fbbf24)', borderRadius: '2px 2px 0 0', position: 'relative' }}>
                <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${(invPct / pct) * 100}%`, background: '#60a5fa', opacity: 0.7 }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 8.5, color: 'text.disabled' }}>{d.year}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}

/* ── comparison table row ── */
function CompRow({ label, maturity, gain, highlight }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      px: 1.5, py: 1, borderRadius: 2,
      background: highlight ? 'rgba(251,191,36,0.08)' : '#141520',
      border: highlight ? '1px solid rgba(251,191,36,0.2)' : '1px solid transparent',
      mb: 0.75,
    }}>
      <Typography sx={{ fontSize: 12, color: highlight ? '#fbbf24' : 'text.secondary', fontWeight: highlight ? 600 : 400 }}>{label}</Typography>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: highlight ? '#fbbf24' : 'text.primary', fontFamily: "'Syne', sans-serif" }}>{fmt(maturity)}</Typography>
        <Typography sx={{ fontSize: 10, color: '#34d399' }}>+{fmt(gain)}</Typography>
      </Box>
    </Box>
  );
}

const COMPOUND_OPTS = [
  { value: 1,   label: 'Annual'     },
  { value: 2,   label: 'Half-Yearly'},
  { value: 4,   label: 'Quarterly'  },
  { value: 12,  label: 'Monthly'    },
  { value: 365, label: 'Daily'      },
];

export function FdPage() {
  const [type,          setType]          = useState('fd');
  const [principal,     setPrincipal]     = useState(500000);
  const [monthlyDeposit,setMonthlyDeposit]= useState(10000);
  const [rate,          setRate]          = useState(7);
  const [years,         setYears]         = useState(5);
  const [compoundFreq,  setCompoundFreq]  = useState(4);

  const results = useFdCalc({ type, principal, monthlyDeposit, rate, years, compoundFreq });

  const typeOpts = [
    { value: 'fd', label: 'Fixed Deposit' },
    { value: 'rd', label: 'Recurring Deposit' },
  ];

  const handleExport = () => {
    const rows = [
      ['Type', type.toUpperCase()],
      ['Principal / Monthly', type === 'fd' ? fmt(principal) : fmt(monthlyDeposit)],
      ['Rate', `${rate}%`],
      ['Tenure', `${years} years`],
      ['Maturity Value', fmt(results.maturity)],
      ['Total Invested', fmt(results.invested)],
      ['Interest Earned', fmt(results.interest)],
      ['Effective Rate', `${results.effectiveRate}%`],
      ['Gain %', `${results.gainPct}%`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fd_rd_results.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' }, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader icon="🏦" title="FD / RD Calculator" subtitle="Fixed & Recurring Deposit · Compound frequency · Comparison mode" iconBg="rgba(251,191,36,0.12)" />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 370px' }, gap: { xs: 2, md: 2.25 }, alignItems: 'start' }}>

        {/* LEFT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, md: 0 } }}>
          <SectionCard title="Deposit Details" subtitle="Configure your FD or RD parameters" accent="#fbbf24">

            {/* Type toggle */}
            <Box sx={{ display: 'flex', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2.5, overflow: 'hidden', mb: 2.25 }}>
              {typeOpts.map(opt => (
                <Box key={opt.value} onClick={() => setType(opt.value)} sx={{
                  flex: 1, py: 1.25, textAlign: 'center', fontSize: 13.5, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                  color: type === opt.value ? '#fbbf24' : 'text.disabled',
                  background: type === opt.value ? '#141520' : 'transparent',
                }}>{opt.label}</Box>
              ))}
            </Box>

            {type === 'fd'
              ? <DualSlider label="Principal Amount" value={principal} onChange={setPrincipal} min={10000} max={10000000} step={10000} prefix="₹" displayValue={fmt(principal)} />
              : <DualSlider label="Monthly Deposit"  value={monthlyDeposit} onChange={setMonthlyDeposit} min={500} max={200000} step={500} prefix="₹" displayValue={fmt(monthlyDeposit)} />
            }
            <DualSlider label="Interest Rate (p.a.)" value={rate}  onChange={setRate}  min={3} max={15} step={0.1} suffix="%" displayValue={`${rate}%`} />
            <DualSlider label="Tenure"               value={years} onChange={setYears} min={1} max={10} step={1}   suffix="Yrs" displayValue={`${years} Yrs`} sx={{ mb: 0 }} />

            {/* Compound frequency — FD only */}
            {type === 'fd' && (
              <Box sx={{ mt: 2.25 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1.25 }}>Compounding Frequency</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {COMPOUND_OPTS.map(o => (
                    <Box key={o.value} onClick={() => setCompoundFreq(o.value)} sx={{
                      px: 1.5, py: 0.75, borderRadius: 2, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                      background: compoundFreq === o.value ? 'rgba(251,191,36,0.15)' : '#141520',
                      border: `1px solid ${compoundFreq === o.value ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: compoundFreq === o.value ? '#fbbf24' : 'text.disabled',
                    }}>{o.label}</Box>
                  ))}
                </Box>
              </Box>
            )}
          </SectionCard>

          {/* Comparison table */}
          {type === 'fd' && (
            <SectionCard title="Compounding Comparison" subtitle="Same deposit — different frequencies" accent="#fbbf24">
              <Box sx={{ mt: 1.5 }}>
                {results.comparisonData.map((row, i) => (
                  <CompRow key={i} {...row} highlight={row.label === COMPOUND_OPTS.find(o => o.value === compoundFreq)?.label} />
                ))}
              </Box>
            </SectionCard>
          )}
        </Box>

        {/* RIGHT */}
        <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 20 }, order: { xs: 1, md: 0 } }}>
          <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: { xs: 2, sm: 2.75 } }}>

            <ResultCard label="Maturity Value" value={fmt(results.maturity)} color="#fbbf24" bgColor="rgba(251,191,36,0.06)" borderColor="rgba(251,191,36,0.18)" />

            <Box sx={{ display: { xs: 'grid', sm: 'block' }, gridTemplateColumns: { xs: '1fr 1fr', sm: undefined } }}>
              <ResultRow label="Total Invested"  value={fmt(results.invested)} valueColor="#60a5fa" />
              <ResultRow label="Interest Earned" value={fmt(results.interest)} valueColor="#34d399" />
              <ResultRow label="Gain"            value={`+${results.gainPct}%`} valueColor="#c084fc" />
              <ResultRow label="Effective Rate"  value={`${results.effectiveRate}%`} valueColor="#fbbf24" noBorder />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 0.5 }}>Growth Chart</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
              {[{ color: '#fbbf24', label: 'Maturity' }, { color: '#60a5fa', label: 'Invested' }].map(l => (
                <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>{l.label}</Typography>
                </Box>
              ))}
            </Box>
            <MiniBarChart data={results.chartData} />

            <Divider sx={{ my: 2 }} />

            {/* Split visual */}
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1 }}>Invested vs Interest</Typography>
            <Box sx={{ height: 8, borderRadius: 1, overflow: 'hidden', display: 'flex', mb: 0.75 }}>
              <Box sx={{ width: `${(results.invested / results.maturity) * 100}%`, background: '#60a5fa', transition: 'width .4s' }} />
              <Box sx={{ flex: 1, background: '#fbbf24' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: 10, color: '#60a5fa' }}>Principal {((results.invested / results.maturity) * 100).toFixed(0)}%</Typography>
              <Typography sx={{ fontSize: 10, color: '#fbbf24' }}>Interest {((results.interest / results.maturity) * 100).toFixed(0)}%</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Export button */}
            <Box onClick={handleExport} sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              py: 1.25, borderRadius: 2.25, cursor: 'pointer', transition: 'all .15s',
              border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.06)',
              '&:hover': { background: 'rgba(251,191,36,0.12)' },
            }}>
              <Typography sx={{ fontSize: 12.5, color: '#fbbf24', fontWeight: 600 }}>📥 Export Results (CSV)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}