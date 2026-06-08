import { useState } from "react";
import { generateStaffExplanation } from "../../lib/groqClient";
import { findPeerMatch, getPeerMatchReason } from "../../lib/peerMatching";
import { DEMO_PARTICIPANTS } from "../../data/participants";
import LoadingSpinner from "../common/LoadingSpinner";
import AnimatedNumber from "../common/AnimatedNumber";

const OUTCOMES_KEY = "ownpath_outcomes";
const getOutcomes = () => { try { return JSON.parse(localStorage.getItem(OUTCOMES_KEY)) || {}; } catch { return {}; } };
const saveOutcome = (id, status) => {
  const outcomes = getOutcomes();
  if (status === null) { delete outcomes[id]; }
  else { outcomes[id] = { status, date: new Date().toISOString() }; }
  localStorage.setItem(OUTCOMES_KEY, JSON.stringify(outcomes));
};

const TREND_CONFIG = {
  declining:  { color: "var(--risk-high)",   icon: "↘", label: "Declining" },
  struggling: { color: "var(--risk-medium)", icon: "→", label: "Struggling" },
  stable:     { color: "var(--text-muted)",  icon: "→", label: "Stable" },
  improving:  { color: "var(--risk-low)",    icon: "↗", label: "Improving" }
};

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

const SUPPORT_BOUNDARIES = {
  resources: "Do not call unless Rosa asks. Share resources only.",
  reminder: "Reminder is okay. Do not escalate to a call unless they opt in.",
  staff_contact: "Direct staff outreach is allowed because they asked for it.",
  peer: "Peer connection is allowed. Staff still confirms the match first.",
  none: "No direct outreach. Staff may observe patterns, but participant chose no contact."
};

const MOOD_COLORS = {
  great:     "var(--risk-low)",
  okay:      "var(--brand-accent)",
  worried:   "var(--risk-medium)",
  struggling:"var(--risk-high)"
};

export default function ParticipantCard({ participant, riskResult, onSelect, isSelected, allParticipants }) {
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [actionTaken, setActionTaken] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [note, setNote] = useState(
    () => localStorage.getItem(`ownpath_note_${participant.id}`) || ""
  );
  const [noteSaved, setNoteSaved] = useState(false);
  const [outcome, setOutcome] = useState(() => getOutcomes()[participant.id] || null);

  if (dismissed) return null;

  const participants = allParticipants || DEMO_PARTICIPANTS;
  const peerMatch = (participant.supportPreference === "peer" || participant.supportPreference === "staff_contact")
    ? findPeerMatch(participant, participants)
    : null;
  const peerReason = peerMatch ? getPeerMatchReason(participant, peerMatch) : null;

  const handleOutcome = (status) => {
    saveOutcome(participant.id, status);
    setOutcome({ status, date: new Date().toISOString() });
  };

  const cfg = LEVEL_CONFIG[riskResult.level];
  const supportMeta = SUPPORT_LABELS[participant.supportPreference] || SUPPORT_LABELS.none;
  const supportBoundary = SUPPORT_BOUNDARIES[participant.supportPreference] || SUPPORT_BOUNDARIES.none;
  const canContact = ["staff_contact", "peer", "reminder"].includes(participant.supportPreference);
  const canSendResources = participant.supportPreference === "resources" || participant.supportPreference === "staff_contact";

  const saveNote = (val) => {
    setNote(val);
    localStorage.setItem(`ownpath_note_${participant.id}`, val);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

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
  const history = participant.checkinHistory || [];

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
                letterSpacing: "0.07em", color: cfg.accent,
                background: `${cfg.accent}15`, padding: "0.15rem 0.5rem", borderRadius: "50px"
              }}>
                {cfg.label}
              </span>
              {riskResult.trajectory && riskResult.trajectory !== "stable" && (() => {
                const tc = TREND_CONFIG[riskResult.trajectory];
                return tc ? (
                  <span title={`Mood trend: ${tc.label}`} style={{
                    fontSize: "0.65rem", color: tc.color,
                    background: `${tc.color}15`, border: `1px solid ${tc.color}40`,
                    padding: "0.1rem 0.4rem", borderRadius: "50px", fontWeight: 600
                  }}>{tc.icon} {tc.label}</span>
                ) : null;
              })()}
              {outcome && (
                <span style={{
                  fontSize: "0.65rem", fontWeight: 700,
                  color: outcome.status === "graduated" ? "var(--risk-low)" : "var(--text-muted)",
                  background: outcome.status === "graduated" ? "rgba(44,95,46,0.1)" : "rgba(0,0,0,0.05)",
                  border: `1px solid ${outcome.status === "graduated" ? "rgba(44,95,46,0.25)" : "var(--border)"}`,
                  padding: "0.1rem 0.4rem", borderRadius: "50px"
                }}>{outcome.status === "graduated" ? "🎓 Graduated" : "⚠ Dropped"}</span>
              )}
              {note && (
                <span style={{
                  fontSize: "0.65rem", color: "var(--text-muted)",
                  background: "var(--bg-warm)", border: "1px solid var(--border)",
                  padding: "0.1rem 0.4rem", borderRadius: "50px"
                }}>📝 note</span>
              )}
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
              fontSize: "1.4rem", fontFamily: "'DM Serif Display', serif",
              fontWeight: 700, color: cfg.accent, lineHeight: 1
            }}>
              <AnimatedNumber value={riskResult.completionProbability} />%
            </div>
            <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", marginTop: "1px" }}>completion</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: "0.75rem", height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${riskResult.completionProbability}%`,
            background: riskResult.level === "low" ? "var(--risk-low)"
              : riskResult.level === "medium" ? "linear-gradient(90deg, var(--risk-medium), #f5a623)"
              : "linear-gradient(90deg, var(--risk-high), #e74c3c)",
            borderRadius: 3, transition: "width 1s ease"
          }} />
        </div>

        {/* Top factor */}
        {riskResult.factors.length > 0 && (
          <div style={{
            marginTop: "0.6rem", fontSize: "0.78rem", color: "var(--text-secondary)",
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

      {/* Expanded detail — animated in */}
      {isSelected && (
        <div
          style={{
            borderTop: "1px solid var(--border)", padding: "1rem 1.25rem",
            background: "rgba(255,255,255,0.6)",
            animation: "fadeInUp 0.22s ease both"
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Support preference pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            fontSize: "0.75rem", fontWeight: 600, color: "var(--brand-secondary)",
            background: "rgba(44,95,46,0.08)", border: "1px solid rgba(44,95,46,0.2)",
            padding: "0.3rem 0.8rem", borderRadius: "50px", marginBottom: "1rem"
          }}>
            <span>{supportMeta.icon}</span>
            <span>{supportMeta.label}</span>
          </div>

          {/* Consent boundary */}
          <div style={{
            display: "flex", gap: "0.6rem", alignItems: "flex-start",
            padding: "0.75rem 0.875rem",
            background: "rgba(44,95,46,0.06)", border: "1px solid rgba(44,95,46,0.16)",
            borderRadius: "var(--radius-sm)", marginBottom: "1rem"
          }}>
            <span style={{ color: "var(--brand-secondary)", fontWeight: 800, lineHeight: 1 }}>✓</span>
            <div>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "var(--brand-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "0.15rem" }}>
                Consent boundary
              </div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {supportBoundary.replace("Rosa", participant.firstName)}
              </p>
            </div>
          </div>

          {/* Mood history */}
          {history.length > 0 && (
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.45rem" }}>
                Mood history ({history.length} check-ins)
              </div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                {history.map((h, i) => (
                  <div key={i} title={h} style={{
                    width: 16, height: 16, borderRadius: "4px",
                    background: MOOD_COLORS[h] || "var(--border)", opacity: 0.85,
                    flexShrink: 0
                  }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { color: "var(--risk-low)",    label: "Great" },
                  { color: "var(--brand-accent)", label: "Okay" },
                  { color: "var(--risk-medium)",  label: "Worried" },
                  { color: "var(--risk-high)",    label: "Struggling" }
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "2px", background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All risk factors */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.45rem" }}>
              Why they're on your radar
            </div>
            {riskResult.factors.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "0.4rem",
                fontSize: "0.82rem", color: "var(--text-secondary)", padding: "0.2rem 0"
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
              color: "var(--text-muted)", fontSize: "0.82rem", padding: "0.75rem",
              background: "var(--bg-warm)", borderRadius: "var(--radius-sm)", marginBottom: "1rem"
            }}>
              <LoadingSpinner size={16} />
              <span>Generating plain-English summary...</span>
            </div>
          ) : aiData ? (
            <div style={{
              background: "rgba(212,80,10,0.04)", border: "1px solid rgba(212,80,10,0.14)",
              borderRadius: "var(--radius-sm)", padding: "0.875rem 1rem", marginBottom: "1rem"
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
                  marginTop: "0.65rem", padding: "0.6rem 0.875rem",
                  background: "rgba(255,255,255,0.8)", borderRadius: "var(--radius-sm)",
                  borderLeft: "3px solid var(--brand-primary)",
                  fontSize: "0.78rem", color: "var(--text-secondary)", fontStyle: "italic"
                }}>
                  Draft message: "{aiData.messageDraft}"
                </div>
              )}
            </div>
          ) : null}

          {/* Action buttons */}
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "0.5rem", fontWeight: 500 }}>
            All outreach requires your approval ↓
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
            {[
              { id: "transit", label: "✉️ Send Sun Tran info",    show: participant.reportedBarriers?.includes("transportation") && canSendResources },
              { id: "call",    label: "📞 Quick check-in call",   show: canContact },
              { id: "makeup",  label: "🗓️ Offer make-up session", show: participant.missedDays > 0 && participant.supportPreference !== "none" },
              { id: "peer",    label: "💬 Connect with peer",     show: participant.supportPreference === "peer" || participant.supportPreference === "staff_contact" }
            ].filter(a => a.show).slice(0, 4).map(action => (
              <button
                key={action.id}
                onClick={() => setActionTaken(prev => prev === action.id ? null : action.id)}
                style={{
                  padding: "0.6rem 0.75rem", borderRadius: "var(--radius-sm)",
                  border: actionTaken === action.id ? "1.5px solid var(--brand-secondary)" : "1.5px solid var(--border)",
                  background: actionTaken === action.id ? "rgba(44,95,46,0.1)" : "var(--bg-warm)",
                  fontSize: "0.775rem", fontWeight: 500, cursor: "pointer", transition: "all 0.18s ease",
                  color: actionTaken === action.id ? "var(--brand-secondary)" : "var(--text-primary)"
                }}
              >
                {actionTaken === action.id ? "✓ Done" : action.label}
              </button>
            ))}
          </div>

          <div style={{
            marginTop: "0.75rem", padding: "0.75rem 0.875rem", borderRadius: "var(--radius-sm)",
            border: actionTaken ? "1px solid rgba(44,95,46,0.18)" : "1px dashed var(--border)",
            background: actionTaken ? "rgba(44,95,46,0.06)" : "rgba(255,255,255,0.55)"
          }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em",
              color: actionTaken ? "var(--brand-secondary)" : "var(--text-muted)", marginBottom: "0.3rem"
            }}>
              Action receipt
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              {actionTaken
                ? `${participant.firstName}'s preference was checked before marking this action done. Next review: tomorrow morning.`
                : "Choose an action only if it matches the participant's stated preference. Nothing sends automatically."}
            </p>
          </div>

          {/* Staff notes */}
          <div style={{ marginTop: "0.875rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              Staff notes (private)
            </div>
            <textarea
              rows={2}
              placeholder={`Add a private note about ${participant.firstName}...`}
              value={note}
              onChange={e => saveNote(e.target.value)}
              onClick={e => e.stopPropagation()}
              style={{
                width: "100%", padding: "0.6rem 0.75rem", resize: "vertical",
                borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)",
                fontSize: "0.82rem", background: "var(--bg-warm)", color: "var(--text-primary)",
                outline: "none", lineHeight: 1.5, fontFamily: "inherit",
                transition: "border-color 0.2s ease"
              }}
              onFocus={e => { e.target.style.borderColor = "var(--brand-primary)"; }}
              onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
            />
            {noteSaved && (
              <div style={{ fontSize: "0.68rem", color: "var(--risk-low)", marginTop: "0.2rem" }}>✓ Note saved</div>
            )}
          </div>

          {/* Peer match suggestion */}
          {peerMatch && (
            <div style={{
              marginTop: "0.875rem", padding: "0.75rem 0.875rem",
              background: "rgba(212,80,10,0.04)", border: "1px solid rgba(212,80,10,0.15)",
              borderRadius: "var(--radius-sm)"
            }}>
              <div style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--brand-primary)", marginBottom: "0.35rem" }}>
                💬 Suggested peer match
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.2rem" }}>
                {peerMatch.firstName} {peerMatch.lastName} · Week {peerMatch.currentWeek}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {peerReason}
              </div>
            </div>
          )}

          {/* Outcome tracking */}
          <div style={{ marginTop: "0.875rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.45rem" }}>
              Outcome tracking
            </div>
            {outcome ? (
              <div style={{
                padding: "0.6rem 0.875rem", borderRadius: "var(--radius-sm)",
                background: outcome.status === "graduated" ? "rgba(44,95,46,0.08)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${outcome.status === "graduated" ? "rgba(44,95,46,0.22)" : "var(--border)"}`,
                fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <span>{outcome.status === "graduated" ? "🎓 Marked as graduated" : "⚠ Marked as dropped"}</span>
                <button onClick={() => { saveOutcome(participant.id, null); setOutcome(null); }} style={{ fontSize: "0.72rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "0" }}>undo</button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                <button
                  onClick={() => handleOutcome("graduated")}
                  style={{
                    padding: "0.55rem", borderRadius: "var(--radius-sm)",
                    border: "1.5px solid rgba(44,95,46,0.3)", background: "rgba(44,95,46,0.06)",
                    fontSize: "0.775rem", fontWeight: 600, color: "var(--brand-secondary)",
                    cursor: "pointer", transition: "all 0.18s ease"
                  }}
                >🎓 Mark graduated</button>
                <button
                  onClick={() => handleOutcome("dropped")}
                  style={{
                    padding: "0.55rem", borderRadius: "var(--radius-sm)",
                    border: "1.5px solid var(--border)", background: "var(--bg-warm)",
                    fontSize: "0.775rem", fontWeight: 500, color: "var(--text-muted)",
                    cursor: "pointer", transition: "all 0.18s ease"
                  }}
                >⚠ Mark dropped</button>
              </div>
            )}
          </div>

          <button
            onClick={() => setDismissed(true)}
            style={{
              marginTop: "0.75rem", width: "100%", padding: "0.5rem",
              borderRadius: "var(--radius-sm)", border: "1px dashed var(--border)",
              background: "transparent", fontSize: "0.78rem", color: "var(--text-muted)",
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
