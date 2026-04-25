import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import CheckinFlow from "./components/checkin/CheckinFlow";
import StaffDashboard from "./components/staff/StaffDashboard";

const STATS = [
  { value: "250+", label: "Graduates since 2011" },
  { value: "10", label: "Weeks, free of charge" },
  { value: "~33%", label: "Don't complete — yet" },
  { value: "0", label: "Apps to download" }
];

const FEATURES = [
  {
    icon: "📱",
    title: "SMS-style check-ins",
    body: "Participants get a nightly link — no login, no app. Feels like a friendly text, not a form."
  },
  {
    icon: "🔒",
    title: "Participant-controlled",
    body: "Every participant chooses their support level. The default is no contact. They opt in."
  },
  {
    icon: "🔮",
    title: "What-If Simulator",
    body: "Staff see which interventions move the needle — before they act. Decision support, not decision replacement."
  },
  {
    icon: "📋",
    title: "Transparent model card",
    body: "Visible in the app. What the model sees, what it never touches, and what it can't decide."
  }
];

function StatCard({ value, label, delay }) {
  return (
    <div style={{
      textAlign: "center",
      animation: `fadeInUp 0.5s ease both`,
      animationDelay: delay
    }}>
      <div style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: "clamp(2rem, 5vw, 2.8rem)",
        color: "var(--brand-primary)",
        lineHeight: 1.1,
        marginBottom: "0.3rem"
      }}>{value}</div>
      <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-warm)" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #1a0a04 0%, #3d1505 40%, #2C1A08 100%)",
        padding: "clamp(3rem, 8vw, 6rem) 1.5rem clamp(4rem, 10vw, 7rem)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: 300, height: 300, borderRadius: "50%",
          background: "rgba(212,80,10,0.12)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-40px", left: "10%",
          width: 180, height: 180, borderRadius: "50%",
          background: "rgba(245,166,35,0.08)", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            background: "rgba(212,80,10,0.18)", border: "1px solid rgba(212,80,10,0.35)",
            borderRadius: "50px", padding: "0.35rem 1rem", marginBottom: "1.5rem",
            fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em",
            color: "#f5a06a", textTransform: "uppercase",
            animation: "fadeIn 0.6s ease forwards"
          }}>
            <span>🍳</span> Caridad Community Kitchen · Tucson, AZ
          </div>

          <h1 style={{
            fontSize: "clamp(2.8rem, 8vw, 5rem)",
            color: "#fff",
            marginBottom: "1.25rem",
            lineHeight: 1.08,
            letterSpacing: "-0.01em",
            animation: "fadeInUp 0.6s ease 0.1s both"
          }}>
            Own<span style={{ color: "var(--brand-primary)" }}>Path</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            color: "rgba(255,255,255,0.72)",
            maxWidth: 520, margin: "0 auto 0.75rem",
            lineHeight: 1.65,
            animation: "fadeInUp 0.6s ease 0.2s both"
          }}>
            Participant-powered support for Caridad's free culinary training program.
            Daily check-ins, real resources, zero surveillance.
          </p>

          <p style={{
            fontSize: "1rem",
            color: "rgba(245,166,35,0.9)",
            fontStyle: "italic",
            marginBottom: "2.5rem",
            animation: "fadeInUp 0.6s ease 0.3s both"
          }}>
            "We don't predict people out of the program.<br />
            We predict where support can keep them in it."
          </p>

          <div style={{
            display: "flex", gap: "0.875rem", justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeInUp 0.6s ease 0.4s both"
          }}>
            <Link to="/checkin/P001" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "var(--brand-primary)", color: "#fff",
              padding: "0.9rem 2rem", borderRadius: "var(--radius-sm)",
              fontWeight: 700, fontSize: "0.95rem",
              boxShadow: "0 4px 20px rgba(212,80,10,0.45)",
              transition: "all 0.2s ease",
              textDecoration: "none"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(212,80,10,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 20px rgba(212,80,10,0.45)"; }}
            >
              📱 Try Participant Check-in
            </Link>
            <Link to="/staff" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.25)",
              padding: "0.9rem 2rem", borderRadius: "var(--radius-sm)",
              fontWeight: 600, fontSize: "0.95rem",
              transition: "all 0.2s ease",
              textDecoration: "none"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.17)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = ""; }}
            >
              🖥️ Staff Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "2rem 1.5rem"
      }}>
        <div style={{
          maxWidth: 700, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem"
        }}>
          {STATS.map((s, i) => (
            <StatCard key={i} value={s.value} label={s.label} delay={`${i * 80}ms`} />
          ))}
        </div>
      </div>

      {/* Problem section */}
      <div style={{ padding: "4rem 1.5rem", maxWidth: 700, margin: "0 auto" }}>
        <div style={{
          background: "rgba(212,80,10,0.05)",
          border: "1px solid rgba(212,80,10,0.15)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem 2.5rem",
          marginBottom: "3rem"
        }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>🌡️</div>
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>The dropout isn't about motivation.</h2>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.95rem" }}>
            It's a missed bus. 108°F Tucson heat. Childcare that fell through the night before.
            By the time staff know someone is struggling, it's too late. <strong>OwnPath changes that —
            but not by watching participants more closely. By giving them the support they choose.</strong>
          </p>
        </div>

        {/* Features */}
        <h2 style={{ textAlign: "center", fontSize: "1.6rem", marginBottom: "2rem" }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="card hover-lift" style={{
              animation: `fadeInUp 0.45s ease both`,
              animationDelay: `${i * 90}ms`
            }}>
              <div style={{ fontSize: "1.8rem", marginBottom: "0.6rem" }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontFamily: "'DM Serif Display', serif", marginBottom: "0.4rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo CTA */}
      <div style={{
        background: "var(--brand-secondary)",
        padding: "3rem 1.5rem",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ color: "#fff", fontSize: "1.6rem", marginBottom: "0.6rem" }}>
            Ready for the demo?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "1.75rem", fontSize: "0.9rem" }}>
            Try Rosa's evening check-in, then see how it appears on the staff dashboard.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { to: "/checkin/P001", label: "📱 Rosa's Check-in", primary: true },
              { to: "/checkin/P002", label: "📱 Marcus's Check-in", primary: false },
              { to: "/staff", label: "🖥️ Staff Dashboard", primary: false }
            ].map(link => (
              <Link key={link.to} to={link.to} style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                padding: "0.7rem 1.4rem", borderRadius: "var(--radius-sm)",
                fontWeight: 600, fontSize: "0.875rem",
                textDecoration: "none",
                background: link.primary ? "var(--brand-primary)" : "rgba(255,255,255,0.12)",
                color: "#fff",
                border: link.primary ? "none" : "1px solid rgba(255,255,255,0.22)",
                transition: "all 0.2s ease"
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p style={{ marginTop: "1.25rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.45)" }}>
            Staff passcode: <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>caridad2026</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        padding: "1.5rem",
        textAlign: "center",
        fontSize: "0.78rem",
        color: "var(--text-muted)"
      }}>
        <p>Built for Hack Arizona 2026 · Track 04: Southern Arizona Social Innovation</p>
        <p style={{ marginTop: "0.3rem" }}>
          <strong style={{ color: "var(--text-secondary)" }}>Caridad Community Kitchen</strong> ·
          845 N Main Ave, Tucson, AZ 85705 · (520) 882-5641
        </p>
      </footer>
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
