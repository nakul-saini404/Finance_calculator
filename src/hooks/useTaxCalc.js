import { useMemo } from 'react';
import { NEW_REGIME_SLABS, OLD_REGIME_SLABS, TAX_STD_DEDUCTION, TAX_REBATE_LIMIT } from '../constants/constants';

function calcTaxFromSlabs(taxable, slabs) {
  return slabs.reduce((tax, s) => {
    if (taxable > s.l) tax += (Math.min(taxable, s.h) - s.l) * s.r / 100;
    return tax;
  }, 0);
}

export function useTaxCalc({ grossSalary, regime, deductions }) {
  return useMemo(() => {
    const gross = Number(grossSalary) || 0;
    const c80c = Math.min(Number(deductions?.c80c) || 0, 150000);
    const c80d = Math.min(Number(deductions?.c80d) || 0, 50000);
    const hra  = Number(deductions?.hra) || 0;

    const isNew = regime === 'new';
    const slabs = isNew ? NEW_REGIME_SLABS : OLD_REGIME_SLABS;
    const stdDed = TAX_STD_DEDUCTION[regime];
    const otherDed = isNew ? 0 : c80c + c80d + hra;
    const taxable = Math.max(0, gross - stdDed - otherDed);

    let tax = calcTaxFromSlabs(taxable, slabs);
    if (isNew && taxable <= TAX_REBATE_LIMIT.new) tax = 0;
    if (!isNew && taxable <= TAX_REBATE_LIMIT.old) tax = 0;
    const cess = tax * 0.04;
    const total = tax + cess;
    const effectiveRate = gross > 0 ? (total / gross * 100).toFixed(1) : '0.0';
    const takeHome = (gross - total) / 12;

    // Alt regime comparison
    const altSlabs = isNew ? OLD_REGIME_SLABS : NEW_REGIME_SLABS;
    const altStdDed = TAX_STD_DEDUCTION[isNew ? 'old' : 'new'];
    const altOtherDed = isNew ? c80c + c80d + hra : 0;
    const altTaxable = Math.max(0, gross - altStdDed - altOtherDed);
    let altTax = calcTaxFromSlabs(altTaxable, altSlabs);
    if (!isNew && altTaxable <= TAX_REBATE_LIMIT.new) altTax = 0;
    if (isNew  && altTaxable <= TAX_REBATE_LIMIT.old) altTax = 0;
    const altTotal = altTax * 1.04;
    const saving = Math.abs(total - altTotal);

    // Slab breakdown with utilization
    const slabBreakdown = slabs.map((s) => {
      const active = taxable > s.l;
      const pct = active
        ? Math.min(100, ((taxable - s.l) / Math.max(1, s.h === Infinity ? taxable - s.l : s.h - s.l)) * 100)
        : 0;
      const label = s.h === Infinity
        ? `Above ₹${(s.l / 100000).toFixed(0)}L`
        : `₹${(s.l / 100000).toFixed(0)}L – ₹${(s.h / 100000).toFixed(0)}L`;
      return { ...s, active, pct, label };
    });

    return {
      taxable, tax, cess, total, effectiveRate, takeHome,
      stdDed, otherDed, slabBreakdown,
      altTotal, saving,
    };
  }, [grossSalary, regime, deductions]);
}
