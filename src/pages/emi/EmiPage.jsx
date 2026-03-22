import { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
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

  const results = useEmiCalc({ amount, rate, tenure });

  const handlePreset = (type) => {
    setLoanType(type);
    setAmount(EMI_PRESETS[type].amt);
    setRate(EMI_PRESETS[type].rate);
    setTenure(EMI_PRESETS[type].ten);
  };

  const segOptions = Object.entries(EMI_PRESETS).map(([key, p]) => ({ value: key, label: p.label }));

  return (
    <Box sx={{ p: '30px 28px', overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader icon="🏦" title="EMI Calculator" subtitle="Monthly installments · Amortization schedule · Total interest paid" iconBg="rgba(52,211,153,0.12)" />

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 370px', gap: 2.25, alignItems: 'start' }}>
        {/* LEFT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <SectionCard title="Loan Details" subtitle="Select loan type and adjust parameters" accent="#34d399">
            <SegControl options={segOptions} value={loanType} onChange={handlePreset} />
            <DualSlider label="Loan Amount" value={amount} onChange={setAmount} min={100000} max={10000000} step={50000} prefix="₹" displayValue={`₹${(amount/100000).toFixed(1)}L`} />
            <DualSlider label="Interest Rate (p.a.)" value={rate} onChange={setRate} min={5} max={24} step={0.1} suffix="% p.a." displayValue={`${rate}%`} />
            <DualSlider label="Loan Tenure" value={tenure} onChange={setTenure} min={1} max={30} step={1} suffix="Yrs" displayValue={`${tenure} Years`} sx={{ mb: 0 }} />
          </SectionCard>

          <SectionCard title="Year-wise Amortization" subtitle="Principal vs Interest breakup per year" accent="#60a5fa">
            <AmortBarChart data={results.yearlyAmort} />
            <LegendRow items={[{ label: 'Principal', color: '#60a5fa' }, { label: 'Interest', color: '#fbbf24' }]} />
          </SectionCard>
        </Box>

        {/* RIGHT */}
        <Box sx={{ position: 'sticky', top: 20 }}>
          <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 2.75 }}>
            <ResultCard label="Monthly EMI" value={fmtR(results.emi)} color="#34d399" bgColor="rgba(52,211,153,0.06)" borderColor="rgba(52,211,153,0.15)" />

            <DonutChart principalPct={results.principalPct} centerLabel={`${results.principalPct}%`} centerSub="Principal" />
            <LegendRow items={[{ label: 'Principal', color: '#60a5fa' }, { label: 'Interest', color: '#fbbf24' }]} />

            <Divider sx={{ my: 2 }} />
            <ResultRow label="Principal Amount" value={fmt(amount)}            valueColor="#60a5fa" />
            <ResultRow label="Total Interest"   value={fmt(results.interest)}  valueColor="#fbbf24" />
            <ResultRow label="Total Amount"     value={fmt(results.total)} />
            <ResultRow label="Total EMIs"       value={`${results.n} EMIs`} />
            <ResultRow label="Break-even Year"  value={`Year ${results.beYear}`} valueColor="#34d399" noBorder />

            <Box sx={{ display: 'flex', gap: 1.25, mt: 2 }}>
              <Button variant="contained" sx={{ flex: 1 }}>📥 Get Schedule</Button>
              <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.12)', color: 'text.secondary' }}>🔄</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

