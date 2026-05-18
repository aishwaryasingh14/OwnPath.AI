import { useState } from "react";
import { DEMO_PARTICIPANTS } from "../../data/participants";
import { calculateRiskScore } from "../../lib/riskEngine";
import { generateCohortNarration } from "../../lib/groqClient";
import LoadingSpinner from "../common/LoadingSpinner";

export default function CohortInsights({ weather }) {
  const [narration, setNarration] = useState(null);
  const [loadingNarration, setLoadingNarration] = useState(false);

  const handleGenerateNarration = async () => {
    setLoadingNarration(true);
    const result = await generateCohortNarration(DEMO_PARTICIPANTS, weather);
    setNarration(result);
    setLoadingNarration(false);
  };

  const riskResults = DEMO_PARTICIPANTS.map(p => calculateRiskScore(p, weather?.temp || 85));
  const transportIssues = DEMO_PARTICIPANTS.filter(p => p.reportedBarriers?.includes("transportation")).length;
  const childcareIssues = DEMO_PARTICIPANTS.filter(p => p.reportedBarriers?.includes("childcare")).length;
  const housingIssues = DEMO_PARTICIPANTS.filter(p => p.reportedBarriers?.includes("housing")).length;
  const week3Count = DEMO_PARTICIPANTS.filter(p => p.currentWeek === 3).length;
  const recoveryExamples = DEMO_PARTICIPANTS.filter(p => p.recoveryNote);
  const optedIntoSupport = DEMO_PARTICIPANTS.filter(p =>
    ["resources", "reminder", "staff_contact", "peer"].includes(p.supportPreference)
  ).length;
  const noContact = DEMO_PARTICIPANTS.filter(p => p.supportPreference === "none").length;
  const highOrMedium = riskResults.filter(r => r.level !== "low").length;

  const patternRows = [
    { label: "Transportation", value: transportIssues, color: "var(--brand-primary)" },
    { label: "Childcare", value: childcareIssues, color: "var(--brand-accent)" },
    { label: "Housing", value: housingIssues, color: "var(--brand-secondary)" }
  ];
  const maxPattern = Math.max(...patternRows.map(r => r.value), 1);

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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          <div style={{
            padding: "0.875rem",
            background: "rgba(44,95,46,0.05)",
            border: "1px solid rgba(44,95,46,0.16)",
            borderRadius: "var(--radius-sm)"
          }}>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.25rem" }}>
              Autonomy pulse
            </div>
            <div style={{ fontSize: "1.35rem", fontFamily: "'DM Serif Display', serif", color: "var(--brand-secondary)", lineHeight: 1 }}>
              {noContact}
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45, marginTop: "0.3rem" }}>
              participants chose no contact. Their choice stays visible in staff workflow.
            </p>
          </div>

          <div style={{
            padding: "0.875rem",
            background: "rgba(212,80,10,0.04)",
            border: "1px solid rgba(212,80,10,0.14)",
            borderRadius: "var(--radius-sm)"
          }}>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.25rem" }}>
              Staff focus
            </div>
            <div style={{ fontSize: "1.35rem", fontFamily: "'DM Serif Display', serif", color: "var(--brand-primary)", lineHeight: 1 }}>
              {highOrMedium}
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45, marginTop: "0.3rem" }}>
              may benefit from support out of {DEMO_PARTICIPANTS.length}; the rest stay out of the queue.
            </p>
          </div>
        </div>

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

        <div style={{
          padding: "0.875rem",
          background: "rgba(255,255,255,0.7)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)"
        }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.55rem", color: "var(--text-primary)" }}>
            Fairness Slice: Barrier Types
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {patternRows.map(row => (
              <div key={row.label} style={{ display: "grid", gridTemplateColumns: "95px 1fr 24px", gap: "0.55rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)" }}>{row.label}</span>
                <div style={{ height: 6, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.max(8, (row.value / maxPattern) * 100)}%`,
                    background: row.color,
                    borderRadius: 4
                  }} />
                </div>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "0.65rem" }}>
            This helps staff check whether support is over-focused on one barrier while missing others.
          </p>
        </div>

        <div style={{
          padding: "0.875rem",
          background: "rgba(245,166,35,0.07)",
          border: "1px solid rgba(245,166,35,0.2)",
          borderRadius: "var(--radius-sm)"
        }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.3rem", color: "#8a6100" }}>
            📅 Week 3 Cohort Watch
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>
            <strong>{week3Count} participants</strong> are in Week 3, historically the highest dropout week for this program.
            Extra engagement now pays off later.
          </p>
        </div>

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

        {/* AI cohort narration */}
        <div style={{
          padding: "0.875rem",
          background: narration ? "rgba(44,95,46,0.04)" : "rgba(212,80,10,0.04)",
          border: `1px solid ${narration ? "rgba(44,95,46,0.18)" : "rgba(212,80,10,0.14)"}`,
          borderRadius: "var(--radius-sm)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: narration ? "0.75rem" : 0 }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: narration ? "var(--brand-secondary)" : "var(--brand-primary)" }}>
              🤖 AI Weekly Analysis
            </div>
            {!narration && (
              <button
                onClick={handleGenerateNarration}
                disabled={loadingNarration}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.35rem 0.875rem", borderRadius: "50px",
                  border: "1px solid var(--brand-primary)",
                  background: "transparent", color: "var(--brand-primary)",
                  fontSize: "0.75rem", fontWeight: 600, cursor: loadingNarration ? "default" : "pointer",
                  transition: "all 0.18s ease"
                }}
              >
                {loadingNarration ? <><LoadingSpinner size={13} /> Analyzing…</> : "Generate"}
              </button>
            )}
          </div>

          {!narration && !loadingNarration && (
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Generate an AI-powered analysis of tonight's check-in data — patterns, priorities, and a suggested staff action for this week.
            </p>
          )}

          {narration && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", animation: "fadeInUp 0.3s ease both" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5 }}>
                {narration.headline}
              </p>
              {narration.insights?.map((insight, i) => (
                <div key={i} style={{
                  padding: "0.6rem 0.75rem",
                  background: "rgba(255,255,255,0.6)", borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)"
                }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                    📍 {insight.signal}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: 500 }}>
                    → {insight.action}
                  </div>
                </div>
              ))}
              {narration.priorityThisWeek && (
                <div style={{
                  padding: "0.6rem 0.75rem", borderRadius: "var(--radius-sm)",
                  background: "rgba(212,80,10,0.07)", borderLeft: "3px solid var(--brand-primary)"
                }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--brand-primary)", marginBottom: "0.2rem" }}>
                    Top priority this week
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
                    {narration.priorityThisWeek}
                  </div>
                </div>
              )}
              {narration.positiveNote && (
                <div style={{ fontSize: "0.75rem", color: "var(--brand-secondary)", lineHeight: 1.5 }}>
                  ✨ {narration.positiveNote}
                </div>
              )}
              <button
                onClick={() => setNarration(null)}
                style={{ alignSelf: "flex-start", background: "none", border: "none", fontSize: "0.7rem", color: "var(--text-muted)", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                Refresh analysis
              </button>
            </div>
          )}
        </div>

        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
          These are aggregate patterns from the current cohort. {optedIntoSupport} participants opted into some support, and individual details stay on participant cards only.
        </p>
      </div>
    </div>
  );
}
