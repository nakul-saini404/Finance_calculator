// useNetWorth.js
export function useNetWorth(assets, liabilities) {
  const totalAssets = assets.reduce((s, a) => s + (Number(a.value) || 0), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + (Number(l.value) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtRatio = totalAssets > 0 ? ((totalLiabilities / totalAssets) * 100).toFixed(1) : 0;
  const liquidAssets = assets.filter(a => a.liquid).reduce((s, a) => s + (Number(a.value) || 0), 0);

  // Asset breakdown for donut
  const assetBreakdown = assets.map(a => ({
    label: a.label,
    value: Number(a.value) || 0,
    pct: totalAssets > 0 ? (((Number(a.value) || 0) / totalAssets) * 100).toFixed(1) : 0,
    color: a.color,
  }));

  const liabilityBreakdown = liabilities.map(l => ({
    label: l.label,
    value: Number(l.value) || 0,
    pct: totalLiabilities > 0 ? (((Number(l.value) || 0) / totalLiabilities) * 100).toFixed(1) : 0,
    color: l.color,
  }));

  const healthScore = Math.min(100, Math.max(0,
    netWorth > 0
      ? Math.round(50 + (netWorth / (totalAssets || 1)) * 50)
      : Math.round(50 - (Math.abs(netWorth) / (totalLiabilities || 1)) * 50)
  ));

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    debtRatio,
    liquidAssets,
    assetBreakdown,
    liabilityBreakdown,
    healthScore,
  };
}