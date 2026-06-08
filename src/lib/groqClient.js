// Calls /.netlify/functions/llm (Groq, server-side key).
// Falls back to pre-written templates if the function is unreachable (e.g. local dev without netlify dev).

const STAFF_EXPLANATIONS = {
  transportation: {
    explanation: (name, week) =>
      `${name} has flagged transportation as a barrier for the second day in a row, which is a pattern we've seen lead to missed days in week ${week}. The bus timing on Route 8 can be tricky early in the program.`,
    suggestedAction: "Send Sun Tran Day Pass information and confirm the Route 8 schedule that stops near Caridad on Main Ave.",
    messageDraft: (name) =>
      `Hi ${name}, just wanted to share the Sun Tran Route 8 schedule — it stops right near Caridad and Day Passes are available. You've got this! 🚌`
  },
  housing: {
    explanation: (name, week) =>
      `${name} mentioned housing stress this week, which is one of the heavier things to carry while also showing up every day. Being in week ${week} means they've already built real momentum worth protecting.`,
    suggestedAction: "Reach out with 211 Arizona housing resources and let them know a staff member is available to talk.",
    messageDraft: (name) =>
      `Hey ${name}, we know this week has been a lot. 211 Arizona (dial 2-1-1) has 24/7 bilingual housing help — and we're here too. See you tomorrow. 💙`
  },
  childcare: {
    explanation: (name, week) =>
      `${name} reported a childcare gap this week. This is one of the most common — and most solvable — barriers for participants in week ${week} when routines are still getting established.`,
    suggestedAction: "Share ADES Child Care Assistance Program info (1-800-204-7633) and the 211 Arizona childcare referral line.",
    messageDraft: (name) =>
      `Hi ${name}, the ADES Child Care Assistance Program can help with costs — call 1-800-204-7633 or dial 2-1-1 for a free referral. You're doing something amazing. 👶`
  },
  overwhelmed: {
    explanation: (name, week) =>
      `${name} checked in feeling overwhelmed today. Week ${week} is demanding, and it's worth a brief, low-pressure acknowledgment so they don't feel like they're falling behind alone.`,
    suggestedAction: "A quick 2-minute check-in at the start of tomorrow's session — no agenda, just a warm hello.",
    messageDraft: null
  },
  default: {
    explanation: (name, week) =>
      `${name} is in week ${week} and their recent check-ins suggest they could use a little extra support right now. Nothing alarming — just worth a warm check-in before it becomes harder to catch up.`,
    suggestedAction: "Say hello at the start of class tomorrow and ask how they're settling in this week.",
    messageDraft: null
  }
};

const PARTICIPANT_MESSAGES = {
  struggling: {
    en: (name, barriers) =>
      `Thanks for being honest with us, ${name} — that takes real courage. ${barriers.includes("transportation") ? "We've shared some bus route info below." : "We hear you."} You've made it this far, and that matters. See you tomorrow at Caridad. 🍳`,
    es: (name) =>
      `Gracias por ser honesto/a con nosotros, ${name} — eso requiere mucho valor. Llevas un buen trecho recorrido, y eso importa. ¡Hasta mañana en Caridad! 🍳`,
    fr: (name) =>
      `Merci d'être honnête avec nous, ${name} — cela demande beaucoup de courage. Vous avez fait du chemin jusqu'ici, et ça compte. À demain chez Caridad. 🍳`
  },
  worried: {
    en: (name, barriers) =>
      `Thanks for checking in, ${name}. ${barriers.includes("childcare") ? "We've included some childcare resources below." : barriers.includes("transportation") ? "Check out the Sun Tran info below — Route 8 stops right near us." : "It's okay to have days that feel uncertain."} You're building something real. See you tomorrow. 🍳`,
    es: (name) =>
      `Gracias por reportarte, ${name}. Está bien tener días que se sienten inciertos — estás construyendo algo real. ¡Hasta mañana en Caridad! 🍳`,
    fr: (name) =>
      `Merci de nous donner de vos nouvelles, ${name}. Il est normal d'avoir des jours incertains — vous construisez quelque chose de réel. À demain chez Caridad. 🍳`
  },
  okay: {
    en: (name) =>
      `Glad to hear from you, ${name}. Steady days like today are what the whole program is built on. Rest up and we'll see you tomorrow morning at Caridad. 🍳`,
    es: (name) =>
      `Qué bueno saber de ti, ${name}. Los días constantes como hoy son la base de todo el programa. Descansa y te vemos mañana en Caridad. 🍳`,
    fr: (name) =>
      `Heureux d'avoir de vos nouvelles, ${name}. Les jours réguliers comme aujourd'hui sont la base de tout le programme. Reposez-vous et à demain chez Caridad. 🍳`
  },
  great: {
    en: (name) =>
      `Love the energy, ${name}! 🌟 Rest up tonight — you've earned it. See you tomorrow at Caridad for another great day.`,
    es: (name) =>
      `¡Qué buena energía, ${name}! 🌟 Descansa esta noche — te lo has ganado. Hasta mañana en Caridad.`,
    fr: (name) =>
      `Quelle énergie, ${name} ! 🌟 Reposez-vous ce soir — vous l'avez mérité. À demain chez Caridad pour une autre belle journée.`
  }
};

function getRatingKey(rating) {
  if (rating <= 1) return "struggling";
  if (rating === 2) return "worried";
  if (rating === 3) return "okay";
  return "great";
}

function getTopBarrier(factors) {
  for (const key of ["transportation", "housing", "childcare", "overwhelmed"]) {
    if (factors.some(f => f.toLowerCase().includes(
      key === "overwhelmed" ? "overwhelm" : key
    ))) return key;
  }
  return "default";
}

async function callLlmFunction(body) {
  const res = await fetch("/.netlify/functions/llm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Function returned ${res.status}`);
  return res.json();
}

export async function generateStaffExplanation(participant, riskResult) {
  try {
    const data = await callLlmFunction({ type: "staff", participant, riskResult });
    return {
      explanation:     data.explanation,
      suggestedAction: data.suggestedAction,
      messageDraft:    data.messageDraft ?? null,
    };
  } catch {
    // Fallback: pre-written templates
    const barrierKey = getTopBarrier(riskResult.factors);
    const template   = STAFF_EXPLANATIONS[barrierKey] || STAFF_EXPLANATIONS.default;
    return {
      explanation:     template.explanation(participant.firstName, participant.currentWeek),
      suggestedAction: template.suggestedAction,
      messageDraft:
        participant.supportPreference === "none" || participant.supportPreference === "reminder"
          ? null
          : typeof template.messageDraft === "function"
          ? template.messageDraft(participant.firstName)
          : template.messageDraft,
    };
  }
}

export async function generateCohortNarration(participants, weather) {
  try {
    return await callLlmFunction({ type: "cohort", participants, weather });
  } catch {
    return null;
  }
}

export async function extractBarriers(text, participantName) {
  try {
    return await callLlmFunction({ type: "barrier_extract", text, participantName });
  } catch {
    return { barriers: [], summary: text };
  }
}

export async function generateInterventionRanking(participant, riskResult) {
  try {
    const data = await callLlmFunction({ type: "interventions", participant, riskResult });
    return Array.isArray(data) ? data : (data.interventions || null);
  } catch {
    return null;
  }
}

export async function extractFullCheckin(text, participantName, lang = "en") {
  try {
    return await callLlmFunction({ type: "full_checkin", text, participantName, lang });
  } catch {
    return { feelingRating: 3, barriers: [], supportPreference: "none", summary: text };
  }
}

export async function matchResourcesAI(barriers, participantContext, lang = "en") {
  try {
    return await callLlmFunction({ type: "match_resources", barriers, participantContext, lang });
  } catch {
    return null;
  }
}

export async function detectCohortAnomalies(participants, riskResults, weather) {
  try {
    return await callLlmFunction({ type: "detect_anomalies", participants, riskResults, weather });
  } catch {
    return null;
  }
}

export async function generateParticipantMessage(participant, selectedBarriers, _weatherContext, lang = "en") {
  try {
    const data = await callLlmFunction({ type: "participant", participant, selectedBarriers });
    return {
      english: data.english,
      spanish: data.spanish,
      french:  data.french,
    };
  } catch {
    // Fallback: pre-written templates
    const key      = getRatingKey(participant.feelingRating || 3);
    const template = PARTICIPANT_MESSAGES[key];
    return {
      english: template.en(participant.firstName, selectedBarriers),
      spanish: template.es(participant.firstName, selectedBarriers),
      french:  template.fr(participant.firstName, selectedBarriers),
    };
  }
}
