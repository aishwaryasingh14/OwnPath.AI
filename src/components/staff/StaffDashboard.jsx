import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { DEMO_PARTICIPANTS } from "../../data/participants";
import { calculateRiskScore } from "../../lib/riskEngine";
import { getTucsonWeather } from "../../lib/weatherApi";
import HeaderStats from "./HeaderStats";
import ParticipantCard from "./ParticipantCard";
import WhatIfSimulator from "./WhatIfSimulator";
import CohortInsights from "./CohortInsights";
import ModelCardTab from "./ModelCardTab";

const TABS = [
  { id: "queue",    icon: "📋", label: "Today's Queue" },
  { id: "insights", icon: "📊", label: "Insights" },
  { id: "model",    icon: "📋", label: "Model Card" }
];

export default function StaffDashboard() {
  const [authed, setAuthed] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState("queue");
  const [selected, setSelected] = useState("P001");
  const [weather, setWeather] = useState(null);
  const [filter, setFilter] = useState("attention");

  useEffect(() => { getTucsonWeather().then(setWeather); }, []);

  const riskResults = useMemo(() =>
    DEMO_PARTICIPANTS.map(p => calculateRiskScore(p, weather?.temp || 85)),
    [weather]
  );

  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #1a0a04 0%, #2C1A08 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem"
      }}>
        <div style={{
          background: "var(--bg-card)", borderRadius: "var(--radius-lg)",
          padding: "2.5rem 2rem", maxWidth: 380, width: "100%",
          textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand-primary), #f07030)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1rem", fontSize: "1.5rem",
            boxShadow: "0 4px 16px rgba(212,80,10,0.35)"
          }}>🍳</div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>OwnPath Staff</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "2rem" }}>
            Caridad Community Kitchen · Participant Support
          </p>
          <form onSubmit={e => {
            e.preventDefault();
            if (pwInput === "caridad2026") { setAuthed(true); }
            else { setPwError(true); setPwInput(""); }
          }}>
            <input
              type="password"
              placeholder="Staff passcode"
              value={pwInput}
              onChange={e => { setPwInput(e.target.value); setPwError(false); }}
              style={{
                width: "100%", padding: "0.875rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: `1.5px solid ${pwError ? "var(--risk-high)" : "var(--border)"}`,
                fontSize: "1rem", marginBottom: "0.75rem",
                background: "var(--bg-warm)", color: "var(--text-primary)",
                outline: "none", transition: "border-color 0.2s"
              }}
              autoFocus
            />
            {pwError && (
              <p style={{ color: "var(--risk-high)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                Incorrect passcode. Try again.
              </p>
            )}
            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Sign In
            </button>
          </form>
          <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "1.25rem" }}>
            Demo passcode: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>caridad2026</span>
          </p>
          <Link to="/" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginTop: "0.5rem" }}>
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const flagged = DEMO_PARTICIPANTS.filter((_, i) => riskResults[i]?.level !== "low");
  const well    = DEMO_PARTICIPANTS.filter((_, i) => riskResults[i]?.level === "low");
  const display = filter === "attention" ? flagged : DEMO_PARTICIPANTS;

  const selParticipant = DEMO_PARTICIPANTS.find(p => p.id === selected) || DEMO_PARTICIPANTS[0];
  const selRisk = riskResults[DEMO_PARTICIPANTS.indexOf(selParticipant)] || riskResults[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-warm)", display: "flex", flexDirection: "column" }}>

      {/* Top nav */}
      <header style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 1.5rem",
        display: "flex", alignItems: "center", gap: "1rem",
        height: 56, position: "sticky", top: 0, zIndex: 20
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand-primary), #f07030)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.9rem", boxShadow: "0 2px 6px rgba(212,80,10,0.25)"
          }}>🍳</div>
          <div>
            <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>OwnPath</span>
            <span style={{
              fontSize: "0.68rem", color: "var(--text-muted)",
              background: "var(--bg-warm)", padding: "0.1rem 0.45rem",
              borderRadius: "50px", marginLeft: "0.4rem",
              border: "1px solid var(--border)"
            }}>Staff</span>
          </div>
        </Link>

        {/* Tabs */}
        <nav style={{ display: "flex", gap: "0.15rem", marginLeft: "0.5rem" }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "0.38rem 0.95rem",
                borderRadius: "50px", border: "none",
                background: tab === t.id ? "rgba(212,80,10,0.1)" : "transparent",
                color: tab === t.id ? "var(--brand-primary)" : "var(--text-secondary)",
                fontWeight: tab === t.id ? 700 : 500,
                fontSize: "0.82rem", cursor: "pointer",
                transition: "all 0.18s ease"
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          {weather && (
            <div style={{
              fontSize: "0.75rem",
              color: weather.isDangerous ? "var(--risk-high)" : "var(--text-muted)",
              display: "flex", alignItems: "center", gap: "0.3rem",
              background: weather.isDangerous ? "rgba(192,57,43,0.08)" : "transparent",
              padding: weather.isDangerous ? "0.2rem 0.6rem" : "0",
              borderRadius: "50px",
              border: weather.isDangerous ? "1px solid rgba(192,57,43,0.2)" : "none"
            }}>
              {weather.isDangerous ? "🌡️" : "☀️"} Tomorrow: {weather.temp}°F
            </div>
          )}
          <div style={{
            fontSize: "0.72rem", color: "var(--text-muted)",
            display: "flex", alignItems: "center", gap: "0.4rem"
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--risk-low)" }} />
            Week 3 of 10 · Class 43 · {DEMO_PARTICIPANTS.length} participants
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: "1.5rem", maxWidth: 1340, margin: "0 auto", width: "100%" }}>

        {/* ── Queue tab ── */}
        {tab === "queue" && (
          <>
            <HeaderStats participants={DEMO_PARTICIPANTS} riskResults={riskResults} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>
              {/* Left: list */}
              <div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: "0.875rem"
                }}>
                  <h2 style={{ fontSize: "1.05rem" }}>
                    {filter === "attention" ? "May Benefit from Support" : "All Participants"}
                    <span style={{
                      fontSize: "0.72rem", color: "var(--text-muted)",
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 500, marginLeft: "0.4rem"
                    }}>({display.length})</span>
                  </h2>
                  <div style={{ display: "flex", gap: "0.35rem" }}>
                    {[
                      { id: "attention", label: "⚠️ May benefit from support" },
                      { id: "all",       label: "All participants" }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        style={{
                          padding: "0.28rem 0.75rem", borderRadius: "50px",
                          border: "1px solid var(--border)",
                          background: filter === f.id ? "var(--brand-primary)" : "var(--bg-card)",
                          color: filter === f.id ? "#fff" : "var(--text-secondary)",
                          fontSize: "0.75rem", cursor: "pointer", fontWeight: 500,
                          transition: "all 0.18s ease"
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  {display.map(p => {
                    const idx = DEMO_PARTICIPANTS.indexOf(p);
                    return (
                      <ParticipantCard
                        key={p.id}
                        participant={p}
                        riskResult={riskResults[idx]}
                        onSelect={(id) => setSelected(id)}
                        isSelected={selected === p.id}
                      />
                    );
                  })}

                  {filter === "attention" && well.length > 0 && (
                    <div style={{
                      textAlign: "center", padding: "1.25rem",
                      color: "var(--text-muted)", fontSize: "0.82rem",
                      background: "rgba(39,174,96,0.05)",
                      border: "1px dashed rgba(39,174,96,0.25)",
                      borderRadius: "var(--radius)"
                    }}>
                      ✅ {well.length} participants doing well — no action needed
                    </div>
                  )}
                </div>
              </div>

              {/* Right: simulator + insights */}
              <div style={{ position: "sticky", top: 68, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <WhatIfSimulator participant={selParticipant} riskResult={selRisk} />
                <CohortInsights weather={weather} />
              </div>
            </div>
          </>
        )}

        {/* ── Insights tab ── */}
        {tab === "insights" && (
          <div style={{ maxWidth: 780 }}>
            <CohortInsights weather={weather} />

            <div className="card" style={{ marginTop: "1.25rem" }}>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "1rem", fontFamily: "'DM Serif Display', serif" }}>
                📈 Cohort Heat Map — Class 43
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {DEMO_PARTICIPANTS.map((p, i) => {
                  const r = riskResults[i];
                  return (
                    <div key={p.id} style={{
                      display: "grid",
                      gridTemplateColumns: "130px 1fr 65px",
                      gap: "0.75rem", alignItems: "center",
                      padding: "0.45rem 0",
                      borderBottom: i < DEMO_PARTICIPANTS.length - 1 ? "1px solid var(--border)" : "none"
                    }}>
                      <span style={{ fontSize: "0.82rem", fontWeight: 500 }}>
                        {p.firstName} {p.lastName}
                      </span>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {(p.checkinHistory || []).slice(-8).map((h, j) => (
                          <div key={j} title={h} style={{
                            width: 13, height: 13, borderRadius: "3px",
                            background:
                              h === "great"    ? "var(--risk-low)" :
                              h === "okay"     ? "var(--brand-accent)" :
                              h === "worried"  ? "var(--risk-medium)" :
                              "var(--risk-high)",
                            opacity: 0.85
                          }} />
                        ))}
                      </div>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        color: r?.level === "high" ? "var(--risk-high)"
                          : r?.level === "medium" ? "var(--risk-medium)"
                          : "var(--risk-low)",
                        textAlign: "right"
                      }}>
                        {r?.level}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.875rem", flexWrap: "wrap" }}>
                {[
                  { color: "var(--risk-low)", label: "Great" },
                  { color: "var(--brand-accent)", label: "Okay" },
                  { color: "var(--risk-medium)", label: "Worried" },
                  { color: "var(--risk-high)", label: "Struggling" }
                ].map(l => (
                  <div key={l.label} style={{
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    fontSize: "0.72rem", color: "var(--text-muted)"
                  }}>
                    <div style={{ width: 11, height: 11, borderRadius: "2px", background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Model Card tab ── */}
        {tab === "model" && (
          <div style={{ maxWidth: 820 }}>
            <ModelCardTab />
          </div>
        )}
      </main>
    </div>
  );
}
