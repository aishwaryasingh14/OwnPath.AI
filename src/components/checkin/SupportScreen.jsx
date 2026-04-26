import { useState } from "react";
import { t, COMMON } from "../../lib/i18n";

const OPTIONS = [
  {
    id: "resources",
    emoji: "📋",
    en: "Send me resources",         es: "Envíame recursos",              fr: "Envoyez-moi des ressources",
    desc_en: "Links and numbers for local help",
    desc_es: "Recursos y teléfonos de ayuda local",
    desc_fr: "Liens et numéros d'aide locale"
  },
  {
    id: "reminder",
    emoji: "⏰",
    en: "Just a reminder tomorrow",  es: "Solo un recordatorio",          fr: "Juste un rappel demain",
    desc_en: "A friendly heads-up the night before",
    desc_es: "Un recordatorio amigable",
    desc_fr: "Un rappel amical la veille"
  },
  {
    id: "staff_contact",
    emoji: "🤝",
    en: "Have a staff member reach out",  es: "Que me contacte el equipo",  fr: "Qu'un membre de l'équipe me contacte",
    desc_en: "Someone will check in with you",
    desc_es: "Alguien se pondrá en contacto",
    desc_fr: "Quelqu'un prendra contact avec vous"
  },
  {
    id: "peer",
    emoji: "💬",
    en: "Connect me with a peer",         es: "Conectarme con un compañero/a", fr: "Me mettre en contact avec un pair",
    desc_en: "Talk to someone who's been there",
    desc_es: "Hablar con alguien que lo ha vivido",
    desc_fr: "Parler à quelqu'un qui l'a vécu"
  },
  {
    id: "none",
    emoji: "✓",
    en: "I'm good — no contact needed",   es: "Estoy bien — no necesito contacto", fr: "Je vais bien — pas de contact nécessaire",
    desc_en: "Your response is still noted and appreciated",
    desc_es: "Tu respuesta igual se valora",
    desc_fr: "Votre réponse est quand même notée et appréciée"
  }
];

const TITLE    = { en: "Would you like any help?",      es: "¿Te gustaría recibir ayuda?",      fr: "Souhaitez-vous de l'aide ?" };
const SUBTITLE = { en: "Your choice, your call — no pressure", es: "Tú decides — sin presión",  fr: "Votre choix, sans pression" };

export default function SupportScreen({ lang, onNext }) {
  const [selected, setSelected] = useState("none");

  return (
    <div className="screen-transition">
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem", boxShadow: "var(--shadow)"
      }}>
        <h2 style={{ fontSize: "1.35rem", marginBottom: "0.3rem" }}>{t(lang, TITLE)}</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t(lang, SUBTITLE)}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)",
                border: isSelected ? "2px solid var(--brand-primary)" : "1.5px solid var(--border)",
                background: isSelected ? "rgba(212,80,10,0.07)" : "var(--bg-card)",
                cursor: "pointer", transition: "all 0.18s ease",
                animation: `fadeInUp 0.3s ease both`, animationDelay: `${i * 65}ms`,
                textAlign: "left", width: "100%", minHeight: 68,
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
                  fontSize: "0.925rem", fontWeight: isSelected ? 700 : 600,
                  color: isSelected ? "var(--brand-primary)" : "var(--text-primary)", marginBottom: "0.1rem"
                }}>
                  {t(lang, opt)}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {opt[`desc_${lang}`] || opt.desc_en}
                </div>
              </div>
              {isSelected && (
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "var(--brand-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
                  animation: "checkPop 0.3s ease forwards"
                }}>✓</div>
              )}
            </button>
          );
        })}
      </div>

      <p style={{
        fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center",
        marginTop: "1rem", lineHeight: 1.55, padding: "0 0.5rem"
      }}>
        {t(lang, COMMON.privacy)}
      </p>

      <button onClick={() => onNext(selected)} className="btn-primary" style={{ width: "100%", marginTop: "1.25rem" }}>
        {t(lang, COMMON.confirm)}
      </button>
    </div>
  );
}
