import { DEMO_PARTICIPANTS } from "../../data/participants";
import { calculateRiskScore } from "../../lib/riskEngine";

export default function CohortInsights({ weather }) {
  const transportIssues = DEMO_PARTICIPANTS.filter(p =>
    p.reportedBarriers?.includes("transportation")
  ).length;

  const week3Count = DEMO_PARTICIPANTS.filter(p => p.currentWeek === 3).length;

  const recoveryExamples = DEMO_PARTICIPANTS.filter(p => p.recoveryNote);

  return (
    <div className="card" style={{ marginTop: "1rem" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "1rem"
      }}>
        <span style={{ fontSize: "1.2rem" }}>📊</span>
        <h3 style={{ fontSize: "1rem", fontFamily: "'DM Serif Display', serif" }}>
          Program-Level Patterns This Week
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

        {/* Transport pattern */}
        {transportIssues >= 2 && (
          <div style={{
            padding: "0.875rem",
            background: "rgba(212,80,10,0.05)",
            border: "1px solid rgba(212,80,10,0.15)",
            borderRadius: "var(--radius-sm)"
          }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.3rem", color: "var(--brand-primary)" }}>
              🚌 Week 3 Transportation Signal
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55, marginBottom: "0.5rem" }}>
              <strong>{transportIssues} participants</strong> reporting transport issues this week (vs. 1 last cohort at this point).
            </p>
            <div style={{
              fontSize: "0.78rem",
              padding: "0.5rem 0.75rem",
              background: "rgba(212,80,10,0.07)",
              borderRadius: "var(--radius-sm)",
              color: "var(--brand-primary)"
            }}>
              💡 Consider a group announcement about Sun Tran Day Passes at tomorrow's morning session.
            </div>
          </div>
        )}

        {/* Week 3 pattern */}
        <div style={{
          padding: "0.875rem",
          background: "rgba(245,166,35,0.07)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: "var(--radius-sm)"
        }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.3rem", color: "#b07d0a" }}>
            📅 Week 3 Cohort Watch
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            <strong>{week3Count} participants</strong> are in Week 3, historically the highest dropout week for this program.
            Extra engagement now pays off later.
          </p>
        </div>

        {/* Weather */}
        {weather?.isDangerous && (
          <div style={{
            padding: "0.875rem",
            background: "rgba(192,57,43,0.05)",
            border: "1px solid rgba(192,57,43,0.15)",
            borderRadius: "var(--radius-sm)"
          }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.3rem", color: "var(--risk-high)" }}>
              🌡️ Extreme Heat Tomorrow
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
              Forecast: <strong>{weather.temp}°F</strong> — {weather.description}. This increases transportation difficulty for participants without vehicles.
            </p>
          </div>
        )}

        {/* Recovery stories */}
        {recoveryExamples.length > 0 && (
          <div style={{
            padding: "0.875rem",
            background: "rgba(44,95,46,0.06)",
            border: "1px solid rgba(44,95,46,0.18)",
            borderRadius: "var(--radius-sm)"
          }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--brand-secondary)" }}>
              ✨ Interventions That Worked
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recoveryExamples.slice(0, 2).map((p, i) => (
                <div key={i} style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <span style={{ fontWeight: 600 }}>{p.firstName} {p.lastName}:</span>{" "}
                  {p.recoveryNote}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary note */}
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
          These are aggregate patterns from the current cohort. No individual data is shared here — individual details are on participant cards only.
        </p>
      </div>
    </div>
  );
}
