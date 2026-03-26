import { Box, Typography, Divider } from '@mui/material';
import { useState } from 'react';
import { useNetWorth } from '../../hooks/useNetWorth';
import { fmt } from '../../utils/format';
import { ResultCard } from '../../components/ResultCard';
import { ResultRow } from '../../components/ResultRow';
import { SectionCard } from '../../components/SectionCard';
import { PageHeader } from '../../components/PageHeader';

/* ── SVG donut ── */
function Donut({ segments, size = 110, stroke = 18 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  let offset = 0;
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map((seg, i) => {
        const pct = seg.value / total;
        const dash = pct * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset * circ}
            style={{ transition: 'all .4s ease' }}
          />
        );
        offset += pct;
        return el;
      })}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1d2e" strokeWidth={stroke}
        strokeDasharray={`${circ} 0`} style={{ opacity: segments.length === 0 ? 1 : 0 }} />
    </svg>
  );
}

/* ── editable line item ── */
function LineItem({ item, onValueChange, onRemove, accent }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
      <Typography sx={{ flex: 1, fontSize: 12.5, color: 'text.secondary', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</Typography>
      <Box sx={{ position: 'relative', width: 130, flexShrink: 0 }}>
        <Typography sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'text.disabled' }}>₹</Typography>
        <input type="number" value={item.value} onChange={e => onValueChange(Number(e.target.value))}
          style={{ width: '100%', boxSizing: 'border-box', background: '#141520', border: '1px solid rgba(255,255,255,0.10)', color: '#eef0fa', borderRadius: 8, padding: '8px 10px 8px 22px', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
      </Box>
      <Box onClick={onRemove} sx={{ fontSize: 14, color: 'text.disabled', cursor: 'pointer', px: 0.5, '&:hover': { color: '#f87171' }, transition: 'color .15s' }}>✕</Box>
    </Box>
  );
}

const DEFAULT_ASSETS = [
  { id: 1, label: 'Mutual Funds',   value: 500000, color: '#34d399', liquid: true  },
  { id: 2, label: 'Fixed Deposits', value: 300000, color: '#60a5fa', liquid: false },
  { id: 3, label: 'Real Estate',    value: 5000000,color: '#c084fc', liquid: false },
  { id: 4, label: 'Gold',           value: 200000, color: '#fbbf24', liquid: true  },
  { id: 5, label: 'Stocks / Equity',value: 150000, color: '#f97316', liquid: true  },
];
const DEFAULT_LIABS = [
  { id: 1, label: 'Home Loan',     value: 2000000, color: '#f87171' },
  { id: 2, label: 'Car Loan',      value: 400000,  color: '#fb923c' },
  { id: 3, label: 'Credit Cards',  value: 50000,   color: '#e879f9' },
];

const ASSET_COLORS   = ['#34d399','#60a5fa','#c084fc','#fbbf24','#f97316','#2dd4bf','#a78bfa'];
const LIAB_COLORS    = ['#f87171','#fb923c','#e879f9','#f43f5e','#ef4444','#dc2626'];

let nextId = 10;

export function NetWorthPage() {
  const [assets,      setAssets]      = useState(DEFAULT_ASSETS);
  const [liabilities, setLiabilities] = useState(DEFAULT_LIABS);
  const [newAssetLabel, setNewAssetLabel]   = useState('');
  const [newLiabLabel,  setNewLiabLabel]    = useState('');
  const [activeTab,     setActiveTab]       = useState('assets'); // 'assets' | 'liabilities'

  const results = useNetWorth(assets, liabilities);

  const updateAsset = (id, val) => setAssets(a => a.map(x => x.id === id ? { ...x, value: val } : x));
  const updateLiab  = (id, val) => setLiabilities(l => l.map(x => x.id === id ? { ...x, value: val } : x));
  const removeAsset = (id) => setAssets(a => a.filter(x => x.id !== id));
  const removeLiab  = (id) => setLiabilities(l => l.filter(x => x.id !== id));

  const addAsset = () => {
    if (!newAssetLabel.trim()) return;
    setAssets(a => [...a, { id: nextId++, label: newAssetLabel, value: 0, color: ASSET_COLORS[a.length % ASSET_COLORS.length], liquid: false }]);
    setNewAssetLabel('');
  };
  const addLiab = () => {
    if (!newLiabLabel.trim()) return;
    setLiabilities(l => [...l, { id: nextId++, label: newLiabLabel, value: 0, color: LIAB_COLORS[l.length % LIAB_COLORS.length] }]);
    setNewLiabLabel('');
  };

  const handleExport = () => {
    const rows = [
      ['Category', 'Item', 'Value'],
      ...assets.map(a => ['Asset', a.label, a.value]),
      ...liabilities.map(l => ['Liability', l.label, l.value]),
      ['', 'Total Assets', results.totalAssets],
      ['', 'Total Liabilities', results.totalLiabilities],
      ['', 'Net Worth', results.netWorth],
      ['', 'Debt Ratio', `${results.debtRatio}%`],
      ['', 'Liquid Assets', results.liquidAssets],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'net_worth.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const nwColor = results.netWorth >= 0 ? '#34d399' : '#f87171';

  return (
    <Box sx={{ p: { xs: '16px 14px', sm: '24px 20px', md: '30px 28px' }, overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      <PageHeader icon="💎" title="Net Worth Tracker" subtitle="Assets · Liabilities · Donut breakdown · Health score" iconBg="rgba(52,211,153,0.12)" />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 370px' }, gap: { xs: 2, md: 2.25 }, alignItems: 'start' }}>

        {/* LEFT */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, order: { xs: 2, md: 0 } }}>

          {/* Mobile tab switch */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2.5, overflow: 'hidden' }}>
            {[{ v: 'assets', l: '✅ Assets' }, { v: 'liabilities', l: '⚠️ Liabilities' }].map(t => (
              <Box key={t.v} onClick={() => setActiveTab(t.v)} sx={{
                flex: 1, py: 1.25, textAlign: 'center', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all .15s',
                color: activeTab === t.v ? '#34d399' : 'text.disabled',
                background: activeTab === t.v ? '#141520' : 'transparent',
              }}>{t.l}</Box>
            ))}
          </Box>

          {/* Assets panel */}
          <Box sx={{ display: { xs: activeTab === 'assets' ? 'block' : 'none', md: 'block' } }}>
            <SectionCard title="Assets" subtitle="Everything you own" accent="#34d399">
              {assets.map(a => (
                <LineItem key={a.id} item={a} onValueChange={val => updateAsset(a.id, val)} onRemove={() => removeAsset(a.id)} accent="#34d399" />
              ))}
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <input value={newAssetLabel} onChange={e => setNewAssetLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addAsset()}
                  placeholder="Add asset…"
                  style={{ flex: 1, background: '#141520', border: '1px solid rgba(255,255,255,0.10)', color: '#eef0fa', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                <Box onClick={addAsset} sx={{ px: 2, py: 1, borderRadius: 2, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { background: 'rgba(52,211,153,0.25)' } }}>+ Add</Box>
              </Box>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>Total Assets</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#34d399', fontFamily: "'Syne', sans-serif" }}>{fmt(results.totalAssets)}</Typography>
              </Box>
            </SectionCard>
          </Box>

          {/* Liabilities panel */}
          <Box sx={{ display: { xs: activeTab === 'liabilities' ? 'block' : 'none', md: 'block' } }}>
            <SectionCard title="Liabilities" subtitle="Everything you owe" accent="#f87171">
              {liabilities.map(l => (
                <LineItem key={l.id} item={l} onValueChange={val => updateLiab(l.id, val)} onRemove={() => removeLiab(l.id)} accent="#f87171" />
              ))}
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <input value={newLiabLabel} onChange={e => setNewLiabLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addLiab()}
                  placeholder="Add liability…"
                  style={{ flex: 1, background: '#141520', border: '1px solid rgba(255,255,255,0.10)', color: '#eef0fa', borderRadius: 8, padding: '8px 12px', fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                <Box onClick={addLiab} sx={{ px: 2, py: 1, borderRadius: 2, background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', '&:hover': { background: 'rgba(248,113,113,0.25)' } }}>+ Add</Box>
              </Box>
              <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>Total Liabilities</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#f87171', fontFamily: "'Syne', sans-serif" }}>{fmt(results.totalLiabilities)}</Typography>
              </Box>
            </SectionCard>
          </Box>
        </Box>

        {/* RIGHT */}
        <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: { md: 20 }, order: { xs: 1, md: 0 } }}>
          <Box sx={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: { xs: 2, sm: 2.75 } }}>

            {/* Net Worth headline */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.2px', mb: 0.5 }}>Net Worth</Typography>
              <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: { xs: 32, sm: 40 }, fontWeight: 800, color: nwColor, lineHeight: 1.1 }}>
                {results.netWorth < 0 ? '−' : ''}{fmt(Math.abs(results.netWorth))}
              </Typography>
            </Box>

            {/* Dual donut row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              {[
                { label: 'Assets', segments: results.assetBreakdown, total: results.totalAssets, color: '#34d399' },
                { label: 'Liabilities', segments: results.liabilityBreakdown, total: results.totalLiabilities, color: '#f87171' },
              ].map(d => (
                <Box key={d.label} sx={{ textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Donut segments={d.segments} size={100} stroke={16} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, color: d.color }}>{fmt(d.total)}</Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.5 }}>{d.label}</Typography>
                </Box>
              ))}
            </Box>

            {/* Asset legend */}
            <Box sx={{ mb: 1.5 }}>
              {results.assetBreakdown.map(a => (
                <Box key={a.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: 11.5, color: 'text.secondary' }}>{a.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{a.pct}%</Typography>
                    <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.primary' }}>{fmt(a.value)}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: { xs: 'grid', sm: 'block' }, gridTemplateColumns: { xs: '1fr 1fr', sm: undefined } }}>
              <ResultRow label="Total Assets"      value={fmt(results.totalAssets)}      valueColor="#34d399" />
              <ResultRow label="Total Liabilities" value={fmt(results.totalLiabilities)} valueColor="#f87171" />
              <ResultRow label="Liquid Assets"     value={fmt(results.liquidAssets)}     valueColor="#60a5fa" />
              <ResultRow label="Debt-to-Asset"     value={`${results.debtRatio}%`}       valueColor={Number(results.debtRatio) > 50 ? '#f87171' : '#fbbf24'} noBorder />
            </Box>

            {/* Health bar */}
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontSize: 11, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1 }}>Financial Health</Typography>
            <Box sx={{ height: 8, background: '#1a1d2e', borderRadius: 1, overflow: 'hidden', mb: 0.75 }}>
              <Box sx={{ height: '100%', borderRadius: 1, background: 'linear-gradient(90deg, #f87171, #fbbf24, #34d399)', width: `${results.healthScore}%`, transition: 'width .5s ease' }} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              {['At-Risk', 'Fair', 'Good', 'Excellent'].map(l => (
                <Typography key={l} sx={{ fontSize: 9, color: 'text.disabled' }}>{l}</Typography>
              ))}
            </Box>

            <Box onClick={handleExport} sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              py: 1.25, borderRadius: 2.25, cursor: 'pointer', transition: 'all .15s',
              border: '1px solid rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.06)',
              '&:hover': { background: 'rgba(52,211,153,0.12)' },
            }}>
              <Typography sx={{ fontSize: 12.5, color: '#34d399', fontWeight: 600 }}>📥 Export Net Worth (CSV)</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}