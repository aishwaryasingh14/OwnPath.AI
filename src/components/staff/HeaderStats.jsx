import AnimatedNumber from "../common/AnimatedNumber";
import Icon from "../common/Icon";

export default function HeaderStats({ participants, riskResults }) {
  const total    = participants.length;
  const checkedIn = participants.filter(p => p.checkedInToday).length;
  const high      = participants.filter((_, i) => riskResults[i]?.level === "high").length;
  const medium    = participants.filter((_, i) => riskResults[i]?.level === "medium").length;
  const low       = participants.filter((_, i) => riskResults[i]?.level === "low").length;
  const pct       = Math.round((checkedIn / total) * 100);

  const stats = [
    {
      icon: "users",
      iconColor: "var(--brand-primary)",
      iconBg: "rgba(212,80,10,0.08)",
      label: "Check-ins received",
      value: checkedIn,
      sub: `of ${total} participants`,
      bar: pct,
      barColor: "var(--brand-primary)"
    },
    {
      icon: "alert",
      iconColor: "var(--risk-medium)",
      iconBg: "rgba(230,126,34,0.08)",
      label: "Needs attention",
      value: high + medium,
      sub: `${high} high · ${medium} medium risk`,
      bar: Math.round(((high + medium) / total) * 100),
      barColor: high > 0 ? "var(--risk-high)" : "var(--risk-medium)"
    },
    {
      icon: "trending",
      iconColor: "var(--risk-low)",
      iconBg: "rgba(39,174,96,0.08)",
      label: "On track",
      value: low,
      sub: "low risk, no action needed",
      bar: Math.round((low / total) * 100),
      barColor: "var(--risk-low)"
    }
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem", marginBottom: "1.5rem" }}>
      {stats.map((s, i) => (
        <div key={i} className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.label}
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "var(--radius-sm)",
              background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon name={s.icon} size={15} color={s.iconColor} />
            </div>
          </div>
          <div style={{
            fontSize: "1.9rem", fontFamily: "'DM Serif Display', serif",
            fontWeight: 700, color: "var(--text-primary)", lineHeight: 1, marginBottom: "0.3rem"
          }}>
            <AnimatedNumber value={s.value} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
            {s.sub}
          </div>
          <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${s.bar}%`,
              background: s.barColor,
              borderRadius: 2,
              transition: "width 1.2s ease"
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
