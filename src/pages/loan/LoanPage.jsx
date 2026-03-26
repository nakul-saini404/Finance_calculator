import { Box, Typography, Select, MenuItem, Divider } from '@mui/material';
import { useLoanEligibility } from '../../hooks/useLoanEligibility';
import { LOAN_PRESETS, LOAN_TYPES, EMPLOYMENT_TYPES } from '../../constants/constants';
import { fmt, fmtR } from '../../utils/format';
import { DualSlider } from '../../components/DualSlider';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';
import { useState } from 'react';

export function LoanPage() {
  const [loanType,    setLoanType]    = useState('home');
  const [income,      setIncome]      = useState(80000);
  const [existingEmi, setExistingEmi] = useState(10000);
  const [age,         setAge]         = useState(32);
  const [cibil,       setCibil]       = useState(750);
  const [empType,     setEmpType]     = useState('salaried');
  const [rate,        setRate]        = useState(8.5);
  const [tenure,      setTenure]      = useState(20);

  const handleLoanTypeChange = (type) => {
    setLoanType(type);
    setRate(LOAN_PRESETS[type].rate);
    setTenure(LOAN_PRESETS[type].ten);
  };

  const results = useLoanEligibility({ income, existingEmi, age, cibil, rate, tenure, empType, loanType });
  const deg = (results.score / 100) * 360;

  return (
    <Box sx={{
      p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' },
      overflowY: 'auto',
      height: 'calc(100vh - 56px)',
    }}>
      <PageHeader
        icon="✅"
        title="Loan Eligibility Calculator"
        subtitle="FOIR-based · CIBIL adjusted · Bank-standard calculation"
        iconBg="rgba(45,212,191,0.12)"
      />

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 370px' },
        gap: { xs: 2, md: 2.25 },
        alignItems: 'start',
      }}>

        {/* LEFT — inputs */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          order: { xs: 2, md: 0 },
        }}>
          <SectionCard
            title="Your Financial Profile"
            subtitle="Fill in your details to get max loan eligibility"
            accent="#2dd4bf"
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{
                fontSize: 11.5,
                fontWeight: 500,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                mb: 1,
              }}>
                Loan Type
              </Typography>
              <Select
                value={loanType}
                onChange={(e) => handleLoanTypeChange(e.target.value)}
                size="small"
                fullWidth
              >
                {LOAN_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </Box>

            <DualSlider
              label="Net Monthly Income"
              value={income}
              onChange={setIncome}
              min={10000}
              max={500000}
              step={5000}
              prefix="₹"
              displayValue={`₹${income.toLocaleString('en-IN')}`}
            />
            <DualSlider
              label="Existing Monthly EMIs"
              value={existingEmi}
              onChange={setExistingEmi}
              min={0}
              max={100000}
              step={1000}
              prefix="₹"
              displayValue={`₹${existingEmi.toLocaleString('en-IN')}`}
            />

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1.5,
              mb: 2.5,
            }}>
              {[
                { label: 'Age',         value: age,   set: setAge,   min: 21,  max: 60,  suffix: 'Yrs' },
                { label: 'CIBIL Score', value: cibil, set: setCibil, min: 300, max: 900, suffix: null  },
              ].map((f) => (
                <Box key={f.label}>
                  <Typography sx={{
                    fontSize: { xs: 10.5, sm: 11.5 },
                    fontWeight: 500,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    mb: 1,
                  }}>
                    {f.label}
                  </Typography>
                  <Box sx={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={f.value}
                      min={f.min}
                      max={f.max}
                      onChange={(e) => f.set(Number(e.target.value))}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        background: '#141520',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#eef0fa',
                        borderRadius: 9,
                        padding: '11px 14px',
                        fontSize: 14,
                        fontFamily: 'DM Sans, sans-serif',
                        outline: 'none',
                      }}
                    />
                    {f.suffix && (
                      <span style={{
                        position: 'absolute',
                        right: 13,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 12,
                        color: '#4e5168',
                      }}>
                        {f.suffix}
                      </span>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </SectionCard>

          <SectionCard title="Loan Configuration" accent="#2dd4bf">
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{
                fontSize: 11.5,
                fontWeight: 500,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                mb: 1,
              }}>
                Employment Type
              </Typography>
              <Select
                value={empType}
                onChange={(e) => setEmpType(e.target.value)}
                size="small"
                fullWidth
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                ))}
              </Select>
            </Box>
            <DualSlider
              label="Interest Rate (p.a.)"
              value={rate}
              onChange={setRate}
              min={5}
              max={25}
              step={0.1}
              suffix="%"
              displayValue={`${rate}%`}
            />
            <DualSlider
              label="Loan Tenure"
              value={tenure}
              onChange={setTenure}
              min={1}
              max={30}
              step={1}
              suffix="Yrs"
              displayValue={`${tenure} Yrs`}
              sx={{ mb: 0 }}
            />
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
            {/* Score circle + summary — side by side on mobile */}
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'row', sm: 'column' },
              alignItems: { xs: 'center', sm: 'stretch' },
              gap: { xs: 2, sm: 0 },
              mb: { xs: 1.5, sm: 0.5 },
            }}>
              {/* Circle */}
              <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                <Typography sx={{
                  fontSize: 10,
                  color: 'text.disabled',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  mb: 1.25,
                  display: { xs: 'none', sm: 'block' },
                }}>
                  Eligibility Score
                </Typography>
                <Box sx={{
                  width: { xs: 90, sm: 120 },
                  height: { xs: 90, sm: 120 },
                  borderRadius: '50%',
                  background: `conic-gradient(${results.scoreInfo.color} ${deg}deg, #1a1d2e ${deg}deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: { xs: 0, sm: 1.5 },
                  transition: 'background .4s',
                }}>
                  <Box sx={{
                    width: { xs: 66, sm: 90 },
                    height: { xs: 66, sm: 90 },
                    borderRadius: '50%',
                    background: '#0f1018',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography sx={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: { xs: 20, sm: 26 },
                      fontWeight: 800,
                      color: results.scoreInfo.color,
                      lineHeight: 1,
                    }}>
                      {Math.round(results.score)}
                    </Typography>
                    <Typography sx={{ fontSize: 9, color: 'text.disabled', mt: 0.125 }}>/ 100</Typography>
                  </Box>
                </Box>
                <Typography sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: results.scoreInfo.color,
                  mb: { xs: 0, sm: 2 },
                  display: { xs: 'none', sm: 'block' },
                }}>
                  {results.scoreInfo.label}
                </Typography>
              </Box>

              {/* On mobile: score label + max loan next to circle */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.2px', mb: 0.5 }}>
                  Eligibility Score
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: results.scoreInfo.color, mb: 1 }}>
                  {results.scoreInfo.label}
                </Typography>
                <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.2px', mb: 0.25 }}>
                  Max Loan Eligible
                </Typography>
                <Typography sx={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#2dd4bf',
                }}>
                  {fmt(Math.max(0, results.maxLoan))}
                </Typography>
              </Box>
            </Box>

            {/* ResultCard hidden on mobile (replaced by inline above) */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <ResultCard
                label="Max Loan Eligible"
                value={fmt(Math.max(0, results.maxLoan))}
                color="#2dd4bf"
                bgColor="rgba(45,212,191,0.06)"
                borderColor="rgba(45,212,191,0.18)"
              />
            </Box>

            {/* Result rows — 2-col grid on mobile */}
            <Box sx={{
              display: { xs: 'grid', sm: 'block' },
              gridTemplateColumns: { xs: '1fr 1fr', sm: undefined },
            }}>
              <ResultRow label="EMI Capacity"       value={`${fmtR(Math.max(0, results.maxEMI))}/mo`} valueColor="#34d399" />
              <ResultRow label="FOIR (obligations)" value={`${results.foirPct}%`} />
              <ResultRow label="EMI on max loan"    value={fmtR(Math.max(0, results.emiOnMax))} />
              <ResultRow label="Total Interest"     value={fmt(Math.max(0, results.totalInt))} valueColor="#fbbf24" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{
              fontSize: 11,
              color: 'text.disabled',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              mb: 1,
            }}>
              Eligibility Meter
            </Typography>
            <Box sx={{ height: 10, background: '#1a1d2e', borderRadius: 1.25, overflow: 'hidden', mb: 0.5 }}>
              <Box sx={{
                height: '100%',
                borderRadius: 1.25,
                background: 'linear-gradient(90deg, #f87171, #fbbf24, #34d399)',
                width: `${results.score}%`,
                transition: 'width .5s ease',
              }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.75 }}>
              {['Low', 'Fair', 'Good', 'Excellent'].map((l) => (
                <Typography key={l} sx={{ fontSize: 9, color: 'text.disabled' }}>{l}</Typography>
              ))}
            </Box>

            <Box sx={{
              p: '10px 12px',
              borderRadius: 2.25,
              borderLeft: `3px solid ${results.cibilInfo.color}`,
              background: `rgba(${
                results.cibilInfo.color === '#2dd4bf' ? '45,212,191'
                : results.cibilInfo.color === '#34d399' ? '52,211,153'
                : results.cibilInfo.color === '#fbbf24' ? '251,191,36'
                : '248,113,113'
              }, 0.12)`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontSize: { xs: 11.5, sm: 12.5 },
              fontWeight: 500,
            }}>
              <span>{results.cibilInfo.icon}</span>
              <span>CIBIL <strong>{cibil}</strong> — {results.cibilInfo.msg}</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}