import { useState } from "react";

const OPTIONS = [
  {
    id: "resources",
    emoji: "📋",
    en: "Send me resources",
    es: "Envíame recursos",
    desc_en: "Links and numbers for local help",
    desc_es: "Recursos y teléfonos de ayuda local"
  },
  {
    id: "reminder",
    emoji: "⏰",
    en: "Just a reminder tomorrow",
    es: "Solo un recordatorio",
    desc_en: "A friendly heads-up the night before",
    desc_es: "Un recordatorio amigable"
  },
  {
    id: "staff_contact",
    emoji: "🤝",
    en: "Have a staff member reach out",
    es: "Que me contacte el equipo",
    desc_en: "Someone will check in with you",
    desc_es: "Alguien se pondrá en contacto"
  },
  {
    id: "peer",
    emoji: "💬",
    en: "Connect me with a peer",
    es: "Conectarme con un compañero/a",
    desc_en: "Talk to someone who's been there",
    desc_es: "Hablar con alguien que lo ha vivido"
  },
  {
    id: "none",
    emoji: "✓",
    en: "I'm good — no contact needed",
    es: "Estoy bien — no necesito contacto",
    desc_en: "Your response is still noted and appreciated",
    desc_es: "Tu respuesta igual se valora"
  }
];

export default function SupportScreen({ lang, onNext }) {
  const [selected, setSelected] = useState("none");

  return (
    <div className="screen-transition">
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "var(--shadow)"
      }}>
        <h2 style={{ fontSize: "1.35rem", marginBottom: "0.3rem" }}>
          {lang === "es" ? "¿Te gustaría recibir ayuda?" : "Would you like any help?"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {lang === "es" ? "Tú decides — sin presión" : "Your choice, your call — no pressure"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                borderRadius: "var(--radius-sm)",
                border: isSelected ? "2px solid var(--brand-primary)" : "1.5px solid var(--border)",
                background: isSelected ? "rgba(212,80,10,0.07)" : "var(--bg-card)",
                cursor: "pointer",
                transition: "all 0.18s ease",
                animation: `fadeInUp 0.3s ease both`,
                animationDelay: `${i * 65}ms`,
                textAlign: "left",
                width: "100%",
                minHeight: 68,
                boxShadow: isSelected ? "0 0 0 3px rgba(212,80,10,0.1)" : "var(--shadow)"
              }}
            >
              <div style={{
                width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                background: isSelected ? "rgba(212,80,10,0.12)" : "var(--bg-warm)",
                border: isSelected ? "1.5px solid rgba(212,80,10,0.25)" : "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", transition: "all 0.18s ease"
              }}>
                {opt.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "0.925rem",
                  fontWeight: isSelected ? 700 : 600,
                  color: isSelected ? "var(--brand-primary)" : "var(--text-primary)",
                  marginBottom: "0.1rem"
                }}>
                  {lang === "es" ? opt.es : opt.en}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {lang === "es" ? opt.desc_es : opt.desc_en}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: "var(--brand-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "0.75rem", fontWeight: 700,
                  flexShrink: 0,
                  animation: "checkPop 0.3s ease forwards"
                }}>✓</div>
              )}
            </button>
          );
        })}
      </div>

      <p style={{
        fontSize: "0.72rem",
        color: "var(--text-muted)",
        textAlign: "center",
        marginTop: "1rem",
        lineHeight: 1.55,
        padding: "0 0.5rem"
      }}>
        {lang === "es"
          ? "Tu respuesta nos ayuda a entender tendencias, pero tú controlas lo que se comparte."
          : "Your response helps us understand program patterns, but you choose what's shared."}
      </p>

      <button onClick={() => onNext(selected)} className="btn-primary" style={{ width: "100%", marginTop: "1.25rem" }}>
        {lang === "es" ? "Confirmar →" : "Confirm →"}
      </button>
    </div>
  );
}
