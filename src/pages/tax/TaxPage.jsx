import { Box, Typography, Divider, } from '@mui/material';
import { useTaxCalc } from '../../hooks/useTaxCalc';
import { fmt, fmtR, getSlabColor } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';
import { useState } from 'react';


export function TaxPage() {
  const [regime,      setRegime]      = useState('new');
  const [grossSalary, setGrossSalary] = useState(1440000);
  const [deductions,  setDeductions]  = useState({ c80c: 150000, c80d: 25000, hra: 96000 });

  const results = useTaxCalc({ grossSalary, regime, deductions });

  const setDed = (key, val) => setDeductions((prev) => ({ ...prev, [key]: val }));

  const regimeOpts = [
    { value: 'new', label: 'New Regime' },
    { value: 'old', label: 'Old Regime' },
  ];

  return (
    <Box sx={{
      p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' },
      overflowY: 'auto',
      height: 'calc(100vh - 56px)',
    }}>
      <PageHeader
        icon="📋"
        title="Income Tax Calculator"
        subtitle="FY 2025–26 (AY 2026–27) · Old Regime vs New Regime"
        iconBg="rgba(96,165,250,0.12)"
      />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 370px' },
        gap: { xs: 2, md: 2.25 },
        alignItems: 'start',
      }}>

        {/*
          On mobile (xs), the results panel is pulled up BEFORE the left column
          via `order`. Left column stays order:2 on mobile, right panel is order:1.
          On md+ both revert to natural flow (order: 0).
        */}

        {/* LEFT — inputs + slab table */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          order: { xs: 2, md: 0 },
        }}>
          <SectionCard
            title="Income Details"
            subtitle="Enter gross salary and eligible deductions"
            accent="#60a5fa"
          >
            <DualSlider
              label="Annual Gross Salary"
              value={grossSalary}
              onChange={setGrossSalary}
              min={300000}
              max={5000000}
              step={10000}
              prefix="₹"
              displayValue={fmt(grossSalary)}
            />

            <Box sx={{ background: '#141520', borderRadius: 3, p: { xs: 1.5, sm: 2 }, mb: 0 }}>
              <Typography sx={{
                fontSize: 11,
                fontWeight: 600,
                color: 'text.disabled',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                mb: 1.75,
              }}>
                Deductions (Old Regime Only)
              </Typography>

              {[
                { key: 'c80c', label: '80C — PF / ELSS / LIC', max: 150000, badge: 'Max ₹1.5L' },
                { key: 'c80d', label: '80D — Health Insurance', max: 50000,  badge: 'Max ₹25K' },
                { key: 'hra',  label: 'HRA Exemption',         max: null,    badge: null },
              ].map((d) => (
                <Box key={d.key} sx={{ mb: d.key === 'hra' ? 0 : 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                    <Typography sx={{
                      fontSize: { xs: 10.5, sm: 11.5 },
                      fontWeight: 500,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px',
                    }}>
                      {d.label}
                    </Typography>
                    {d.badge && (
                      <Box sx={{ background: '#1a1d2e', px: 1, py: 0.25, borderRadius: 1.5, flexShrink: 0 }}>
                        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.primary' }}>
                          {d.badge}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ position: 'relative' }}>
                    <Typography sx={{
                      position: 'absolute',
                      left: 13,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: 14,
                      color: 'text.disabled',
                      fontWeight: 500,
                    }}>₹</Typography>
                    <input
                      type="number"
                      value={deductions[d.key]}
                      onChange={(e) => setDed(d.key, Number(e.target.value))}
                      disabled={regime === 'new'}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: regime === 'new' ? '#0f1018' : '#141520',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: regime === 'new' ? '#4e5168' : '#eef0fa',
                        borderRadius: 9,
                        padding: '11px 14px 11px 28px',
                        fontSize: 14,
                        fontFamily: 'DM Sans, sans-serif',
                        outline: 'none',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>

          {/* Slab Table */}
          <SectionCard
            title={`${regime === 'new' ? 'New' : 'Old'} Regime — Slabs FY 2025–26`}
            accent="#60a5fa"
          >
            <Box
              component="table"
              sx={{ width: '100%', borderCollapse: 'collapse', mt: 1.75 }}
            >
              <Box component="thead">
                <Box component="tr">
                  {['Range', 'Rate', 'Applied'].map((h) => (
                    <Box
                      component="th"
                      key={h}
                      sx={{
                        fontSize: { xs: 9, sm: 10 },
                        color: 'text.disabled',
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        p: { xs: '6px 8px', sm: '7px 10px' },
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        textAlign: 'left',
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {results.slabBreakdown.map((slab, i) => {
                  const color = getSlabColor(slab.r);
                  return (
                    <Box
                      component="tr"
                      key={i}
                      sx={{ background: slab.active ? 'rgba(52,211,153,0.04)' : 'transparent' }}
                    >
                      <Box component="td" sx={{
                        p: { xs: '8px 8px', sm: '10px 10px' },
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: { xs: 11.5, sm: 13 },
                        color: 'text.secondary',
                        whiteSpace: 'nowrap',
                      }}>
                        {slab.label}
                      </Box>
                      <Box component="td" sx={{
                        p: { xs: '8px 8px', sm: '10px 10px' },
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: { xs: 11.5, sm: 13 },
                        fontWeight: 700,
                        color,
                      }}>
                        {slab.r}%
                      </Box>
                      <Box component="td" sx={{
                        p: { xs: '8px 8px', sm: '10px 10px' },
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <Box sx={{
                          width: { xs: 50, sm: 70 },
                          height: 4,
                          background: '#1a1d2e',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}>
                          <Box sx={{
                            width: `${slab.pct}%`,
                            height: '100%',
                            borderRadius: 1,
                            background: color,
                            transition: 'width .4s',
                          }} />
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
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
            {/* Regime Toggle */}
            <Box sx={{
              display: 'flex',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 2.5,
              overflow: 'hidden',
              mb: 2.25,
            }}>
              {regimeOpts.map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => setRegime(opt.value)}
                  sx={{
                    flex: 1,
                    py: { xs: 1, sm: 1.25 },
                    textAlign: 'center',
                    fontSize: { xs: 12.5, sm: 13.5 },
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all .15s',
                    color: regime === opt.value ? '#34d399' : 'text.disabled',
                    background: regime === opt.value ? '#141520' : 'transparent',
                  }}
                >
                  {opt.label}
                </Box>
              ))}
            </Box>

            <ResultCard
              label="Total Tax Payable"
              value={fmt(results.total)}
              color="#60a5fa"
              bgColor="rgba(96,165,250,0.06)"
              borderColor="rgba(96,165,250,0.15)"
            />

            {/* On mobile, show two result rows per row using a 2-col grid */}
            <Box sx={{
              display: { xs: 'grid', sm: 'block' },
              gridTemplateColumns: { xs: '1fr 1fr', sm: undefined },
              gap: { xs: 0, sm: undefined },
            }}>
              <ResultRow label="Gross Income"       value={fmt(grossSalary)} />
              <ResultRow label="Standard Deduction" value={`−${fmtR(results.stdDed)}`}  valueColor="#34d399" />
              <ResultRow label="Other Deductions"   value={`−${fmtR(results.otherDed)}`} valueColor="#34d399" />
              <ResultRow label="Taxable Income"     value={fmt(results.taxable)} />
              <ResultRow label="Tax on Income"      value={fmt(results.tax)}      valueColor="#60a5fa" />
              <ResultRow label="Cess @ 4%"          value={fmt(results.cess)} />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center', py: { xs: 0.75, sm: 1.25 } }}>
              <Typography sx={{
                fontSize: 10,
                color: 'text.disabled',
                textTransform: 'uppercase',
                letterSpacing: '1.2px',
                mb: 0.5,
              }}>
                Effective Tax Rate
              </Typography>
              <Typography sx={{
                fontFamily: "'Syne', sans-serif",
                fontSize: { xs: 36, sm: 44 },
                fontWeight: 800,
                color: '#60a5fa',
              }}>
                {results.effectiveRate}%
              </Typography>
            </Box>

            <ResultRow label="Monthly Take-Home" value={fmt(results.takeHome)} valueColor="#34d399" noBorder />

            {results.saving > 100 && (
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                background: 'rgba(52,211,153,0.12)',
                border: '1px solid rgba(52,211,153,0.2)',
                borderRadius: 2.25,
                p: { xs: '8px 12px', sm: '9px 14px' },
                mt: 1.5,
                flexWrap: 'wrap',
              }}>
                <Typography sx={{ fontSize: 12 }}>💡 Switch to save</Typography>
                <Typography sx={{
                  fontWeight: 700,
                  color: '#34d399',
                  fontFamily: "'Syne', sans-serif",
                }}>
                  {fmt(results.saving)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

