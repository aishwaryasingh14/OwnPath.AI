import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
