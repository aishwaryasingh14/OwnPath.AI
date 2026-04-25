import { useState } from "react";
import { generateStaffExplanation } from "../../lib/anthropicClient";
import LoadingSpinner from "../common/LoadingSpinner";
import AnimatedNumber from "../common/AnimatedNumber";

const LEVEL_CONFIG = {
  high:   { bg: "rgba(192,57,43,0.05)",  border: "#C0392B", accent: "var(--risk-high)",   label: "HIGH",   dots: 4 },
  medium: { bg: "rgba(230,126,34,0.05)", border: "#E67E22", accent: "var(--risk-medium)", label: "MEDIUM", dots: 3 },
  low:    { bg: "transparent",           border: "#E8E0D5", accent: "var(--risk-low)",    label: "LOW",    dots: 1 }
};

const SUPPORT_LABELS = {
  resources:     { icon: "📋", label: "Requested resources only" },
  reminder:      { icon: "⏰", label: "Requested a reminder" },
  staff_contact: { icon: "🤝", label: "Requested staff contact" },
  peer:          { icon: "💬", label: "Requested peer connection" },
  none:          { icon: "✓",  label: "No contact requested" }
};

export default function ParticipantCard({ participant, riskResult, onSelect, isSelected }) {
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const cfg = LEVEL_CONFIG[riskResult.level];
  const supportMeta = SUPPORT_LABELS[participant.supportPreference] || SUPPORT_LABELS.none;

  const loadAI = async () => {
    if (aiData || aiLoading) return;
    setAiLoading(true);
    const data = await generateStaffExplanation(participant, riskResult);
    setAiData(data);
    setAiLoading(false);
  };

  const handleExpand = () => {
    if (!isSelected) loadAI();
    onSelect(isSelected ? null : participant.id);
  };

  const initials = participant.firstName[0] + (participant.lastName[0] || "");

  return (
    <div
      onClick={handleExpand}
      style={{
        background: isSelected ? cfg.bg : "var(--bg-card)",
        border: `1.5px solid ${isSelected ? cfg.border : "var(--border)"}`,
        borderRadius: "var(--radius)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.22s ease",
        boxShadow: isSelected ? `0 4px 20px ${cfg.border}22` : "var(--shadow)",
        transform: isSelected ? "none" : undefined
      }}
      className="hover-lift"
    >
      {/* Risk accent bar */}
      <div style={{
        height: 3,
        background: riskResult.level === "low"
          ? "var(--risk-low)"
          : riskResult.level === "medium"
          ? "linear-gradient(90deg, var(--risk-medium), #f5a623)"
          : "linear-gradient(90deg, var(--risk-high), #e74c3c)"
      }} />

      {/* Card body */}
      <div style={{ padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          {/* Avatar */}
          <div style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${cfg.accent}22, ${cfg.accent}44)`,
            border: `2px solid ${cfg.accent}55`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: "0.9rem", color: cfg.accent,
            fontFamily: "'DM Serif Display', serif"
          }}>
            {initials}
          </div>

          {/* Name + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700, fontSize: "0.975rem" }}>
                {participant.firstName} {participant.lastName}
              </span>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: cfg.accent,
                background: `${cfg.accent}15`,
                padding: "0.15rem 0.5rem", borderRadius: "50px"
              }}>
                {cfg.label}
              </span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1px" }}>
              Week {participant.currentWeek} · Day {participant.currentDay}
              {!participant.checkedInToday && (
                <span style={{ color: "var(--risk-medium)", marginLeft: "0.5rem", fontWeight: 600 }}>
                  · No check-in yet
                </span>
              )}
            </div>
          </div>

          {/* Completion meter */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{
              fontSize: "1.4rem",
              fontFamily: "'DM Serif Display', serif",
              fontWeight: 700,
              color: cfg.accent,
              lineHeight: 1
            }}>
              <AnimatedNumber value={riskResult.completionProbability} />%
            </div>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "1px" }}>completion</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "0.75rem", height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${riskResult.completionProbability}%`,
            background: riskResult.level === "low"
              ? "var(--risk-low)"
              : riskResult.level === "medium"
              ? "linear-gradient(90deg, var(--risk-medium), #f5a623)"
              : "linear-gradient(90deg, var(--risk-high), #e74c3c)",
            borderRadius: 3,
            transition: "width 1s ease"
          }} />
        </div>

        {/* Top factor */}
        {riskResult.factors.length > 0 && (
          <div style={{
            marginTop: "0.6rem",
            fontSize: "0.78rem",
            color: "var(--text-secondary)",
            display: "flex", alignItems: "flex-start", gap: "0.3rem"
          }}>
            <span style={{ color: cfg.accent, flexShrink: 0 }}>↳</span>
            <span>{riskResult.factors[0]}</span>
            {riskResult.factors.length > 1 && (
              <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                &nbsp;+{riskResult.factors.length - 1} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded detail */}
      {isSelected && (
        <div
          style={{ borderTop: "1px solid var(--border)", padding: "1rem 1.25rem", background: "rgba(255,255,255,0.6)" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Support preference pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.75rem", fontWeight: 600,
            color: "var(--brand-secondary)",
            background: "rgba(44,95,46,0.08)",
            border: "1px solid rgba(44,95,46,0.2)",
            padding: "0.3rem 0.8rem", borderRadius: "50px",
            marginBottom: "1rem"
          }}>
            <span>{supportMeta.icon}</span>
            <span>{supportMeta.label}</span>
          </div>

          {/* All risk factors */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.45rem"
            }}>
              Why they're on your radar
            </div>
            {riskResult.factors.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "0.4rem",
                fontSize: "0.82rem", color: "var(--text-secondary)",
                padding: "0.2rem 0"
              }}>
                <span style={{ color: cfg.accent, flexShrink: 0, marginTop: "1px" }}>•</span>
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* AI explanation */}
          {aiLoading ? (
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              color: "var(--text-muted)", fontSize: "0.82rem",
              padding: "0.75rem",
              background: "var(--bg-warm)",
              borderRadius: "var(--radius-sm)",
              marginBottom: "1rem"
            }}>
              <LoadingSpinner size={16} />
              <span>Generating plain-English summary...</span>
            </div>
          ) : aiData ? (
            <div style={{
              background: "rgba(212,80,10,0.04)",
              border: "1px solid rgba(212,80,10,0.14)",
              borderRadius: "var(--radius-sm)",
              padding: "0.875rem 1rem",
              marginBottom: "1rem"
            }}>
              <div style={{
                fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.09em", color: "var(--brand-primary)", marginBottom: "0.45rem",
                display: "flex", alignItems: "center", gap: "0.35rem"
              }}>
                <span style={{ fontSize: "0.8rem" }}>✦</span> AI Summary
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.6, marginBottom: "0.5rem" }}>
                {aiData.explanation}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                Suggested: {aiData.suggestedAction}
              </p>
              {aiData.messageDraft && (
                <div style={{
                  marginTop: "0.65rem",
                  padding: "0.6rem 0.875rem",
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "var(--radius-sm)",
                  borderLeft: "3px solid var(--brand-primary)",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                  fontStyle: "italic"
                }}>
                  Draft message: "{aiData.messageDraft}"
                </div>
              )}
            </div>
          ) : null}

          {/* Action buttons */}
          <div style={{
            fontSize: "0.68rem", color: "var(--text-muted)",
            marginBottom: "0.5rem", fontWeight: 500
          }}>
            All outreach requires your approval ↓
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
            {[
              { id: "transit", label: "✉️ Send Sun Tran info",      show: participant.reportedBarriers?.includes("transportation") },
              { id: "call",    label: "📞 Quick check-in call",     show: participant.supportPreference !== "none" },
              { id: "makeup",  label: "🗓️ Offer make-up session",   show: participant.missedDays > 0 },
              { id: "peer",    label: "💬 Connect with peer",       show: true }
            ].filter(a => a.show).slice(0, 4).map(action => (
              <button
                key={action.id}
                onClick={() => setActionTaken(prev => prev === action.id ? null : action.id)}
                style={{
                  padding: "0.6rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: actionTaken === action.id
                    ? "1.5px solid var(--brand-secondary)"
                    : "1.5px solid var(--border)",
                  background: actionTaken === action.id ? "rgba(44,95,46,0.1)" : "var(--bg-warm)",
                  fontSize: "0.775rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  color: actionTaken === action.id ? "var(--brand-secondary)" : "var(--text-primary)"
                }}
              >
                {actionTaken === action.id ? "✓ Done" : action.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setDismissed(true)}
            style={{
              marginTop: "0.5rem", width: "100%",
              padding: "0.5rem", borderRadius: "var(--radius-sm)",
              border: "1px dashed var(--border)",
              background: "transparent",
              fontSize: "0.78rem", color: "var(--text-muted)",
              cursor: "pointer", transition: "all 0.18s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-warm)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            Skip — they're good 👍
          </button>
        </div>
      )}
    </div>
  );
}
