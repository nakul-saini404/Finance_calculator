import { useMemo } from 'react';
import { LOAN_PRESETS } from '../constants/constants';
import { getCibilInfo, getScoreInfo } from '../utils/format';

export function useLoanEligibility({ income, existingEmi, age, cibil, rate, tenure, empType, loanType }) {
  return useMemo(() => {
    const inc  = Number(income)      || 0;
    const emi  = Number(existingEmi) || 0;
    const r    = (Number(rate) || 8.5) / 12 / 100;
    const n    = (Number(tenure) || 20) * 12;
    const cib  = Number(cibil) || 700;
    const ag   = Number(age)   || 30;

    // FOIR by employment type
    let foir = LOAN_PRESETS[loanType]?.foir || 0.50;
    if (empType === 'self')     foir -= 0.05;
    if (empType === 'business') foir += 0.05;

    // CIBIL multiplier
    let cibilMult = 1;
    if (cib >= 800)      cibilMult = 1.08;
    else if (cib >= 750) cibilMult = 1.00;
    else if (cib >= 700) cibilMult = 0.88;
    else if (cib >= 650) cibilMult = 0.72;
    else                 cibilMult = 0.50;

    const maxEMI  = Math.max(0, (inc * foir - emi) * cibilMult);
    const maxLoan = maxEMI > 0 ? maxEMI * (Math.pow(1 + r, n) - 1) / r / Math.pow(1 + r, n) : 0;
    const emiOnMax = maxLoan > 0 ? maxLoan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0;
    const totalInt = emiOnMax * n - maxLoan;
    const foirPct  = inc > 0 ? (emi / inc * 100).toFixed(1) : '0.0';

    // Composite eligibility score
    let score = 50;
    if (cib >= 800)      score += 25;
    else if (cib >= 750) score += 18;
    else if (cib >= 700) score += 8;
    else if (cib >= 650) score -= 5;
    else                 score -= 20;

    const foirN = Number(foirPct);
    if (foirN < 20)      score += 15;
    else if (foirN < 35) score += 8;
    else if (foirN < 50) score -= 5;
    else                 score -= 15;

    if (ag < 35)         score += 10;
    else if (ag < 45)    score += 5;
    else if (ag > 55)    score -= 10;

    if (empType === 'salaried') score += 8;
    else if (empType === 'business') score += 4;

    score = Math.max(5, Math.min(100, score));

    return {
      maxLoan, maxEMI, emiOnMax, totalInt, foirPct,
      score,
      scoreInfo:  getScoreInfo(score),
      cibilInfo:  getCibilInfo(cib),
    };
  }, [income, existingEmi, age, cibil, rate, tenure, empType, loanType]);
}