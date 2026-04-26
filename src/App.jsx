import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import CheckinFlow from "./components/checkin/CheckinFlow";
import StaffDashboard from "./components/staff/StaffDashboard";
import Icon from "./components/common/Icon";

// ─── Nav ─────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      height: 56,
      display: "flex", alignItems: "center",
      padding: "0 2rem"
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: "var(--brand-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.95rem"
        }}>🍳</div>
        <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          OwnPath
        </span>
      </Link>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Link to="/checkin/P001" style={{
          padding: "0.4rem 0.9rem", borderRadius: "var(--radius-sm)",
          fontSize: "0.82rem", fontWeight: 500, color: "var(--text-secondary)",
          transition: "all 0.18s", textDecoration: "none"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-warm)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
        >
          Participant Demo
        </Link>
        <Link to="/staff" style={{
          padding: "0.45rem 1rem", borderRadius: "var(--radius-sm)",
          fontSize: "0.82rem", fontWeight: 600,
          background: "var(--brand-primary)", color: "#fff",
          textDecoration: "none",
          boxShadow: "0 2px 8px rgba(212,80,10,0.28)",
          transition: "all 0.18s"
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "#b8430a"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--brand-primary)"; }}
        >
          Staff Dashboard →
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────
function Hero() {
  return (
    <section style={{
      paddingTop: "calc(56px + 5rem)",
      paddingBottom: "5rem",
      paddingLeft: "2rem", paddingRight: "2rem",
      maxWidth: 900, margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "4rem",
      alignItems: "center"
    }}>
      {/* Left */}
      <div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.45rem",
          background: "rgba(44,95,46,0.09)",
          border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "50px", padding: "0.3rem 0.875rem",
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em",
          color: "var(--brand-secondary)", textTransform: "uppercase",
          marginBottom: "1.5rem",
          animation: "fadeIn 0.5s ease both"
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--brand-secondary)" }} />
          Hack Arizona 2026 · Track 04
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
          letterSpacing: "-0.025em",
          lineHeight: 1.08,
          marginBottom: "1.25rem",
          animation: "fadeInUp 0.5s ease 0.1s both"
        }}>
          Retention support<br />
          <span style={{ color: "var(--brand-primary)" }}>built for participants,</span><br />
          not around them.
        </h1>

        <p style={{
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          lineHeight: 1.75,
          maxWidth: 420,
          marginBottom: "2rem",
          animation: "fadeInUp 0.5s ease 0.2s both"
        }}>
          OwnPath gives Caridad Community Kitchen participants
          a nightly SMS check-in and gives staff a respectful,
          AI-powered action queue — never a surveillance wall.
        </p>

        <div style={{
          display: "flex", gap: "0.75rem", flexWrap: "wrap",
          animation: "fadeInUp 0.5s ease 0.3s both"
        }}>
          <Link to="/checkin/P001" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "var(--brand-primary)", color: "#fff",
            padding: "0.75rem 1.5rem", borderRadius: "var(--radius-sm)",
            fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
            boxShadow: "0 4px 16px rgba(212,80,10,0.35)",
            transition: "all 0.2s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(212,80,10,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(212,80,10,0.35)"; }}
          >
            Try check-in demo
            <Icon name="arrow" size={15} />
          </Link>
          <Link to="/staff" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            border: "1.5px solid var(--border)",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            padding: "0.75rem 1.5rem", borderRadius: "var(--radius-sm)",
            fontWeight: 600, fontSize: "0.9rem", textDecoration: "none",
            transition: "all 0.2s ease"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.color = "var(--brand-primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-primary)"; }}
          >
            Staff dashboard
          </Link>
        </div>
      </div>

      {/* Right — mock phone card */}
      <div style={{
        animation: "fadeInUp 0.6s ease 0.2s both",
        display: "flex", justifyContent: "center"
      }}>
        <div style={{
          width: 280,
          background: "var(--bg-card)",
          borderRadius: 24,
          boxShadow: "0 24px 60px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid var(--border)",
          overflow: "hidden"
        }}>
          {/* Phone status bar */}
          <div style={{
            background: "linear-gradient(135deg, #2a0e04, #3d1a07)",
            padding: "1rem 1.25rem 0.875rem",
          }}>
            <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.6rem" }}>
              Caridad Community Kitchen
            </div>
            <div style={{ color: "#fff", fontSize: "1rem", fontFamily: "'DM Serif Display', serif", lineHeight: 1.3 }}>
              Good evening, Rosa 🌅
            </div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", marginTop: "0.2rem" }}>
              How are you feeling about tomorrow?
            </div>
          </div>
          <div style={{ padding: "0.875rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              { emoji: "😩", label: "Really struggling",  color: "#C0392B" },
              { emoji: "😕", label: "A bit worried",       color: "#E67E22" },
              { emoji: "😊", label: "Ready to go!",        color: "#27AE60", selected: true }
            ].map((opt, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                padding: "0.55rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                border: opt.selected ? `1.5px solid ${opt.color}` : "1.5px solid var(--border)",
                background: opt.selected ? `${opt.color}12` : "var(--bg-warm)",
                fontSize: "0.78rem",
                fontWeight: opt.selected ? 700 : 500,
                color: opt.selected ? opt.color : "var(--text-secondary)"
              }}>
                <span style={{ fontSize: "1rem" }}>{opt.emoji}</span>
                {opt.label}
                {opt.selected && <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>✓</span>}
              </div>
            ))}
            <div style={{
              marginTop: "0.25rem",
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(212,80,10,0.08)",
              fontSize: "0.72rem",
              color: "var(--brand-primary)",
              fontWeight: 600,
              display: "flex", alignItems: "center", gap: "0.3rem"
            }}>
              <Icon name="check" size={12} color="var(--brand-primary)" />
              Thanks, Rosa — see you tomorrow!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────
function Stats() {
  const items = [
    { value: "250+", label: "Caridad graduates since 2011" },
    { value: "~33%", label: "Don't complete due to daily barriers" },
    { value: "10 wks", label: "Free, full-time program" },
    { value: "0",     label: "Apps to download" }
  ];
  return (
    <section style={{
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      background: "var(--bg-card)",
      padding: "2.5rem 2rem"
    }}>
      <div style={{
        maxWidth: 900, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem"
      }}>
        {items.map((s, i) => (
          <div key={i} style={{ textAlign: "center", animation: `fadeInUp 0.45s ease ${i * 70}ms both` }}>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "2.2rem",
              color: "var(--brand-primary)",
              lineHeight: 1, marginBottom: "0.4rem"
            }}>{s.value}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Participant gets a link",
      body: "Each evening, a unique SMS link. No app, no account, no friction. Opens to a 4-screen conversational check-in.",
      icon: "phone"
    },
    {
      num: "02",
      title: "They choose what to share",
      body: "Feeling rating, optional barriers, and support preference. The default is no contact. Participants opt in.",
      icon: "shield"
    },
    {
      num: "03",
      title: "Risk engine runs silently",
      body: "Attendance + self-reported signals + Tucson weather forecast. A transparent rule-based score — no LLM for decisions.",
      icon: "trending"
    },
    {
      num: "04",
      title: "Staff sees a warm action queue",
      body: "Plain-English AI summaries, What-If Simulator, and real Tucson resources. Staff approves every outreach action.",
      icon: "users"
    }
  ];
  return (
    <section style={{ padding: "5rem 2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <p style={{
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem"
        }}>How it works</p>
        <h2 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.015em" }}>
          Built for the participant.<br />Useful for the staff.
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {steps.map((s, i) => (
          <div key={i} className="card" style={{
            display: "flex", gap: "1rem",
            animation: `fadeInUp 0.45s ease ${i * 80}ms both`,
            padding: "1.5rem"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "var(--radius-sm)", flexShrink: 0,
              background: "var(--bg-warm)",
              border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon name={s.icon} size={18} color="var(--brand-primary)" />
            </div>
            <div>
              <div style={{
                fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem"
              }}>{s.num}</div>
              <h3 style={{
                fontSize: "0.975rem", fontFamily: "'DM Serif Display', serif",
                marginBottom: "0.4rem"
              }}>{s.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                {s.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────
function ProblemSection() {
  return (
    <section style={{
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "5rem 2rem"
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <p style={{
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.75rem"
        }}>The real problem</p>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "1.25rem", letterSpacing: "-0.015em" }}>
          Dropout isn't a motivation problem.<br />It's a logistics problem.
        </h2>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.975rem", marginBottom: "1.5rem" }}>
          Caridad's program runs Monday–Friday, 8:30am–3:30pm for 10 weeks — free of charge.
          Since 2011, it has graduated 250+ people into food-service careers. But ~33% of
          cohorts don't complete, not because participants give up, but because of a missed
          bus, 108°F heat, a childcare gap, a housing disruption.
        </p>
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.975rem" }}>
          <strong>By the time staff know someone is struggling, it's often too late.</strong> OwnPath
          surfaces friction early — and routes people to real Tucson resources before one hard day
          becomes two missed days becomes a dropout.
        </p>
        <div style={{
          marginTop: "2rem",
          padding: "1.25rem 1.5rem",
          borderLeft: "3px solid var(--brand-primary)",
          background: "rgba(212,80,10,0.04)",
          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0"
        }}>
          <p style={{ fontSize: "1rem", fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.6 }}>
            "We don't predict people out of the program. We predict where support can keep them in it."
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Demo CTA ─────────────────────────────────────────────────
function DemoCTA() {
  return (
    <section style={{ padding: "5rem 2rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.015em", marginBottom: "0.75rem" }}>
          See it in action
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Two entry points — participant and staff — designed for completely different contexts.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        {/* Participant card */}
        <div className="card hover-lift" style={{ padding: "2rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "var(--radius-sm)",
            background: "rgba(212,80,10,0.08)", border: "1px solid rgba(212,80,10,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <Icon name="phone" size={20} color="var(--brand-primary)" />
          </div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Participant Check-in</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
            4-screen conversational flow. Rosa M., week 3, transportation barrier.
            EN/ES toggle. Real Tucson resources on confirmation.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {[
              { to: "/checkin/P001", label: "Rosa M. — transportation barrier" },
              { to: "/checkin/P002", label: "Marcus T. — housing stress" },
              { to: "/checkin/P003", label: "Diana R. — childcare gap" }
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.6rem 0.875rem", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)", background: "var(--bg-warm)",
                fontSize: "0.8rem", fontWeight: 500, color: "var(--text-primary)",
                textDecoration: "none", transition: "all 0.18s ease"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand-primary)"; e.currentTarget.style.background = "rgba(212,80,10,0.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-warm)"; }}
              >
                {link.label}
                <Icon name="arrow" size={13} color="var(--text-muted)" />
              </Link>
            ))}
          </div>
        </div>

        {/* Staff card */}
        <div className="card hover-lift" style={{ padding: "2rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "var(--radius-sm)",
            background: "rgba(44,95,46,0.08)", border: "1px solid rgba(44,95,46,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "1rem"
          }}>
            <Icon name="chart" size={20} color="var(--brand-secondary)" />
          </div>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Staff Dashboard</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
            Risk queue, What-If Simulator, cohort heat map, and model card.
            Password protected. All outreach requires staff approval.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{
              padding: "0.75rem 0.875rem",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-warm)",
              border: "1px solid var(--border)",
              fontSize: "0.78rem"
            }}>
              <div style={{ color: "var(--text-muted)", marginBottom: "0.2rem" }}>Passcode</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: "0.9rem" }}>
                caridad2026
              </div>
            </div>
            <Link to="/staff" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0.6rem 0.875rem", borderRadius: "var(--radius-sm)",
              border: "1.5px solid var(--brand-secondary)",
              background: "rgba(44,95,46,0.06)",
              fontSize: "0.82rem", fontWeight: 600,
              color: "var(--brand-secondary)", textDecoration: "none",
              transition: "all 0.18s ease"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(44,95,46,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(44,95,46,0.06)"; }}
            >
              Open staff dashboard
              <Icon name="arrow" size={13} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      background: "var(--bg-card)",
      padding: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: "var(--brand-primary)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem"
        }}>🍳</div>
        <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>OwnPath</span>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          · Caridad Community Kitchen · 845 N Main Ave, Tucson, AZ · (520) 882-5641
        </span>
      </div>
      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
        Hack Arizona 2026 · Track 04: Southern Arizona Social Innovation
      </p>
    </footer>
  );
}

// ─── Home page ────────────────────────────────────────────────
function Home() {
  return (
    <div>
      <Nav />
      <Hero />
      <Stats />
      <HowItWorks />
      <ProblemSection />
      <DemoCTA />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkin/:participantToken" element={<CheckinFlow />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
