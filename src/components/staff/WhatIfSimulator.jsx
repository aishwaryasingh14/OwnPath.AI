import { useState, useEffect } from "react";
import { calculateWhatIfDeltas } from "../../lib/riskEngine";
import AnimatedNumber from "../common/AnimatedNumber";

export default function WhatIfSimulator({ participant, riskResult }) {
  const [checked, setChecked] = useState([]);
  const [animKey, setAnimKey] = useState(0);

  const items = calculateWhatIfDeltas(riskResult);
  const base = riskResult.completionProbability;
  const totalDelta = checked.reduce((sum, idx) => sum + (items[idx]?.delta || 0), 0);
  const projected = Math.min(base + totalDelta, 99);
  const selectedItems = checked.map(idx => items[idx]).filter(Boolean);

  const toggle = (idx) => {
    setChecked(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    setAnimKey(k => k + 1);
  };

  const barColor = projected >= 65 ? "var(--risk-low)"
    : projected >= 45 ? "var(--brand-accent)"
    : "var(--risk-medium)";

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <div style={{
          width: 34, height: 34, borderRadius: "var(--radius-sm)",
          background: "linear-gradient(135deg, rgba(212,80,10,0.12), rgba(212,80,10,0.22))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem"
        }}>🔮</div>
        <div>
          <h3 style={{ fontSize: "0.925rem", fontFamily: "'DM Serif Display', serif", lineHeight: 1.2 }}>
            What-If Simulator
          </h3>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
            Projected impact of interventions
          </p>
        </div>
      </div>

      {/* Participant strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.75rem",
        background: "var(--bg-warm)",
        borderRadius: "var(--radius-sm)",
        marginBottom: "1rem",
        border: "1px solid var(--border)"
      }}>
        <div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "1px" }}>Participant</div>
          <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
            {participant.firstName} {participant.lastName}
          </div>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
            Week {participant.currentWeek} of 10
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: "1px" }}>
            Current probability
          </div>
          <div style={{
            fontSize: "1.6rem",
            fontWeight: 700,
            fontFamily: "'DM Serif Display', serif",
            color: base < 45 ? "var(--risk-high)" : base < 65 ? "var(--risk-medium)" : "var(--risk-low)",
            lineHeight: 1
          }}>
            {base}%
          </div>
        </div>
      </div>

      {/* Interventions */}
      <div style={{ marginBottom: "1rem" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto",
          gap: "0.5rem 0.75rem",
          fontSize: "0.68rem", color: "var(--text-muted)",
          marginBottom: "0.5rem",
          padding: "0 0.25rem 0.4rem",
          borderBottom: "1px solid var(--border)"
        }}>
          <span>Intervention</span>
          <span style={{ textAlign: "right" }}>Impact</span>
        </div>

        {items.map((item, idx) => {
          const isChecked = checked.includes(idx);
          const newProb = Math.min(base + item.delta, 99);
          return (
            <label key={idx} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0.5rem",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              background: isChecked ? "rgba(44,95,46,0.07)" : "transparent",
              border: isChecked ? "1px solid rgba(44,95,46,0.18)" : "1px solid transparent",
              transition: "all 0.18s ease",
              marginBottom: "0.3rem"
            }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(idx)}
                style={{ accentColor: "var(--brand-secondary)", width: 15, height: 15, flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                  {item.icon} {item.label}
                </div>
                {/* Mini bar */}
                <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginTop: "0.3rem", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: isChecked ? `${(item.delta / 20) * 100}%` : "0%",
                    background: "var(--risk-low)",
                    borderRadius: 2,
                    transition: "width 0.5s ease"
                  }} />
                </div>
              </div>
              <div style={{
                fontSize: "0.78rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
                color: isChecked ? "var(--risk-low)" : "var(--text-muted)",
                textAlign: "right",
                flexShrink: 0
              }}>
                +{item.delta}%<br />
                <span style={{ fontSize: "0.68rem", fontWeight: 500 }}>→ {newProb}%</span>
              </div>
            </label>
          );
        })}
      </div>

      {/* Result */}
      <div style={{
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${checked.length > 0 ? "rgba(44,95,46,0.25)" : "var(--border)"}`,
        background: checked.length > 0 ? "rgba(44,95,46,0.07)" : "var(--bg-warm)",
        padding: "0.875rem",
        transition: "all 0.3s ease",
        textAlign: "center",
        marginBottom: "0.75rem"
      }}>
        {checked.length === 0 ? (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            ☝️ Select interventions to see projected change
          </p>
        ) : (
          <div>
            <div style={{ fontSize: "0.68rem", color: "var(--brand-secondary)", fontWeight: 700, marginBottom: "0.4rem" }}>
              WITH {checked.length} INTERVENTION{checked.length > 1 ? "S" : ""}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.875rem" }}>
              <span style={{ fontSize: "1.3rem", color: "var(--text-muted)", fontFamily: "'DM Serif Display', serif" }}>
                {base}%
              </span>
              <span style={{ color: "var(--brand-secondary)", fontSize: "1.1rem" }}>→</span>
              <span style={{
                fontSize: "2.2rem",
                fontFamily: "'DM Serif Display', serif",
                fontWeight: 700,
                color: "var(--brand-secondary)"
              }}>
                <AnimatedNumber value={projected} key={animKey} />%
              </span>
            </div>
            <div style={{
              fontSize: "0.78rem", fontWeight: 700,
              color: "var(--brand-secondary)", marginTop: "0.2rem"
            }}>
              +{totalDelta} percentage points projected
            </div>
          </div>
        )}
      </div>

      {selectedItems.length > 0 && (
        <div style={{
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(212,80,10,0.16)",
          background: "rgba(212,80,10,0.04)",
          padding: "0.875rem",
          marginBottom: "0.75rem"
        }}>
          <div style={{
            fontSize: "0.68rem",
            fontWeight: 800,
            color: "var(--brand-primary)",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginBottom: "0.45rem"
          }}>
            Staff action plan
          </div>
          <ol style={{
            paddingLeft: "1rem",
            color: "var(--text-secondary)",
            fontSize: "0.78rem",
            lineHeight: 1.6
          }}>
            {selectedItems.map(item => (
              <li key={item.label}>{item.label}</li>
            ))}
          </ol>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.5, marginTop: "0.55rem" }}>
            Review the participant's stated preference before taking action. The simulator estimates impact; staff approves the plan.
          </p>
        </div>
      )}

      <p style={{
        fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.5,
        paddingTop: "0.6rem", borderTop: "1px solid var(--border)"
      }}>
        ⚠️ Estimates based on similar participants in past cohorts. Staff judgment is essential — these are inputs, not decisions.
      </p>
    </div>
  );
}
