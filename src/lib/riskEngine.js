export function calculateRiskScore(participant, tomorrowForecastF = 85) {
  let score = 0;
  const factors = [];

  const missedDays = participant.missedDays || 0;
  const lateDays = participant.lateDays || 0;
  const barriers = participant.reportedBarriers || [];
  const week = participant.currentWeek || 1;
  const consecutiveBarrierDays = participant.consecutiveBarrierDays || 0;

  // Attendance signals (40% weight)
  const missedScore = Math.min(missedDays * 15, 40);
  score += missedScore;
  if (missedDays > 0) factors.push(`Missed ${missedDays} day${missedDays > 1 ? 's' : ''} so far`);

  const lateScore = Math.min(lateDays * 5, 15);
  score += lateScore;
  if (lateDays >= 2) factors.push(`Late ${lateDays} times this program`);

  // Self-reported barriers (30% weight)
  if (barriers.includes("transportation")) { score += 20; factors.push("Reported transportation barrier"); }
  if (barriers.includes("housing"))        { score += 25; factors.push("Reported housing stress"); }
  if (barriers.includes("childcare"))      { score += 18; factors.push("Reported childcare challenge"); }
  if (barriers.includes("overwhelmed"))    { score += 15; factors.push("Reported feeling overwhelmed"); }
  if (barriers.includes("money"))          { score += 10; factors.push("Reported financial stress"); }
  if (barriers.includes("sick"))           { score += 8;  factors.push("Reported not feeling well"); }

  // Program week (week 3 = historically highest dropout)
  if (week === 3)       { score += 15; factors.push("Week 3 — historically highest dropout week"); }
  else if (week === 6)  { score += 8;  factors.push("Week 6 — second peak dropout week"); }

  // Consecutive barrier days
  if (consecutiveBarrierDays >= 3) { score += 15; factors.push(`Barriers reported ${consecutiveBarrierDays} days in a row`); }
  else if (consecutiveBarrierDays === 2) { score += 10; factors.push("Barriers reported 2 days in a row"); }

  // Weather
  if (tomorrowForecastF >= 105)      { score += 8; factors.push(`Extreme heat forecast tomorrow (${tomorrowForecastF}°F)`); }
  else if (tomorrowForecastF >= 100) { score += 4; factors.push(`High heat forecast tomorrow (${tomorrowForecastF}°F)`); }

  // No check-in signal
  if (!participant.checkedInToday) { score += 5; factors.push("No check-in received today"); }

  const finalScore = Math.min(Math.round(score), 100);
  const level = finalScore >= 65 ? "high" : finalScore >= 35 ? "medium" : "low";

  return {
    score: finalScore,
    level,
    factors,
    completionProbability: Math.max(5, 100 - finalScore)
  };
}

export function calculateWhatIfDeltas(baseResult) {
  const base = baseResult.completionProbability;
  return [
    { label: "Sun Tran Day Pass info", delta: 14, icon: "🚌" },
    { label: "Make-up session slot",   delta: 11, icon: "🗓️" },
    { label: "Peer buddy check-in",    delta: 8,  icon: "🤝" }
  ].map(item => ({
    ...item,
    projected: Math.min(base + item.delta, 99)
  }));
}
