import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function handleCohortNarration({ participants, weather }) {
  const barrierCounts = {};
  let noCheckinCount = 0;
  const weekCounts = {};

  for (const p of participants) {
    if (!p.checkedInToday) noCheckinCount++;
    for (const b of (p.reportedBarriers || [])) {
      barrierCounts[b] = (barrierCounts[b] || 0) + 1;
    }
    weekCounts[p.currentWeek] = (weekCounts[p.currentWeek] || 0) + 1;
  }

  const barrierLines = Object.entries(barrierCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([b, n]) => `${b}: ${n} participants`)
    .join(", ") || "none reported tonight";

  const weekLines = Object.entries(weekCounts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([w, n]) => `Week ${w}: ${n}`)
    .join(", ");

  const checkedIn = participants.filter(p => p.checkedInToday).length;

  const prompt = `You are an AI support tool for a workforce training program coordinator reviewing tonight's cohort check-in data.

Cohort snapshot (${participants.length} total participants):
- Checked in tonight: ${checkedIn} of ${participants.length}
- No check-in received: ${noCheckinCount}
- Reported barriers: ${barrierLines}
- Week distribution: ${weekLines}
${weather ? `- Tomorrow's forecast: ${weather.temp}°F${weather.isDangerous ? " ⚠️ EXTREME HEAT" : weather.isHot ? " (hot day)" : ""}` : ""}

Program context: Week 3 is historically the highest dropout week. Transportation is the most common barrier. Participants who receive a well-timed intervention in weeks 2–4 often complete the program.

Write a concise weekly cohort analysis for staff. Be specific to this data — avoid generic statements.

Respond ONLY with valid JSON:
{
  "headline": "Single most important thing staff should know tonight (1 sentence)",
  "insights": [
    {"signal": "specific pattern in the data", "action": "concrete staff action to take"},
    {"signal": "second pattern", "action": "concrete action"}
  ],
  "priorityThisWeek": "The single highest-leverage action for this cohort this week (1 sentence)",
  "positiveNote": "One positive signal in the data if there is one, or null"
}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.45,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function handleBarrierExtraction({ text, participantName }) {
  const prompt = `A workforce training program participant named ${participantName} described their situation in their own words: "${text}"

Identify which of these barrier categories are mentioned or implied:
transportation, housing, childcare, overwhelmed, money, sick

Respond ONLY with valid JSON:
{"barriers": ["matching_ids"], "summary": "empathetic 1-sentence paraphrase of what they shared"}

Only include barriers clearly implied by the text. Return empty array if nothing matches.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 120,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function handleInterventionRanking({ participant, riskResult }) {
  const barriers = (participant.reportedBarriers || []).join(", ") || "none reported";
  const factors = (riskResult.factors || []).join("; ") || "no specific factors";

  const prompt = `Rank the 3 most effective interventions for this specific workforce training participant.

Participant: ${participant.firstName}, Week ${participant.currentWeek}/10
Barriers reported: ${barriers}
Risk factors: ${factors}
Support preference: ${participant.supportPreference}
Missed days: ${participant.missedDays || 0}, Late days: ${participant.lateDays || 0}

Choose and rank 3 interventions (can be variations of these):
- Sun Tran day pass / bus route information
- Make-up session scheduling
- Peer buddy check-in
- 211 Arizona housing referral
- ADES childcare assistance referral (1-800-204-7633)
- Financial stress resources
- Staff wellness check-in

Respond ONLY with valid JSON:
{"interventions": [
  {"label": "Short action name (max 5 words)", "icon": "single emoji", "delta": number_1_to_20, "reasoning": "Why this helps this specific participant (1 sentence)"},
  {"label": "...", "icon": "...", "delta": 0, "reasoning": "..."},
  {"label": "...", "icon": "...", "delta": 0, "reasoning": "..."}
]}

Delta = estimated percentage point increase in completion probability. Be realistic and specific to this participant's barriers. Rank from highest to lowest impact.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 350,
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return parsed.interventions || [];
}

async function handleStaffExplanation({ participant, riskResult }) {
  const barriers = (participant.reportedBarriers || []).join(", ") || "none";
  const factors  = riskResult.factors.join("; ") || "no specific factors";

  const prompt = `You are a support coach at Caridad Community Kitchen, a free 10-week culinary job-training program in Tucson, AZ. Participants face barriers like missed buses, childcare gaps, housing instability, and Tucson's extreme heat.

Participant: ${participant.firstName}, Week ${participant.currentWeek} of 10
Barriers reported: ${barriers}
Risk factors: ${factors}
Support preference: ${participant.supportPreference}

Write a 2–3 sentence empathetic explanation for staff, a concrete suggested action referencing real Tucson resources (Sun Tran Route 8, 211 Arizona, ADES), and optionally a short warm message draft to send the participant. Only include a messageDraft if their support preference is "resources" or "staff_contact" — otherwise return null.

Respond ONLY with valid JSON in this exact shape:
{"explanation":"...","suggestedAction":"...","messageDraft":"...or null"}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.65,
    max_tokens: 400,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function handleParticipantMessage({ participant, selectedBarriers }) {
  const feelingKey =
    participant.feelingRating <= 1 ? "struggling" :
    participant.feelingRating === 2 ? "worried" :
    participant.feelingRating === 3 ? "okay" : "great";

  const barrierList = (selectedBarriers || []).join(", ") || "none";

  const prompt = `Write a warm, brief end-of-check-in message for ${participant.firstName}, a participant at Caridad Community Kitchen (free 10-week culinary job-training in Tucson, AZ). They checked in feeling: ${feelingKey}. Barriers they mentioned: ${barrierList}.

Rules:
- 2–3 sentences max per language
- Encouraging but not patronizing
- If transportation mentioned: reference Sun Tran Route 8
- If childcare mentioned: mention ADES (1-800-204-7633)
- If housing mentioned: mention 211 Arizona
- End each message with "See you tomorrow at Caridad. 🍳" (translated appropriately)

Respond ONLY with valid JSON:
{"english":"...","spanish":"...","french":"..."}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 350,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function handleFullCheckinExtraction({ text, participantName, lang }) {
  const langName = lang === "es" ? "Spanish" : lang === "fr" ? "French" : "English";
  const prompt = `A participant named ${participantName} sent this message during a nightly check-in (written in ${langName}): "${text}"

Extract:
1. feeling_rating: 1 (struggling) to 5 (great) — infer from tone/words
2. barriers: array of matching ids from: transportation, housing, childcare, overwhelmed, money, sick
3. support_preference: "none" | "resources" | "reminder" | "staff_contact" | "peer" — infer from what they're asking for, default to "none"
4. summary: brief empathetic English paraphrase of their message (1 sentence)

Respond ONLY with valid JSON:
{"feeling_rating": number, "barriers": [], "support_preference": "none", "summary": "..."}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 150,
    response_format: { type: "json_object" },
  });

  const parsed = JSON.parse(response.choices[0].message.content);
  return {
    feelingRating: parsed.feeling_rating || 3,
    barriers: parsed.barriers || [],
    supportPreference: parsed.support_preference || "none",
    summary: parsed.summary || text
  };
}

async function handleResourceMatching({ barriers, participantContext }) {
  const TUCSON_RESOURCES = `
- Sun Tran Route 8 (stops near Caridad on Main Ave) — transportation
- Sun Tran Day Pass ($4, available at many Tucson locations) — transportation
- 211 Arizona (dial 2-1-1, 24/7, bilingual) — housing, childcare, general crisis
- Primavera Foundation (520-882-5152) — emergency housing, Tucson
- ADES Child Care Assistance Program (1-800-204-7633) — childcare
- Crisis Text Line (text HOME to 741741) — mental health, overwhelmed
- Caridad Staff (520-882-5641) — direct support from program`;

  const prompt = `A workforce training participant has these challenges: ${barriers.join(", ")}.
Context: ${participantContext || "Tucson, AZ culinary training program participant."}

From these real Tucson resources, pick the 2-3 most relevant for their specific situation:
${TUCSON_RESOURCES}

Respond ONLY with valid JSON:
{"resources": [
  {"name": "...", "contact": "...", "reason": "1 sentence why this fits their specific situation", "urgency": "high|medium|low"},
  ...
]}`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 350,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

async function handleAnomalyDetection({ participants, riskResults, weather }) {
  const barrierCounts = {};
  const weekGroups = {};
  let noCheckinCount = 0;
  let highRiskCount = 0;

  participants.forEach((p, i) => {
    if (!p.checkedInToday) noCheckinCount++;
    if (riskResults[i]?.level === "high") highRiskCount++;
    (p.reportedBarriers || []).forEach(b => {
      barrierCounts[b] = (barrierCounts[b] || 0) + 1;
    });
    weekGroups[p.currentWeek] = weekGroups[p.currentWeek] || [];
    weekGroups[p.currentWeek].push(p.firstName);
  });

  const barrierSummary = Object.entries(barrierCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([b, n]) => `${b}: ${n}`)
    .join(", ") || "none";

  const prompt = `Analyze this cohort data for a 10-week culinary training program and identify non-obvious patterns or anomalies that a staff member might miss.

Cohort: ${participants.length} participants
High risk: ${highRiskCount}
No check-in tonight: ${noCheckinCount}
Barrier frequency: ${barrierSummary}
Week distribution: ${Object.entries(weekGroups).map(([w, ps]) => `Week ${w}: ${ps.length}`).join(", ")}
Weather: ${weather ? `${weather.temp}°F tomorrow` : "unknown"}

Look for:
- Unusual spike in a barrier compared to what's normal for this program stage
- Clusters of participants at the same week with similar issues
- Combinations of signals that suggest a systemic issue (e.g., multiple transport issues could mean a bus route changed)
- Participants who should be flagged but might be missed by simple risk scoring

Respond ONLY with valid JSON:
{"anomalies": [
  {"type": "spike|cluster|systemic|missed", "title": "Short title (5 words max)", "description": "What the anomaly is and why it matters (2 sentences)", "action": "Recommended staff action (1 sentence)", "severity": "high|medium|low"},
  ...
], "summary": "Overall pattern in 1 sentence or null if nothing notable"}

Return an empty anomalies array if nothing unusual is detected. Be specific — generic observations are not useful.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 500,
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { type, ...data } = JSON.parse(event.body);

    let result;
    if (type === "staff") {
      result = await handleStaffExplanation(data);
    } else if (type === "participant") {
      result = await handleParticipantMessage(data);
    } else if (type === "cohort") {
      result = await handleCohortNarration(data);
    } else if (type === "barrier_extract") {
      result = await handleBarrierExtraction(data);
    } else if (type === "interventions") {
      result = await handleInterventionRanking(data);
    } else if (type === "full_checkin") {
      result = await handleFullCheckinExtraction(data);
    } else if (type === "match_resources") {
      result = await handleResourceMatching(data);
    } else if (type === "detect_anomalies") {
      result = await handleAnomalyDetection(data);
    } else {
      return { statusCode: 400, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Unknown type" }) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("[llm function]", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
