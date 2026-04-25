import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { SUPPORT_RESOURCES, BARRIER_RESOURCE_MAP } from "../../data/resources";
import { generateParticipantMessage } from "../../lib/anthropicClient";

export default function ConfirmScreen({ participant, barriers, supportPreference, weather, lang }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const weatherCtx = weather?.isDangerous ? `Extreme heat (${weather.temp}°F)`
      : weather?.isHot ? `Hot day (${weather.temp}°F)` : "normal";

    generateParticipantMessage(
      { ...participant, supportPreference },
      barriers.filter(b => b !== "skip"),
      weatherCtx
    ).then(msg => {
      setMessage(msg);
      setLoading(false);
      setTimeout(() => setVisible(true), 80);
    });
  }, []);

  const relevantResources = barriers
    .filter(b => b !== "skip" && b !== "other" && BARRIER_RESOURCE_MAP[b])
    .flatMap(b => SUPPORT_RESOURCES[BARRIER_RESOURCE_MAP[b]] || [])
    .filter((r, idx, arr) => arr.findIndex(x => x.name === r.name) === idx)
    .slice(0, 3);

  const showResources = supportPreference === "resources" && relevantResources.length > 0;

  return (
    <div className="screen-transition" style={{ textAlign: "center" }}>

      {/* Success circle */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "linear-gradient(135deg, rgba(44,95,46,0.15), rgba(44,95,46,0.25))",
        border: "2px solid rgba(44,95,46,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 1.5rem",
        animation: "checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
        boxShadow: "0 4px 20px rgba(44,95,46,0.2)"
      }}>
        <span style={{ fontSize: "2rem" }}>✓</span>
      </div>

      {/* Message block */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.25rem",
        boxShadow: "var(--shadow)",
        minHeight: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <LoadingSpinner size={18} />
            <span>{lang === "es" ? "Preparando tu mensaje..." : "Preparing your message..."}</span>
          </div>
        ) : (
          <p style={{
            fontSize: "1rem",
            color: "var(--text-primary)",
            lineHeight: 1.65,
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(6px)",
            transition: "all 0.4s ease"
          }}>
            {lang === "es" ? message?.spanish : message?.english}
          </p>
        )}
      </div>

      {/* Staff contact notice */}
      {supportPreference === "staff_contact" && (
        <div style={{
          background: "rgba(44,95,46,0.08)",
          border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "var(--radius-sm)",
          padding: "0.875rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.875rem",
          color: "var(--brand-secondary)",
          fontWeight: 500
        }}>
          {lang === "es"
            ? "👋 Alguien del equipo se pondrá en contacto mañana por la mañana."
            : "👋 A staff member will reach out tomorrow morning."}
        </div>
      )}

      {supportPreference === "peer" && (
        <div style={{
          background: "rgba(44,95,46,0.08)",
          border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "var(--radius-sm)",
          padding: "0.875rem 1rem",
          marginBottom: "1.25rem",
          fontSize: "0.875rem",
          color: "var(--brand-secondary)",
          fontWeight: 500
        }}>
          {lang === "es"
            ? "💬 Conectaremos contigo un compañero/a mañana por la mañana."
            : "💬 We'll connect you with a program peer tomorrow morning."}
        </div>
      )}

      {/* Resources */}
      {showResources && (
        <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
          <div style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-muted)",
            marginBottom: "0.6rem"
          }}>
            {lang === "es" ? "Recursos disponibles" : "Available resources"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {relevantResources.map((r, i) => (
              <div key={i} style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "0.875rem 1rem",
                borderLeft: "3px solid var(--brand-primary)",
                boxShadow: "var(--shadow)"
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.2rem" }}>{r.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.3rem" }}>{r.detail}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--brand-primary)", fontWeight: 700 }}>
                  {r.contact}
                  {r.cost && <span style={{ color: "var(--risk-low)", marginLeft: "0.5rem" }}>· {r.cost}</span>}
                </div>
                {r.note && <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.2rem", fontStyle: "italic" }}>{r.note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sign-off */}
      <div style={{
        padding: "1rem",
        background: "rgba(212,80,10,0.04)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid rgba(212,80,10,0.1)",
        marginBottom: "1.25rem"
      }}>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
          {lang === "es" ? "🍳 Hasta mañana en Caridad." : "🍳 See you tomorrow at Caridad."}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          845 N Main Ave, Tucson, AZ 85705
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
        <button className="btn-ghost" style={{ fontSize: "0.78rem" }}>
          {lang === "es" ? "Ajustar preferencias" : "Adjust my preferences"}
        </button>
        <button className="btn-ghost" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          {lang === "es" ? "Cancelar recordatorios" : "Turn off check-ins"}
        </button>
      </div>
    </div>
  );
}
