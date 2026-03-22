// ── EMI Presets ──────────────────────────────────────
export const EMI_PRESETS = {
  home:      { amt: 2000000, rate: 8.5,  ten: 20, label: '🏠 Home',      color: 'green' },
  car:       { amt: 800000,  rate: 9.5,  ten: 7,  label: '🚗 Car',       color: 'green' },
  personal:  { amt: 500000,  rate: 14,   ten: 5,  label: '💳 Personal',  color: 'green' },
  education: { amt: 1000000, rate: 10,   ten: 10, label: '🎓 Education', color: 'green' },
};

// ── GST Rates ─────────────────────────────────────────
export const GST_RATES = [
  { rate: 5,  label: 'Essential',  id: 'gr5' },
  { rate: 12, label: 'Standard',   id: 'gr12' },
  { rate: 18, label: 'Common',     id: 'gr18' },
  { rate: 28, label: 'Luxury',     id: 'gr28' },
  { rate: 0,  label: 'Exempt',     id: 'gr0' },
  { rate: 'custom', label: 'Custom ✏️', id: 'grc' },
];

export const GST_COMMON_ITEMS = [
  { label: '🥦 Fresh Vegetables',  rate: 0  },
  { label: '🚕 Cab Services',      rate: 5  },
  { label: '🧴 Toiletries',        rate: 12 },
  { label: '💻 Electronics',       rate: 18 },
  { label: '🍽 Restaurant (AC)',   rate: 18 },
  { label: '🚗 New Cars',          rate: 28 },
];

// ── Income Tax Slabs ──────────────────────────────────
export const NEW_REGIME_SLABS = [
  { l: 0,       h: 300000,  r: 0  },
  { l: 300000,  h: 700000,  r: 5  },
  { l: 700000,  h: 1000000, r: 10 },
  { l: 1000000, h: 1200000, r: 15 },
  { l: 1200000, h: 1500000, r: 20 },
  { l: 1500000, h: Infinity, r: 30 },
];

export const OLD_REGIME_SLABS = [
  { l: 0,       h: 250000,  r: 0  },
  { l: 250000,  h: 500000,  r: 5  },
  { l: 500000,  h: 1000000, r: 20 },
  { l: 1000000, h: Infinity, r: 30 },
];

export const TAX_STD_DEDUCTION = { new: 75000, old: 50000 };
export const TAX_REBATE_LIMIT  = { new: 1200000, old: 500000 };

// ── Loan Presets ──────────────────────────────────────
export const LOAN_PRESETS = {
  home:      { rate: 8.5,  ten: 20, foir: 0.50 },
  car:       { rate: 9.5,  ten: 7,  foir: 0.45 },
  personal:  { rate: 14,   ten: 5,  foir: 0.40 },
  education: { rate: 10,   ten: 10, foir: 0.50 },
};

export const LOAN_TYPES = [
  { value: 'home',      label: '🏠 Home Loan' },
  { value: 'car',       label: '🚗 Car Loan' },
  { value: 'personal',  label: '💳 Personal Loan' },
  { value: 'education', label: '🎓 Education Loan' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'salaried', label: '👔 Salaried',       foirBonus: 0 },
  { value: 'self',     label: '💼 Self-Employed',  foirBonus: -0.05 },
  { value: 'business', label: '🏢 Business Owner', foirBonus: 0.05 },
];

// ── SIP Milestone Checkpoints ─────────────────────────
export const SIP_MILESTONES = [1, 3, 5, 10, 15, 20, 25, 30];

// ── Nav Config ────────────────────────────────────────
export const NAV_ITEMS = [
  {
    group: 'Overview',
    items: [
      { id: 'home', label: 'All Calculators', icon: '🏠', accent: 'rgba(255,255,255,0.7)', iconBg: 'rgba(255,255,255,0.05)' },
    ],
  },
  {
    group: 'Calculators',
    items: [
      { id: 'emi',  label: 'EMI Calculator',        icon: '🏦', accent: '#34d399', iconBg: 'rgba(52,211,153,0.12)',  hot: null },
      { id: 'gst',  label: 'GST Calculator',        icon: '🧾', accent: '#fbbf24', iconBg: 'rgba(251,191,36,0.12)', hot: '🔥' },
      { id: 'tax',  label: 'Income Tax',            icon: '📋', accent: '#60a5fa', iconBg: 'rgba(96,165,250,0.12)',  hot: null },
      { id: 'sip',  label: 'SIP Calculator',        icon: '📈', accent: '#c084fc', iconBg: 'rgba(192,132,252,0.12)', hot: null },
      { id: 'loan', label: 'Loan Eligibility',      icon: '✅', accent: '#2dd4bf', iconBg: 'rgba(45,212,191,0.12)', hot: null },
    ],
  },
];

// ── Home Cards Config ─────────────────────────────────
export const HOME_CARDS = [
  {
    id: 'emi',
    icon: '🏦',
    iconBg: 'rgba(52,211,153,0.12)',
    title: 'EMI Calculator',
    desc: 'Monthly installments for home, car & personal loans with amortization breakdown.',
    tag: 'MOST USED',
    tagColor: '#34d399',
    tagBg: 'rgba(52,211,153,0.12)',
    arrowColor: '#34d399',
  },
  {
    id: 'gst',
    icon: '🧾',
    iconBg: 'rgba(251,191,36,0.12)',
    title: 'GST Calculator',
    desc: 'Add or remove GST instantly. Full CGST/SGST/IGST split for all Indian tax rates.',
    tag: '🔥 INDIA',
    tagColor: '#fbbf24',
    tagBg: 'rgba(251,191,36,0.12)',
    arrowColor: '#fbbf24',
  },
  {
    id: 'tax',
    icon: '📋',
    iconBg: 'rgba(96,165,250,0.12)',
    title: 'Income Tax',
    desc: 'FY 2025–26 tax computation. Old vs New regime comparison with net take-home.',
    tag: 'FY 2025–26',
    tagColor: '#60a5fa',
    tagBg: 'rgba(96,165,250,0.12)',
    arrowColor: '#60a5fa',
  },
  {
    id: 'sip',
    icon: '📈',
    iconBg: 'rgba(192,132,252,0.12)',
    title: 'SIP Calculator',
    desc: 'Project SIP wealth over time with step-up mode, milestones & inflation-adjusted returns.',
    tag: 'MUTUAL FUNDS',
    tagColor: '#c084fc',
    tagBg: 'rgba(192,132,252,0.12)',
    arrowColor: '#c084fc',
  },
  {
    id: 'loan',
    icon: '✅',
    iconBg: 'rgba(45,212,191,0.12)',
    title: 'Loan Eligibility',
    desc: 'Know your maximum loan amount. FOIR-based with CIBIL score adjustment.',
    tag: 'BANK CHECK',
    tagColor: '#2dd4bf',
    tagBg: 'rgba(45,212,191,0.12)',
    arrowColor: '#2dd4bf',
  },
];