// useRetirementCalc.js
export function useRetirementCalc({ currentAge, retireAge, lifeExp, monthlyExpense, currentSavings, expectedReturn, inflation, sipAmount }) {
  const yearsToRetire = retireAge - currentAge;
  const yearsInRetirement = lifeExp - retireAge;
  const r = expectedReturn / 100;
  const inf = inflation / 100;
  const realRate = (1 + r) / (1 + inf) - 1;

  // Future monthly expense at retirement (inflation adjusted)
  const futureMonthlyExpense = monthlyExpense * Math.pow(1 + inf, yearsToRetire);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // Corpus needed at retirement (PV of annuity)
  const corpusNeeded = futureAnnualExpense *
    ((1 - Math.pow(1 + realRate, -yearsInRetirement)) / realRate);

  // Current savings grown to retirement
  const savingsGrown = currentSavings * Math.pow(1 + r, yearsToRetire);

  // SIP corpus at retirement
  const monthlyRate = r / 12;
  const months = yearsToRetire * 12;
  const sipCorpus = sipAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);

  const totalCorpus = savingsGrown + sipCorpus;
  const gap = corpusNeeded - totalCorpus;

  // Required monthly SIP to close gap
  const requiredSip = gap > 0
    ? (gap * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate))
    : 0;

  // Readiness score (0–100)
  const readiness = Math.min(100, Math.round((totalCorpus / corpusNeeded) * 100));

  // Timeline chart — corpus build-up year by year
  const chartData = [];
  for (let y = 0; y <= yearsToRetire; y++) {
    const sv = currentSavings * Math.pow(1 + r, y);
    const mo = y * 12;
    const sc = sipAmount * ((Math.pow(1 + monthlyRate, mo) - 1) / monthlyRate) * (1 + monthlyRate);
    chartData.push({
      year: `${currentAge + y}`,
      savings: Math.round(sv),
      sip: Math.round(sc),
      total: Math.round(sv + sc),
      needed: Math.round(corpusNeeded * (y / yearsToRetire)),
    });
  }

  // Post-retirement drawdown
  const drawdownData = [];
  let remaining = totalCorpus;
  for (let y = 0; y <= yearsInRetirement; y++) {
    drawdownData.push({ age: retireAge + y, corpus: Math.round(Math.max(0, remaining)) });
    remaining = remaining * (1 + r) - futureAnnualExpense * Math.pow(1 + inf, y);
  }

  return {
    corpusNeeded: Math.round(corpusNeeded),
    totalCorpus: Math.round(totalCorpus),
    savingsGrown: Math.round(savingsGrown),
    sipCorpus: Math.round(sipCorpus),
    gap: Math.round(Math.max(0, gap)),
    requiredSip: Math.round(requiredSip),
    futureMonthlyExpense: Math.round(futureMonthlyExpense),
    readiness,
    yearsToRetire,
    yearsInRetirement,
    chartData,
    drawdownData,
  };
}