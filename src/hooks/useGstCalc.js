import { useMemo } from "react";

export function useGstCalc({ amount, rate, direction, txnType }) {
  return useMemo(() => {
    const r = Number(rate) || 0;
    const amt = Number(amount) || 0;
    const isInter = txnType === 'inter';

    let base, gstAmt;
    if (direction === 'add') {
      base = amt;
      gstAmt = base * r / 100;
    } else {
      base = amt / (1 + r / 100);
      gstAmt = amt - base;
    }
    const total = base + gstAmt;
    const effectiveRate = base > 0 ? (gstAmt / base * 100).toFixed(1) : '0.0';

    return {
      base, gstAmt, total, effectiveRate,
      cgst:     isInter ? 0 : gstAmt / 2,
      sgst:     isInter ? 0 : gstAmt / 2,
      igst:     isInter ? gstAmt : 0,
      cgstRate: r / 2,
      sgstRate: r / 2,
      igstRate: r,
      basePct:  total > 0 ? (base / total) * 100 : 0,
    };
  }, [amount, rate, direction, txnType]);
}