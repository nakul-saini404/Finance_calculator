import { useState } from 'react';
import { Box, Typography, Button, Divider , useMediaQuery} from '@mui/material';
import { useEmiCalc } from '../../hooks/useEmiCalc';
import { EMI_PRESETS } from '../../constants/constants';
import { fmt, fmtR } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';
import { SegControl } from '../../components/SegControl';
import { AmortBarChart } from '../../components/AmortBarChart';
import { DonutChart } from '../../components/DonutChart';
import { LegendRow } from '../../components/LegendRow';

export function EmiPage() {
  const [loanType, setLoanType] = useState('home');
  const [amount,   setAmount]   = useState(2000000);
  const [rate,     setRate]     = useState(8.5);
  const [tenure,   setTenure]   = useState(20);

  const isMobile = useMediaQuery('(max-width:786px)');
  const results = useEmiCalc({ amount, rate, tenure });

  const handlePreset = (type) => {
    setLoanType(type);
    setAmount(EMI_PRESETS[type].amt);
    setRate(EMI_PRESETS[type].rate);
    setTenure(EMI_PRESETS[type].ten);
  };

  const segOptions = Object.entries(EMI_PRESETS).map(([key, p]) => ({ value: key, label: p.label }));

  return (
    <Box sx={{ p: isMobile ? '16px 14px' : '30px 28px', overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader
        icon="🏦"
        title="EMI Calculator"
        subtitle="Monthly installments · Amortization schedule · Total interest paid"
        iconBg="rgba(52,211,153,0.12)"
      />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 370px',
        gap: isMobile ? 1.5 : 2.25,
        alignItems: 'start',
      }}>
        {/* LEFT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 1.5 : 2 }}>

          {/* On mobile, show results panel FIRST (above inputs) */}
          {isMobile && (
            <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 2 }}>
              <ResultCard
                label="Monthly EMI"
                value={fmtR(results.emi)}
                color="#34d399"
                bgColor="rgba(52,211,153,0.06)"
                borderColor="rgba(52,211,153,0.15)"
              />

              {/* Summary tiles row */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 1.5 }}>
                {[
                  { label: 'Principal',  value: fmt(amount),           color: '#60a5fa' },
                  { label: 'Interest',   value: fmt(results.interest),  color: '#fbbf24' },
                  { label: 'Total',      value: fmt(results.total),     color: '#34d399' },
                ].map((tile) => (
                  <Box key={tile.label} sx={{ background: '#141520', borderRadius: 2, p: 1.25, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 9.5, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
                      {tile.label}
                    </Typography>
                    <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: tile.color }}>
                      {tile.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Donut + legend side by side on mobile */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexShrink: 0 }}>
                  <DonutChart principalPct={results.principalPct} centerLabel={`${results.principalPct}%`} centerSub="Principal" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <ResultRow label="Total EMIs"      value={`${results.n} EMIs`} />
                  <ResultRow label="Break-even Year" value={`Year ${results.beYear}`} valueColor="#34d399" noBorder />
                  <LegendRow items={[{ label: 'Principal', color: '#60a5fa' }, { label: 'Interest', color: '#fbbf24' }]} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1.25, mt: 1.75 }}>
                <Button variant="contained" sx={{ flex: 1 }}>📥 Get Schedule</Button>
                <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.secondary' }}>🔄</Button>
              </Box>
            </Box>
          )}

          <SectionCard title="Loan Details" subtitle="Select loan type and adjust parameters" accent="#34d399">
            <SegControl options={segOptions} value={loanType} onChange={handlePreset} />
            <DualSlider label="Loan Amount"          value={amount}  onChange={setAmount}  min={100000}  max={10000000} step={50000} prefix="₹"     displayValue={`₹${(amount/100000).toFixed(1)}L`} />
            <DualSlider label="Interest Rate (p.a.)" value={rate}    onChange={setRate}    min={5}       max={24}       step={0.1}  suffix="% p.a." displayValue={`${rate}%`} />
            <DualSlider label="Loan Tenure"          value={tenure}  onChange={setTenure}  min={1}       max={30}       step={1}    suffix="Yrs"    displayValue={`${tenure} Years`} sx={{ mb: 0 }} />
          </SectionCard>

          <SectionCard title="Year-wise Amortization" subtitle="Principal vs Interest breakup per year" accent="#60a5fa">
            <AmortBarChart data={results.yearlyAmort} />
            <LegendRow items={[{ label: 'Principal', color: '#60a5fa' }, { label: 'Interest', color: '#fbbf24' }]} />
          </SectionCard>
        </Box>

        {/* RIGHT — desktop only */}
        {!isMobile && (
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 2.75 }}>
              <ResultCard
                label="Monthly EMI"
                value={fmtR(results.emi)}
                color="#34d399"
                bgColor="rgba(52,211,153,0.06)"
                borderColor="rgba(52,211,153,0.15)"
              />

              <DonutChart principalPct={results.principalPct} centerLabel={`${results.principalPct}%`} centerSub="Principal" />
              <LegendRow items={[{ label: 'Principal', color: '#60a5fa' }, { label: 'Interest', color: '#fbbf24' }]} />

              <Divider sx={{ my: 2 }} />
              <ResultRow label="Principal Amount" value={fmt(amount)}           valueColor="#60a5fa" />
              <ResultRow label="Total Interest"   value={fmt(results.interest)} valueColor="#fbbf24" />
              <ResultRow label="Total Amount"     value={fmt(results.total)} />
              <ResultRow label="Total EMIs"       value={`${results.n} EMIs`} />
              <ResultRow label="Break-even Year"  value={`Year ${results.beYear}`} valueColor="#34d399" noBorder />

              <Box sx={{ display: 'flex', gap: 1.25, mt: 2 }}>
                <Button variant="contained" sx={{ flex: 1 }}>📥 Get Schedule</Button>
                <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.secondary' }}>🔄</Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

