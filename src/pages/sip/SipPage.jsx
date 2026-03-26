import { Box, Typography, Divider } from '@mui/material';
import { useSipCalc } from '../../hooks/useSipCalc';
import { fmt, fmtR } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';
import { SegControl } from '../../components/SegControl';
import { SipBarChart } from '../../components/SipBarChart';
import { LegendRow } from '../../components/LegendRow';
import { useState } from 'react';

export function SipPage() {
  const [mode,    setMode]    = useState('regular');
  const [monthly, setMonthly] = useState(10000);
  const [stepup,  setStepup]  = useState(10);
  const [rate,    setRate]    = useState(12);
  const [years,   setYears]   = useState(15);

  const results = useSipCalc({ monthly, rate, years, stepup, mode });

  const modeOptions = [
    { value: 'regular', label: 'Regular SIP' },
    { value: 'stepup',  label: 'Step-Up SIP' },
  ];

  return (
    <Box sx={{
      p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' },
      overflowY: 'auto',
      height: 'calc(100vh - 56px)',
    }}>
      <PageHeader
        icon="📈"
        title="SIP Calculator"
        subtitle="Systematic Investment Plan · Wealth projection · Step-up mode"
        iconBg="rgba(192,132,252,0.12)"
      />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 370px' },
        gap: { xs: 2, md: 2.25 },
        alignItems: 'start',
      }}>

        {/* LEFT — inputs + milestones */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          order: { xs: 2, md: 0 },
        }}>
          <SectionCard
            title="Investment Parameters"
            subtitle="Configure your monthly SIP and goals"
            accent="#c084fc"
          >
            <SegControl options={modeOptions} value={mode} onChange={setMode} />
            <DualSlider
              label="Monthly Investment"
              value={monthly}
              onChange={setMonthly}
              min={500}
              max={200000}
              step={500}
              prefix="₹"
              displayValue={`₹${monthly.toLocaleString('en-IN')}`}
            />
            {mode === 'stepup' && (
              <DualSlider
                label="Annual Step-Up %"
                value={stepup}
                onChange={setStepup}
                min={0}
                max={50}
                step={1}
                suffix="%"
                displayValue={`${stepup}%`}
              />
            )}
            <DualSlider
              label="Expected Returns (p.a.)"
              value={rate}
              onChange={setRate}
              min={1}
              max={30}
              step={0.5}
              suffix="%"
              displayValue={`${rate}%`}
            />
            <DualSlider
              label="Investment Period"
              value={years}
              onChange={setYears}
              min={1}
              max={40}
              step={1}
              suffix="Yrs"
              displayValue={`${years} Yrs`}
              sx={{ mb: 0 }}
            />
          </SectionCard>

          <SectionCard title="Wealth Milestones" accent="#c084fc">
            <Box sx={{ mt: 1.75, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              {results.milestones.map((ms) => (
                <Box
                  key={ms.year}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: { xs: 1, sm: 1.25 },
                    px: { xs: 1.25, sm: 1.5 },
                    py: 1,
                    background: '#141520',
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{
                    fontSize: { xs: 10.5, sm: 11 },
                    color: 'text.disabled',
                    minWidth: { xs: 38, sm: 44 },
                    flexShrink: 0,
                  }}>
                    {ms.year} yr{ms.year > 1 ? 's' : ''}
                  </Typography>
                  <Box sx={{
                    flex: 1,
                    height: 4,
                    background: '#1a1d2e',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}>
                    <Box sx={{
                      height: '100%',
                      borderRadius: 1,
                      background: '#c084fc',
                      width: `${(ms.tot / (results.milestones[results.milestones.length - 1]?.tot || 1)) * 100}%`,
                      transition: 'width .5s ease',
                    }} />
                  </Box>
                  <Typography sx={{
                    fontSize: { xs: 11.5, sm: 12.5 },
                    fontWeight: 600,
                    fontFamily: "'Syne', sans-serif",
                    minWidth: { xs: 56, sm: 64 },
                    textAlign: 'right',
                    flexShrink: 0,
                  }}>
                    {fmt(ms.tot)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </SectionCard>
        </Box>

        {/* RIGHT — results panel */}
        <Box sx={{
          position: { xs: 'static', md: 'sticky' },
          top: { md: 20 },
          order: { xs: 1, md: 0 },
        }}>
          <Box sx={{
            background: '#0f1018',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 4,
            p: { xs: 2, sm: 2.75 },
          }}>
            <ResultCard
              label="Maturity Value"
              value={fmt(results.total)}
              color="#c084fc"
              bgColor="rgba(192,132,252,0.06)"
              borderColor="rgba(192,132,252,0.18)"
            />

            <Typography sx={{
              fontSize: 11,
              color: 'text.disabled',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              mb: 1,
            }}>
              Growth Over Time
            </Typography>

            <SipBarChart data={results.chartData} />
            <LegendRow items={[
              { label: 'Invested', color: '#60a5fa' },
              { label: 'Returns',  color: '#c084fc' },
            ]} />

            <Divider sx={{ my: 2 }} />

            {/* On mobile, 2-col grid for result rows to save vertical space */}
            <Box sx={{
              display: { xs: 'grid', sm: 'block' },
              gridTemplateColumns: { xs: '1fr 1fr', sm: undefined },
            }}>
              <ResultRow label="Total Invested"       value={fmt(results.invested)}      valueColor="#60a5fa" />
              <ResultRow label="Est. Returns"         value={fmt(results.returns)}       valueColor="#34d399" />
              <ResultRow label="Wealth Gain"          value={`+${results.gainPct}%`}     valueColor="#c084fc" />
              <ResultRow label="Inflation-adj. Value" value={fmt(results.realTotal)}     valueColor="text.secondary" />
            </Box>

            <ResultRow
              label="Doubles Every"
              value={`~${results.doublesIn} yrs`}
              valueColor="#fbbf24"
              noBorder
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

