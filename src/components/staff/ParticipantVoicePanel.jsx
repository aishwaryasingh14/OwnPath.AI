const VOICE_GUIDE = {
  transportation: {
    strength: "Shows up even when the route is not working",
    ask: "Would bus pass info or a make-up slot help tomorrow?",
    avoid: "Do not imply attendance is a character issue",
    support: "Offer Route 8 details and ask if the timing works"
  },
  housing: {
    strength: "Keeps checking in during a stressful week",
    ask: "Would it help to talk through housing resources together?",
    avoid: "Do not ask for details they did not choose to share",
    support: "Offer 211 Arizona and a low-pressure staff conversation"
  },
  childcare: {
    strength: "Planning ahead around family responsibilities",
    ask: "Would childcare referral information be useful today?",
    avoid: "Do not frame caregiving as a lack of commitment",
    support: "Share ADES and 211 childcare referrals"
  },
  overwhelmed: {
    strength: "Named the stress instead of disappearing",
    ask: "Would a quick hello before class help you feel settled?",
    avoid: "Do not turn a hard day into a crisis label",
    support: "Offer a two-minute check-in or peer connection"
  },
  default: {
    strength: "Still connected to the program",
    ask: "What would make tomorrow a little easier?",
    avoid: "Do not assume what they need",
    support: "Start with a warm, open-ended check-in"
  }
};

function getPrimaryGuide(participant) {
  const barrier = participant.reportedBarriers?.find(b => VOICE_GUIDE[b]) || "default";
  return VOICE_GUIDE[barrier];
}

export default function ParticipantVoicePanel({ participant }) {
  const guide = getPrimaryGuide(participant);
  const shared = participant.reportedBarriers?.length
    ? participant.reportedBarriers.join(", ")
    : "No barrier shared";

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", marginBottom: "1rem" }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: "var(--radius-sm)",
          background: "rgba(44,95,46,0.08)",
          border: "1px solid rgba(44,95,46,0.16)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem"
        }}>
          💬
        </div>
        <div>
          <h3 style={{ fontSize: "0.925rem", fontFamily: "'DM Serif Display', serif", lineHeight: 1.2 }}>
            Participant Voice
          </h3>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
            Staff support starts with context
          </p>
        </div>
      </div>

      <div style={{
        padding: "0.85rem",
        background: "var(--bg-warm)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        marginBottom: "0.75rem"
      }}>
        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.3rem" }}>
          What we know because they chose to share
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--text-primary)", lineHeight: 1.55 }}>
          {participant.story || `${participant.firstName} checked in today.`}
        </p>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
          <span style={{
            fontSize: "0.68rem",
            color: "var(--brand-secondary)",
            background: "rgba(44,95,46,0.08)",
            border: "1px solid rgba(44,95,46,0.16)",
            borderRadius: "50px",
            padding: "0.18rem 0.55rem"
          }}>
            Shared: {shared}
          </span>
          <span style={{
            fontSize: "0.68rem",
            color: "var(--brand-primary)",
            background: "rgba(212,80,10,0.07)",
            border: "1px solid rgba(212,80,10,0.14)",
            borderRadius: "50px",
            padding: "0.18rem 0.55rem"
          }}>
            Preference: {participant.supportPreference.replace("_", " ")}
          </span>
        </div>
      </div>

      {[
        { label: "Strength to notice", value: guide.strength, color: "var(--brand-secondary)" },
        { label: "Ask, don't assume", value: guide.ask, color: "var(--brand-primary)" },
        { label: "Avoid", value: guide.avoid, color: "var(--risk-high)" },
        { label: "Warm next step", value: guide.support, color: "var(--brand-accent)" }
      ].map(row => (
        <div key={row.label} style={{
          display: "grid",
          gridTemplateColumns: "96px 1fr",
          gap: "0.65rem",
          padding: "0.55rem 0",
          borderTop: "1px solid var(--border)"
        }}>
          <div style={{ fontSize: "0.68rem", color: row.color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1.35 }}>
            {row.label}
          </div>
          <div style={{ fontSize: "0.79rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {row.value}
          </div>
        </div>
      ))}
    </div>
  );
}
