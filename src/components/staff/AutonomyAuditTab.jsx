import { DEMO_PARTICIPANTS } from "../../data/participants";

export default function AutonomyAuditTab() {
  const total = DEMO_PARTICIPANTS.length;
  const optedIn = DEMO_PARTICIPANTS.filter(p => p.supportPreference !== "none").length;
  const noContact = DEMO_PARTICIPANTS.filter(p => p.supportPreference === "none").length;
  const resourceOnly = DEMO_PARTICIPANTS.filter(p => p.supportPreference === "resources").length;
  const directContact = DEMO_PARTICIPANTS.filter(p => ["staff_contact", "peer"].includes(p.supportPreference)).length;

  const metrics = [
    { value: total, label: "Participants in cohort", note: "Synthetic demo class" },
    { value: optedIn, label: "Opted into any support", note: "Resources, reminders, staff, or peer" },
    { value: noContact, label: "Chose no contact", note: "Respected in action buttons" },
    { value: directContact, label: "Direct contact allowed", note: "Only when participant asked" }
  ];

  const promises = [
    "Participants choose what to share",
    "Default support preference is no contact",
    "Staff sees consent boundaries before actions",
    "AI explains signals but never sends messages",
    "Program insights are aggregate, not individual surveillance"
  ];

  const excluded = [
    "Location tracking",
    "Immigration or legal status",
    "Social media or outside data",
    "Background checks",
    "Anything not shared by the participant"
  ];

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: "0.5rem" }}>
          Prize proof
        </p>
        <h2 style={{ fontSize: "1.55rem", marginBottom: "0.5rem" }}>Autonomy Audit</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.65, maxWidth: 720 }}>
          This tab shows judges how OwnPath protects participant choice in the product itself. The point is not just to predict who needs help. The point is to make support consent-aware.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.875rem", marginBottom: "1rem" }}>
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ padding: "1rem" }}>
            <div style={{ fontSize: "1.8rem", fontFamily: "'DM Serif Display', serif", color: "var(--brand-primary)", lineHeight: 1 }}>
              {m.value}
            </div>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, marginTop: "0.35rem" }}>{m.label}</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem", lineHeight: 1.4 }}>{m.note}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1rem", alignItems: "start" }}>
        <div className="card">
          <h3 style={{ fontSize: "1.05rem", marginBottom: "0.8rem" }}>Participant Bill of Rights</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {promises.map((p, i) => (
              <div key={p} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "rgba(44,95,46,0.1)",
                  color: "var(--brand-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: "1.05rem", marginBottom: "0.8rem" }}>Data OwnPath Refuses</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {excluded.map(item => (
              <div key={item} style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                padding: "0.55rem 0.65rem",
                borderRadius: "var(--radius-sm)",
                background: "rgba(192,57,43,0.04)",
                border: "1px solid rgba(192,57,43,0.12)"
              }}>
                <span style={{ color: "var(--risk-high)", fontWeight: 800 }}>✗</span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem", background: "rgba(44,95,46,0.05)", borderColor: "rgba(44,95,46,0.18)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          {[
            { label: "Resources only", value: resourceOnly, detail: "Share links, no call unless they later opt in" },
            { label: "No-contact honored", value: noContact, detail: "Visible in cards and action filtering" },
            { label: "Human approval", value: "100%", detail: "Every outreach button is manual" }
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "1.5rem", fontFamily: "'DM Serif Display', serif", color: "var(--brand-secondary)", lineHeight: 1.1, marginTop: "0.25rem" }}>
                {item.value}
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5, marginTop: "0.3rem" }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
