import AnimatedNumber from "../common/AnimatedNumber";

export default function HeaderStats({ participants, riskResults }) {
  const total = participants.length;
  const checkedIn = participants.filter(p => p.checkedInToday).length;
  const flagged = participants.filter((p, i) => riskResults[i]?.level !== "low").length;
  const doingWell = participants.filter((p, i) =>
    p.checkedInToday && riskResults[i]?.level === "low"
  ).length;

  const stats = [
    { icon: "📋", label: "Check-ins today", value: `${checkedIn}/${total}`, raw: checkedIn },
    { icon: "⚠️", label: "Need attention", value: flagged, raw: flagged, color: flagged > 0 ? "var(--risk-medium)" : undefined },
    { icon: "✅", label: "Doing well", value: doingWell, raw: doingWell, color: "var(--risk-low)" }
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.75rem",
      marginBottom: "1.25rem"
    }}>
      {stats.map((s, i) => (
        <div key={i} className="card" style={{ padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: "1.4rem", marginBottom: "0.2rem" }}>{s.icon}</div>
          <div style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: s.color || "var(--text-primary)",
            fontFamily: "'DM Serif Display', serif",
            lineHeight: 1.1
          }}>
            {typeof s.value === "number"
              ? <AnimatedNumber value={s.raw} />
              : s.value}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
