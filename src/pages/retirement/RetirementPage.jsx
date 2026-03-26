import { Box, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { useRetirementCalc } from '../../hooks/useRetirementCalc';
import { fmt, fmtR } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';

/* ── stacked area-style bar chart ── */
function CorpusChart({ data }) {
  if (!data?.length) return null;
  const maxVal = Math.max(...data.map(d => d.total), 1);
  const step = Math.max(1, Math.floor(data.length / 8));
  const visible = data.filter((_, i) => i % step === 0 || i === data.length - 1);

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 80, mt: 1 }}>
      {visible.map((d, i) => {
        const totalPct = (d.total / maxVal) * 100;
        const savingsPct = (d.savings / d.total) * totalPct;
        const sipPct = totalPct - savingsPct;
        return (
          <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <Box sx={{ width: '100%', height: 72, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: '#1a1d2e', borderRadius: '3px 3px 0 0', overflow: 'hidden' }}>
              <Box sx={{ width: '100%', height: `${totalPct}%`, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Box sx={{ width: '100%', height: `${sipPct > 0 ? (sipPct / totalPct) * 100 : 0}%`, background: '#f97316' }} />
                <Box sx={{ width: '100%', flex: 1, background: '#34d399' }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 8, color: 'text.disabled' }}>{d.year}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}

/* ── readiness arc ── */
function ReadinessArc({ score, color }) {
  const deg = (score / 100) * 360;
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{
        width: { xs: 100, sm: 120 }, height: { xs: 100, sm: 120 }, borderRadius: '50%', mx: 'auto', mb: 1.5,
        background: `conic-gradient(${color} ${deg}deg, #1a1d2e ${deg}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .4s',
      }}>
        <Box sx={{
          width: { xs: 74, sm: 90 }, height: { xs: 74, sm: 90 }, borderRadius: '50%', background: '#0f1018',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: { xs: 22, sm: 26 }, fontWeight: 800, color, lineHeight: 1 }}>{score}</Typography>
          <Typography sx={{ fontSize: 9, color: 'text.disabled' }}>/ 100</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function getReadinessInfo(score) {
  if (score >= 90) return { label: 'Excellent — On Track!', color: '#34d399' };
  if (score >= 70) return { label: 'Good — Small Gap',      color: '#60a5fa' };
  if (score >= 50) return { label: 'Fair — Needs Boost',    color: '#fbbf24' };
  return              { label: 'Low — Act Now',             color: '#f87171' };
}

export function RetirementPage() {
  const [currentAge,     setCurrentAge]     = useState(30);
  const [retireAge,      setRetireAge]      = useState(60);
  const [lifeExp,        setLifeExp]        = useState(85);
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [inflation,      setInflation]      = useState(6);
  const [sipAmount,      setSipAmount]      = useState(15000);

  const results = useRetirementCalc({ currentAge, retireAge, lifeExp, monthlyExpense, currentSavings, expectedReturn, inflation, sipAmount });
  const info = getReadinessInfo(results.readiness);

  const handleExport = () => {
    const rows = [
      ['Current Age', currentAge],
      ['Retirement Age', retireAge],
      ['Life Expectancy', lifeExp],
      ['Monthly Expense (today)', fmt(monthlyExpense)],
      ['Monthly Expense (at retirement)', fmt(results.futureMonthlyExpense)],
      ['Corpus Needed', fmt(results.corpusNeeded)],
      ['Projected Corpus', fmt(results.totalCorpus)],
      ['Gap', fmt(results.gap)],
      ['Required Extra SIP', fmt(results.requiredSip)],
      ['Readiness Score', `${results.readiness}/100`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'retirement_plan.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' }, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader icon="🌅" title="Retirement Planner" subtitle="Corpus planning · Inflation adjusted · SIP gap analysis" iconBg="rgba(249,115,22,0.12)" />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 370px' }, gap: { xs: 2, md: 2.25 }, alignItems: 'start' }}>

        {/* LEFT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, md: 0 } }}>
          <SectionCard title="Personal Details" subtitle="Your age, retirement target and life expectancy" accent="#f97316">
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5, mb: 2 }}>
              {[
                { label: 'Current Age', value: currentAge, set: setCurrentAge, min: 18, max: 55, suffix: 'yrs' },
                { label: 'Retire At',   value: retireAge,  set: setRetireAge,  min: 40, max: 70, suffix: 'yrs' },
                { label: 'Life Exp.',   value: lifeExp,    set: setLifeExp,    min: 60, max: 100, suffix: 'yrs' },
              ].map(f => (
                <Box key={f.label}>
                  <Typography sx={{ fontSize: { xs: 9.5, sm: 11 }, fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1 }}>{f.label}</Typography>
                  <Box sx={{ position: 'relative' }}>
                    <input type="number" value={f.value} min={f.min} max={f.max} onChange={e => f.set(Number(e.target.value))}
                      style={{ width: '100%', boxSizing: 'border-box', background: '#141520', border: '1px solid rgba(255,255,255,0.12)', color: '#eef0fa', borderRadius: 9, padding: '10px 30px 10px 12px', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#4e5168' }}>{f.suffix}</span>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ background: '#141520', borderRadius: 2, px: 1.75, py: 1.25, mb: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box><Typography sx={{ fontSize: 10, color: 'text.disabled' }}>Years to retire</Typography><Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#f97316' }}>{results.yearsToRetire}</Typography></Box>
              <Box><Typography sx={{ fontSize: 10, color: 'text.disabled' }}>Years in retirement</Typography><Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, color: '#60a5fa' }}>{results.yearsInRetirement}</Typography></Box>
            </Box>
            <DualSlider label="Current Monthly Expenses" value={monthlyExpense} onChange={setMonthlyExpense} min={10000} max={500000} step={5000} prefix="₹" displayValue={fmt(monthlyExpense)} />
            <DualSlider label="Current Savings / Investments" value={currentSavings} onChange={setCurrentSavings} min={0} max={20000000} step={50000} prefix="₹" displayValue={fmt(currentSavings)} />
          </SectionCard>

          <SectionCard title="Returns & SIP" subtitle="Expected returns, inflation and your monthly SIP" accent="#f97316">
            <DualSlider label="Expected Annual Return" value={expectedReturn} onChange={setExpectedReturn} min={4} max={20} step={0.5} suffix="%" displayValue={`${expectedReturn}%`} />
            <DualSlider label="Inflation Rate"         value={inflation}      onChange={setInflation}      min={3} max={12} step={0.5} suffix="%" displayValue={`${inflation}%`} />
            <DualSlider label="Monthly SIP"            value={sipAmount}      onChange={setSipAmount}      min={0} max={200000} step={1000} prefix="₹" displayValue={fmt(sipAmount)} sx={{ mb: 0 }} />
          </SectionCard>

          {/* Corpus build-up chart */}
          <SectionCard title="Corpus Build-Up" subtitle="Savings growth + SIP over years" accent="#f97316">
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
              {[{ color: '#34d399', label: 'Savings' }, { color: '#f97316', label: 'SIP' }].map(l => (
                <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>{l.label}</Typography>
                </Box>
              ))}
            </Box>
            <CorpusChart data={results.chartData} />
          </SectionCard>
        </Box>

        {/* RIGHT */}
        <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 20 }, order: { xs: 1, md: 0 } }}>
          <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: { xs: 2, sm: 2.75 } }}>

            {/* Mobile: arc + summary side by side */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'stretch' }, gap: { xs: 2, sm: 0 }, mb: { xs: 1.5, sm: 0 } }}>
              <Box sx={{ flexShrink: 0 }}>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.2px', mb: 1.25, textAlign: 'center', display: { xs: 'none', sm: 'block' } }}>Readiness Score</Typography>
                <ReadinessArc score={results.readiness} color={info.color} />
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: info.color, textAlign: 'center', mb: { xs: 0, sm: 2 }, display: { xs: 'none', sm: 'block' } }}>{info.label}</Typography>
              </Box>
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.5 }}>Readiness</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: info.color, mb: 1 }}>{info.label}</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.25 }}>Corpus Needed</Typography>
                <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#f97316' }}>{fmt(results.corpusNeeded)}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <ResultCard label="Corpus Needed" value={fmt(results.corpusNeeded)} color="#f97316" bgColor="rgba(249,115,22,0.06)" borderColor="rgba(249,115,22,0.18)" />
            </Box>

            <Box sx={{ display: { xs: 'grid', sm: 'block' }, gridTemplateColumns: { xs: '1fr 1fr', sm: undefined } }}>
              <ResultRow label="Projected Corpus"    value={fmt(results.totalCorpus)}         valueColor="#34d399" />
              <ResultRow label="Savings Grown"       value={fmt(results.savingsGrown)}         valueColor="#60a5fa" />
              <ResultRow label="SIP Corpus"          value={fmt(results.sipCorpus)}            valueColor="#c084fc" />
              <ResultRow label="Future Monthly Exp." value={`${fmtR(results.futureMonthlyExpense)}/mo`} valueColor="#fbbf24" />
            </Box>

            {results.gap > 0 && (
              <Box sx={{ mt: 1.5, p: '12px 14px', borderRadius: 2.5, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <Typography sx={{ fontSize: 11, color: '#f87171', mb: 0.5, fontWeight: 600 }}>⚠️ Corpus Gap</Typography>
                <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#f87171' }}>{fmt(results.gap)}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5 }}>Invest <strong style={{ color: '#fbbf24' }}>{fmt(results.requiredSip)}/mo</strong> extra to close gap</Typography>
              </Box>
            )}

            {results.gap === 0 && (
              <Box sx={{ mt: 1.5, p: '12px 14px', borderRadius: 2.5, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <Typography sx={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>🎉 You're on track for retirement!</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box onClick={handleExport} sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              py: 1.25, borderRadius: 2.25, cursor: 'pointer', transition: 'all .15s',
              border: '1px solid rgba(249,115,22,0.25)', background: 'rgba(249,115,22,0.06)',
              '&:hover': { background: 'rgba(249,115,22,0.12)' },
            }}>
              <Typography sx={{ fontSize: 12.5, color: '#f97316', fontWeight: 600 }}>📥 Export Plan (CSV)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}