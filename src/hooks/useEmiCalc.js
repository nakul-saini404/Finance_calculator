import { useMemo } from 'react';

export function useEmiCalc({ amount, rate, tenure }) {
  return useMemo(() => {
    const P = Number(amount) || 0;
    const r = (Number(rate) || 0) / 12 / 100;
    const n = (Number(tenure) || 1) * 12;

    const emi = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
    const total = emi * n;
    const interest = total - P;
    const principalPct = total > 0 ? Math.round((P / total) * 100) : 0;

    // Amortization schedule
    let bal = P;
    const schedule = [];
    for (let m = 1; m <= n; m++) {
      const intPart = bal * r;
      const prinPart = emi - intPart;
      bal = Math.max(0, bal - prinPart);
      schedule.push({ month: m, emi, principal: prinPart, interest: intPart, balance: bal });
    }

    // Year-wise amortization for bar chart
    const years = Math.ceil(n / 12);
    const yearlyAmort = [];
    for (let y = 0; y < years; y++) {
      const slice = schedule.slice(y * 12, (y + 1) * 12);
      yearlyAmort.push({
        year: y + 1,
        principal: slice.reduce((s, m) => s + m.principal, 0),
        interest:  slice.reduce((s, m) => s + m.interest,  0),
      });
    }

    // Break-even year (when cumulative principal > cumulative interest for that year)
    let beYear = years;
    for (let y = 0; y < yearlyAmort.length; y++) {
      if (yearlyAmort[y].principal > yearlyAmort[y].interest) { beYear = y + 1; break; }
    }

    return { emi, total, interest, principalPct, schedule, yearlyAmort, beYear, n };
  }, [amount, rate, tenure]);
}