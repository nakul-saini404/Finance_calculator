// useGoalCalc.js
export function useGoalCalc({ goalAmount, currentSaved, monthlyContrib, rate, inflation, targetYears }) {
  const r = rate / 100;
  const inf = inflation / 100;
  const monthlyRate = r / 12;
  const months = targetYears * 12;

  // Future goal cost adjusted for inflation
  const inflatedGoal = goalAmount * Math.pow(1 + inf, targetYears);

  // Current savings grown
  const savedGrown = currentSaved * Math.pow(1 + r, targetYears);

  // SIP corpus from monthly contributions
  const sipCorpus = monthlyContrib > 0
    ? monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    : 0;

  const projected = savedGrown + sipCorpus;
  const gap = inflatedGoal - projected;

  // Required monthly SIP to exactly hit goal
  const remaining = inflatedGoal - savedGrown;
  const requiredSip = remaining > 0
    ? (remaining * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate))
    : 0;

  // Progress pct
  const progressPct = Math.min(100, Math.round((projected / inflatedGoal) * 100));

  // Months to goal with current contrib
  let monthsToGoal = null;
  if (monthlyContrib > 0) {
    let acc = currentSaved;
    for (let m = 1; m <= 600; m++) {
      acc = acc * (1 + monthlyRate) + monthlyContrib;
      if (acc >= inflatedGoal) { monthsToGoal = m; break; }
    }
  }

  // Chart: projected vs goal line year by year
  const chartData = [];
  for (let y = 0; y <= targetYears; y++) {
    const mo = y * 12;
    const sv = currentSaved * Math.pow(1 + r, y);
    const sc = monthlyContrib > 0
      ? monthlyContrib * ((Math.pow(1 + monthlyRate, mo) - 1) / monthlyRate) * (1 + monthlyRate)
      : 0;
    const goalLine = goalAmount * Math.pow(1 + inf, y);
    chartData.push({
      year: `Y${y}`,
      projected: Math.round(sv + sc),
      goal: Math.round(goalLine),
      invested: Math.round(currentSaved + monthlyContrib * mo),
    });
  }

  // Comparison: what if you invested more
  const scenarioData = [0.5, 1, 1.5, 2].map(mult => {
    const contrib = monthlyContrib * mult;
    const sc = contrib > 0
      ? contrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
      : 0;
    return {
      label: `₹${Math.round(contrib / 1000)}K/mo`,
      projected: Math.round(savedGrown + sc),
      achieves: (savedGrown + sc) >= inflatedGoal,
    };
  });

  return {
    inflatedGoal: Math.round(inflatedGoal),
    projected: Math.round(projected),
    savedGrown: Math.round(savedGrown),
    sipCorpus: Math.round(sipCorpus),
    gap: Math.round(Math.max(0, gap)),
    requiredSip: Math.round(requiredSip),
    progressPct,
    monthsToGoal,
    chartData,
    scenarioData,
  };
}