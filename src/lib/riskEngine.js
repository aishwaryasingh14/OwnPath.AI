const MOOD_VALUES = { great: 4, okay: 3, worried: 2, struggling: 1 };

export function analyzeMoodTrajectory(checkinHistory) {
  if (!checkinHistory || checkinHistory.length < 3) {
    return { trend: "stable", score: 0, label: null };
  }
  const recent = checkinHistory.slice(-5).map(h => MOOD_VALUES[h] || 2);
  let declines = 0;
  for (let i = 1; i < recent.length; i++) {
    if (recent[i] < recent[i - 1]) declines++;
  }
  const drop = recent[0] - recent[recent.length - 1];
  const isCurrentlyLow = recent.slice(-2).every(v => v <= 2);

  if (declines >= 3 && drop >= 2) {
    return { trend: "declining", score: 18, label: `Mood declining for ${declines} consecutive check-ins` };
  }
  if (declines >= 2 && drop >= 1) {
    return { trend: "declining", score: 10, label: "Mood trending downward this week" };
  }
  if (isCurrentlyLow && recent.length >= 2) {
    return { trend: "struggling", score: 8, label: "Consistently low mood in recent check-ins" };
  }
  if (declines === 0 && recent.every(v => v >= 3)) {
    return { trend: "improving", score: -5, label: null };
  }
  return { trend: "stable", score: 0, label: null };
}

export function calculateRiskScore(participant, tomorrowForecastF = 85) {
  let score = 0;
  const factors = [];

  const missedDays = participant.missedDays || 0;
  const lateDays = participant.lateDays || 0;
  const barriers = participant.reportedBarriers || [];
  const week = participant.currentWeek || 1;
  const consecutiveBarrierDays = participant.consecutiveBarrierDays || 0;

  // Attendance signals
  const missedScore = Math.min(missedDays * 15, 40);
  score += missedScore;
  if (missedDays > 0) factors.push(`Missed ${missedDays} day${missedDays > 1 ? 's' : ''} so far`);

  const lateScore = Math.min(lateDays * 5, 15);
  score += lateScore;
  if (lateDays >= 2) factors.push(`Late ${lateDays} times this program`);

  // Self-reported barriers
  if (barriers.includes("transportation")) { score += 20; factors.push("Reported transportation barrier"); }
  if (barriers.includes("housing"))        { score += 25; factors.push("Reported housing stress"); }
  if (barriers.includes("childcare"))      { score += 18; factors.push("Reported childcare challenge"); }
  if (barriers.includes("overwhelmed"))    { score += 15; factors.push("Reported feeling overwhelmed"); }
  if (barriers.includes("money"))          { score += 10; factors.push("Reported financial stress"); }
  if (barriers.includes("sick"))           { score += 8;  factors.push("Reported not feeling well"); }

  // Combination patterns (Feature 1)
  if (barriers.includes("transportation") && week === 3 && !participant.checkedInToday) {
    score += 12;
    factors.push("High-risk combination: transport barrier + Week 3 + no check-in tonight");
  }
  if (barriers.includes("housing") && barriers.includes("overwhelmed")) {
    score += 8;
    factors.push("Compounding stress: housing instability + feeling overwhelmed");
  }
  if (barriers.includes("childcare") && missedDays >= 1) {
    score += 7;
    factors.push("Childcare barrier with existing missed attendance");
  }
  if (barriers.length >= 3) {
    score += 10;
    factors.push(`Multiple overlapping barriers (${barriers.length}) — compounding risk`);
  }

  // Program week
  if (week === 3)      { score += 15; factors.push("Week 3 — historically highest dropout week"); }
  else if (week === 6) { score += 8;  factors.push("Week 6 — second peak dropout week"); }

  // Consecutive barrier days
  if (consecutiveBarrierDays >= 3)    { score += 15; factors.push(`Barriers reported ${consecutiveBarrierDays} days in a row`); }
  else if (consecutiveBarrierDays === 2) { score += 10; factors.push("Barriers reported 2 days in a row"); }

  // Mood trajectory (Feature 2)
  const trajectory = analyzeMoodTrajectory(participant.checkinHistory);
  if (trajectory.score > 0) { score += trajectory.score; factors.push(trajectory.label); }

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
    completionProbability: Math.max(5, 100 - finalScore),
    trajectory: trajectory.trend
  };
}

export function calculateWhatIfDeltas(baseResult) {
  const base = baseResult.completionProbability;
  return [
    { label: "Sun Tran Day Pass info", delta: 14, icon: "🚌" },
    { label: "Make-up session slot",   delta: 11, icon: "🗓️" },
    { label: "Peer buddy check-in",    delta: 8,  icon: "🤝" }
  ].map(item => ({ ...item, projected: Math.min(base + item.delta, 99) }));
}
