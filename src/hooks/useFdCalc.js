// useFdCalc.js
export function useFdCalc({ type, principal, monthlyDeposit, rate, years, compoundFreq }) {
  const r = rate / 100;
  const n = compoundFreq; // times per year
  const t = years;

  let maturity = 0, invested = 0, interest = 0;
  let chartData = [];

  if (type === 'fd') {
    // FD: P(1 + r/n)^(nt)
    maturity = principal * Math.pow(1 + r / n, n * t);
    invested = principal;
    interest = maturity - invested;

    for (let y = 1; y <= t; y++) {
      const val = principal * Math.pow(1 + r / n, n * y);
      chartData.push({ year: `Y${y}`, invested: principal, value: Math.round(val) });
    }
  } else {
    // RD: monthly compounding, deposit each month
    const monthlyRate = r / 12;
    const months = t * 12;
    let total = 0;
    for (let m = 1; m <= months; m++) {
      total += monthlyDeposit * Math.pow(1 + monthlyRate, months - m + 1);
    }
    maturity = total;
    invested = monthlyDeposit * months;
    interest = maturity - invested;

    for (let y = 1; y <= t; y++) {
      const mo = y * 12;
      let val = 0;
      for (let m = 1; m <= mo; m++) {
        val += monthlyDeposit * Math.pow(1 + monthlyRate, mo - m + 1);
      }
      chartData.push({ year: `Y${y}`, invested: monthlyDeposit * mo, value: Math.round(val) });
    }
  }

  const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100;

  // Comparison: same inputs but different compound frequencies
  const comparisonData = [1, 2, 4, 12, 365].map((freq) => {
    const mat = type === 'fd'
      ? principal * Math.pow(1 + r / freq, freq * t)
      : maturity; // RD always monthly
    return {
      label: { 1: 'Annual', 2: 'Half-Yr', 4: 'Quarterly', 12: 'Monthly', 365: 'Daily' }[freq],
      maturity: Math.round(mat),
      gain: Math.round(mat - (type === 'fd' ? principal : invested)),
    };
  });

  return {
    maturity: Math.round(maturity),
    invested: Math.round(invested),
    interest: Math.round(interest),
    effectiveRate: effectiveRate.toFixed(2),
    gainPct: ((interest / invested) * 100).toFixed(1),
    chartData,
    comparisonData,
  };
}