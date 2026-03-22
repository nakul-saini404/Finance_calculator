export const fmtN = (v, dp = 0) =>
  Number(v).toLocaleString('en-IN', {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });

/** Format rupee value — uses L/Cr shorthand for large numbers */
export const fmt = (v) => {
  const n = Math.abs(v);
  if (n >= 10_000_000) return `₹${(v / 10_000_000).toFixed(2)}Cr`;
  if (n >= 100_000)    return `₹${(v / 100_000).toFixed(2)}L`;
  return `₹${Math.round(v).toLocaleString('en-IN')}`;
};

/** Format exact rupee with no shorthand */
export const fmtR = (v) => `₹${Math.round(v).toLocaleString('en-IN')}`;

/** Clamp a value between min and max */
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

/** Get slab color based on tax rate */
export const getSlabColor = (rate) => {
  if (rate === 0)  return '#34d399';
  if (rate <= 10)  return '#60a5fa';
  if (rate <= 20)  return '#fbbf24';
  return '#f87171';
};

/** Get CIBIL color and message */
export const getCibilInfo = (score) => {
  if (score >= 750) return { color: '#2dd4bf', icon: '✅', msg: 'Excellent for any loan' };
  if (score >= 700) return { color: '#34d399', icon: '👍', msg: 'Good — most banks approve' };
  if (score >= 650) return { color: '#fbbf24', icon: '⚠️', msg: 'Average — limited options' };
  return { color: '#f87171', icon: '❌', msg: 'Poor — work on improving' };
};

/** Get eligibility score label + color */
export const getScoreInfo = (score) => {
  if (score >= 80) return { label: 'Excellent Eligibility ✓', color: '#2dd4bf' };
  if (score >= 60) return { label: 'Good Eligibility 👍',     color: '#34d399' };
  if (score >= 40) return { label: 'Fair — Improve CIBIL',    color: '#fbbf24' };
  return { label: 'Low — Work on score', color: '#f87171' };
};