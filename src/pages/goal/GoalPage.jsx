import { Box, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { useGoalCalc } from '../../hooks/useGoalCalc';
import { fmt } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';

/* ── projected vs goal line chart (SVG) ── */
function GoalChart({ data }) {
  if (!data?.length) return null;
  const maxVal = Math.max(...data.map(d => Math.max(d.projected, d.goal)), 1);
  const W = 300, H = 90, PAD = 4;
  const xScale = (i) => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const yScale = (v) => H - PAD - (v / maxVal) * (H - PAD * 2);

  const projPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.projected)}`).join(' ');
  const goalPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(d.goal)}`).join(' ');
  const areaPath = `${projPath} L${xScale(data.length - 1)},${H} L${xScale(0)},${H} Z`;

  return (
    <Box sx={{ mt: 1, overflow: 'hidden' }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs>
          <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#projGrad)" />
        <path d={goalPath} stroke="#f87171" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
        <path d={projPath} stroke="#a78bfa" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        {data.filter((_, i) => i % Math.max(1, Math.floor(data.length / 5)) === 0 || i === data.length - 1).map((d, i) => (
          <Typography key={i} sx={{ fontSize: 8.5, color: 'text.disabled' }}>{d.year}</Typography>
        ))}
      </Box>
    </Box>
  );
}

/* ── scenario comparison bar ── */
function ScenarioBar({ label, projected, goal, achieves }) {
  const pct = Math.min(100, (projected / goal) * 100);
  return (
    <Box sx={{ mb: 1.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: 11.5, color: achieves ? '#a78bfa' : 'text.secondary', fontWeight: achieves ? 600 : 400 }}>{label}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{fmt(projected)}</Typography>
          {achieves && <Box sx={{ fontSize: 10, background: 'rgba(167,139,250,0.15)', color: '#a78bfa', px: 0.75, py: 0.25, borderRadius: 1, fontWeight: 700 }}>✓ Hits Goal</Box>}
        </Box>
      </Box>
      <Box sx={{ height: 5, background: '#1a1d2e', borderRadius: 1, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${pct}%`, background: achieves ? '#a78bfa' : '#4e5168', borderRadius: 1, transition: 'width .4s' }} />
      </Box>
    </Box>
  );
}

const GOAL_PRESETS = [
  { label: '🏠 Home',      amount: 10000000 },
  { label: '🚗 Car',       amount: 1500000  },
  { label: '✈️ Vacation',  amount: 500000   },
  { label: '🎓 Education', amount: 3000000  },
  { label: '💍 Wedding',   amount: 2000000  },
  { label: '💼 Business',  amount: 5000000  },
];

export function GoalPage() {
  const [goalAmount,     setGoalAmount]     = useState(5000000);
  const [currentSaved,   setCurrentSaved]   = useState(200000);
  const [monthlyContrib, setMonthlyContrib] = useState(15000);
  const [rate,           setRate]           = useState(12);
  const [inflation,      setInflation]      = useState(6);
  const [targetYears,    setTargetYears]    = useState(10);
  const [goalLabel,      setGoalLabel]      = useState('🏠 Home');

  const results = useGoalCalc({ goalAmount, currentSaved, monthlyContrib, rate, inflation, targetYears });

  const monthsLeft = results.monthsToGoal;
  const timeStr = monthsLeft == null ? '—'
    : monthsLeft >= 12 ? `${Math.floor(monthsLeft / 12)}y ${monthsLeft % 12}m`
    : `${monthsLeft} months`;

  const handleExport = () => {
    const rows = [
      ['Goal', goalLabel],
      ['Goal Amount (today)', fmt(goalAmount)],
      ['Inflation-adjusted Goal', fmt(results.inflatedGoal)],
      ['Current Savings', fmt(currentSaved)],
      ['Monthly Contribution', fmt(monthlyContrib)],
      ['Expected Return', `${rate}%`],
      ['Inflation', `${inflation}%`],
      ['Target Years', targetYears],
      ['Projected Value', fmt(results.projected)],
      ['Gap', fmt(results.gap)],
      ['Required Monthly SIP', fmt(results.requiredSip)],
      ['Time to Goal (current SIP)', timeStr],
      ['Progress', `${results.progressPct}%`],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'goal_savings.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' }, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader icon="🎯" title="Goal-Based Savings" subtitle="Target planning · Inflation-adjusted · SIP recommendation" iconBg="rgba(167,139,250,0.12)" />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 370px' }, gap: { xs: 2, md: 2.25 }, alignItems: 'start' }}>

        {/* LEFT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, md: 0 } }}>
          <SectionCard title="Your Goal" subtitle="Pick a preset or set a custom target" accent="#a78bfa">

            {/* Preset chips */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {GOAL_PRESETS.map(p => (
                <Box key={p.label} onClick={() => { setGoalLabel(p.label); setGoalAmount(p.amount); }} sx={{
                  px: 1.5, py: 0.75, borderRadius: 2, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                  background: goalLabel === p.label ? 'rgba(167,139,250,0.15)' : '#141520',
                  border: `1px solid ${goalLabel === p.label ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  color: goalLabel === p.label ? '#a78bfa' : 'text.disabled',
                }}>{p.label}</Box>
              ))}
            </Box>

            <DualSlider label="Goal Amount (today's value)" value={goalAmount}     onChange={setGoalAmount}     min={100000} max={50000000} step={100000} prefix="₹" displayValue={fmt(goalAmount)} />
            <DualSlider label="Current Savings"             value={currentSaved}   onChange={setCurrentSaved}   min={0}      max={10000000} step={10000}  prefix="₹" displayValue={fmt(currentSaved)} />
            <DualSlider label="Monthly Contribution"        value={monthlyContrib} onChange={setMonthlyContrib} min={0}      max={200000}   step={1000}   prefix="₹" displayValue={fmt(monthlyContrib)} />
          </SectionCard>

          <SectionCard title="Return & Timeline" subtitle="Expected returns, inflation and target years" accent="#a78bfa">
            <DualSlider label="Expected Annual Return" value={rate}         onChange={setRate}         min={4}  max={25} step={0.5} suffix="%" displayValue={`${rate}%`} />
            <DualSlider label="Inflation Rate"         value={inflation}    onChange={setInflation}    min={2}  max={12} step={0.5} suffix="%" displayValue={`${inflation}%`} />
            <DualSlider label="Target Timeline"        value={targetYears}  onChange={setTargetYears}  min={1}  max={30} step={1}   suffix="Yrs" displayValue={`${targetYears} Yrs`} sx={{ mb: 0 }} />
          </SectionCard>

          {/* Scenario comparison */}
          <SectionCard title="Contribution Scenarios" subtitle="What if you invest more each month?" accent="#a78bfa">
            <Box sx={{ mt: 1.5 }}>
              {results.scenarioData.map((s, i) => (
                <ScenarioBar key={i} {...s} goal={results.inflatedGoal} />
              ))}
            </Box>
          </SectionCard>
        </Box>

        {/* RIGHT */}
        <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 20 }, order: { xs: 1, md: 0 } }}>
          <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: { xs: 2, sm: 2.75 } }}>

            {/* Goal label + progress circle on mobile */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'stretch' }, gap: { xs: 2, sm: 0 }, mb: { xs: 1.5, sm: 0 } }}>
              {/* Progress arc */}
              <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.2px', mb: 1, display: { xs: 'none', sm: 'block' } }}>Goal Progress</Typography>
                <Box sx={{
                  width: { xs: 90, sm: 110 }, height: { xs: 90, sm: 110 }, borderRadius: '50%', mx: 'auto', mb: { xs: 0, sm: 1.5 },
                  background: `conic-gradient(#a78bfa ${results.progressPct * 3.6}deg, #1a1d2e ${results.progressPct * 3.6}deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .4s',
                }}>
                  <Box sx={{
                    width: { xs: 66, sm: 82 }, height: { xs: 66, sm: 82 }, borderRadius: '50%', background: '#0f1018',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: { xs: 18, sm: 22 }, fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{results.progressPct}%</Typography>
                    <Typography sx={{ fontSize: 9, color: 'text.disabled' }}>funded</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Mobile inline summary */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.25 }}>Goal Progress</Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#a78bfa', mb: 1 }}>{goalLabel}</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1px', mb: 0.25 }}>Inflation-adj. Goal</Typography>
                <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#a78bfa' }}>{fmt(results.inflatedGoal)}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <ResultCard label={`${goalLabel} — Inflation-adj. Target`} value={fmt(results.inflatedGoal)} color="#a78bfa" bgColor="rgba(167,139,250,0.06)" borderColor="rgba(167,139,250,0.18)" />
            </Box>

            <Box sx={{ display: { xs: 'grid', sm: 'block' }, gridTemplateColumns: { xs: '1fr 1fr', sm: undefined } }}>
              <ResultRow label="Projected Value"   value={fmt(results.projected)}   valueColor="#34d399" />
              <ResultRow label="Savings Grown"     value={fmt(results.savedGrown)}  valueColor="#60a5fa" />
              <ResultRow label="SIP Corpus"        value={fmt(results.sipCorpus)}   valueColor="#c084fc" />
              <ResultRow label="Time to Goal"      value={timeStr}                  valueColor="#fbbf24" />
            </Box>

            {results.gap > 0 && (
              <Box sx={{ mt: 1.5, p: '12px 14px', borderRadius: 2.5, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <Typography sx={{ fontSize: 11, color: '#f87171', mb: 0.5, fontWeight: 600 }}>⚠️ Shortfall</Typography>
                <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, color: '#f87171' }}>{fmt(results.gap)}</Typography>
                <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5 }}>
                  Increase SIP to <strong style={{ color: '#a78bfa' }}>{fmt(results.requiredSip)}/mo</strong> to hit goal
                </Typography>
              </Box>
            )}

            {results.gap === 0 && (
              <Box sx={{ mt: 1.5, p: '12px 14px', borderRadius: 2.5, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <Typography sx={{ fontSize: 12, color: '#34d399', fontWeight: 600 }}>🎉 You'll hit your {goalLabel} goal!</Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Chart */}
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 0.5 }}>Projected vs Goal</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mb: 0.5 }}>
              {[{ color: '#a78bfa', label: 'Projected' }, { color: '#f87171', label: 'Goal', dashed: true }].map(l => (
                <Box key={l.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 16, height: 2, background: l.color, borderRadius: 1, ...(l.dashed ? { backgroundImage: `repeating-linear-gradient(90deg, ${l.color} 0, ${l.color} 3px, transparent 3px, transparent 6px)`, background: 'none' } : {}) }} />
                  <Typography sx={{ fontSize: 10, color: 'text.disabled' }}>{l.label}</Typography>
                </Box>
              ))}
            </Box>
            <GoalChart data={results.chartData} />

            <Divider sx={{ my: 2 }} />

            <Box onClick={handleExport} sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              py: 1.25, borderRadius: 2.25, cursor: 'pointer', transition: 'all .15s',
              border: '1px solid rgba(167,139,250,0.25)', background: 'rgba(167,139,250,0.06)',
              '&:hover': { background: 'rgba(167,139,250,0.12)' },
            }}>
              <Typography sx={{ fontSize: 12.5, color: '#a78bfa', fontWeight: 600 }}>📥 Export Goal Plan (CSV)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}