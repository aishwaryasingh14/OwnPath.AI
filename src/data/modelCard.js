export const MODEL_CARD = {
  version: "1.0",
  date: "April 2026",
  team: "OwnPath — Hack Arizona 2026",
  rows: [
    {
      label: "INTENDED USE",
      content: "Support retention in Caridad Community Kitchen culinary training program. Route participants to helpful resources while enrolled."
    },
    {
      label: "NOT FOR",
      bullets: [
        "Admissions decisions",
        "Disciplinary action",
        "Removal from program",
        "Benefit eligibility",
        "Replacing staff judgment"
      ],
      negative: true
    },
    {
      label: "INPUTS\n(what the model sees)",
      bullets: [
        "Attendance record",
        "Program week",
        "Optional self-reported barriers (participant chooses what to share)",
        "Public weather forecast (NWS API, Tucson)"
      ]
    },
    {
      label: "EXCLUDED INPUTS",
      bullets: [
        "Location tracking",
        "Background data collection",
        "Social media or outside data",
        "Immigration or legal status",
        "Any data shared without consent"
      ],
      negative: true
    },
    {
      label: "HOW AI IS USED",
      content: "Rule-based risk scoring generates the risk score. Claude API generates ONLY plain-English explanations and kind message drafts. The LLM never decides who is flagged. It only explains."
    },
    {
      label: "HUMAN IN THE LOOP",
      content: "All outreach beyond automated reminders requires staff approval. Staff may override, dismiss, or escalate any flag at any time."
    },
    {
      label: "PERFORMANCE METRICS\n(to track post-deploy)",
      bullets: [
        "Target: Precision ≥ 70% on high-risk flags",
        "Subgroup checks: transport vs childcare vs housing stressors",
        "Autonomy pulse: 'I felt in control' (participant survey)"
      ]
    },
    {
      label: "LIMITATIONS",
      content: "Based on program patterns, not a clinical instrument. Estimates not guarantees. Outcomes depend on many factors. Do not use as sole basis for any decision."
    }
  ]
};
