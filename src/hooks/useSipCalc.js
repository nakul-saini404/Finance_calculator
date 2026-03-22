import { useMemo } from 'react';
import { SIP_MILESTONES } from '../constants/constants';

export function useSipCalc({ monthly, rate, years, stepup, mode }) {
  return useMemo(() => {
    const mo = Number(monthly) || 0;
    const rateAnn = Number(rate) || 1;
    const r = rateAnn / 12 / 100;
    const yrs = Number(years) || 1;
    const stepUpRate = mode === 'stepup' ? (Number(stepup) || 0) / 100 : 0;

    let total = 0, invested = 0, ma = mo;
    const yearSnaps = [];

    for (let y = 0; y < yrs; y++) {
      for (let m = 0; m < 12; m++) {
        invested += ma;
        total = (total + ma) * (1 + r);
      }
      yearSnaps.push({ year: y + 1, inv: invested, tot: total });
      if (stepUpRate > 0) ma *= (1 + stepUpRate);
    }

    const returns = total - invested;
    const gainPct = invested > 0 ? (returns / invested * 100).toFixed(1) : '0.0';
    const doublesIn = (72 / rateAnn).toFixed(1);

    // Inflation-adjusted (6% inflation)
    const realR = Math.max(0, rateAnn - 6) / 12 / 100;
    const realTotal = mo * (Math.pow(1 + realR, yrs * 12) - 1) / Math.max(realR, 0.0001) * (1 + realR);

    // Milestones
    const milestones = SIP_MILESTONES
      .filter((cp) => cp <= yrs)
      .map((cp) => ({ year: cp, ...yearSnaps[cp - 1] }))
      .filter(Boolean);

    // Chart data (max 20 points)
    const step = Math.max(1, Math.floor(yearSnaps.length / 20));
    const chartData = yearSnaps.filter((_, i) => i % step === 0 || i === yearSnaps.length - 1);

    return { total, invested, returns, gainPct, doublesIn, realTotal, milestones, chartData };
  }, [monthly, rate, years, stepup, mode]);
}
