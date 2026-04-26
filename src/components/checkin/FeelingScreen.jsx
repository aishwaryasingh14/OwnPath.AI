import { useState } from "react";
import { t, COMMON } from "../../lib/i18n";

const OPTIONS = [
  { value: 1, emoji: "😩", en: "Really struggling",  es: "Me está costando mucho",  fr: "Vraiment du mal",     color: "#C0392B" },
  { value: 2, emoji: "😕", en: "A bit worried",       es: "Un poco preocupado/a",    fr: "Un peu inquiet(e)",   color: "#E67E22" },
  { value: 3, emoji: "😐", en: "Okay, I think",       es: "Creo que estoy bien",     fr: "Ça va, je crois",     color: "#8E8E8E" },
  { value: 4, emoji: "😊", en: "Ready to go!",        es: "¡Listo/a para mañana!",   fr: "Prêt(e) pour demain !", color: "#27AE60" },
  { value: 5, emoji: "🌟", en: "Feeling great!",      es: "¡Me siento genial!",      fr: "Je me sens très bien !", color: "#2C5F2E" }
];

const GREETING = {
  morning: { en: "Good morning",   es: "Buenos días",    fr: "Bonjour" },
  afternoon:{ en: "Good afternoon",es: "Buenas tardes",  fr: "Bon après-midi" },
  evening:  { en: "Good evening",  es: "Buenas noches",  fr: "Bonsoir" }
};

const QUESTION = {
  en: "How are you feeling about tomorrow?",
  es: "¿Cómo te sientes respecto a mañana?",
  fr: "Comment vous sentez-vous par rapport à demain ?"
};

export default function FeelingScreen({ participant, lang, onNext }) {
  const [selected, setSelected] = useState(null);
  const hour = new Date().getHours();
  const greetKey = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const greeting = t(lang, GREETING[greetKey]);
  const greetingEmoji = hour < 18 ? "☀️" : "🌅";

  const handleSelect = (val) => {
    setSelected(val);
    setTimeout(() => onNext(val), 280);
  };

  return (
    <div className="screen-transition">
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
        marginBottom: "1.75rem", boxShadow: "var(--shadow)"
      }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.25rem", fontWeight: 500 }}>
          Caridad Community Kitchen
        </p>
        <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", color: "var(--text-primary)", marginBottom: "0.35rem", lineHeight: 1.25 }}>
          {greeting}, {participant.firstName} {greetingEmoji}
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {t(lang, QUESTION)}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)",
                border: isSelected ? `2px solid ${opt.color}` : "1.5px solid var(--border)",
                background: isSelected ? `${opt.color}12` : "var(--bg-card)",
                cursor: "pointer", transition: "all 0.2s ease",
                animation: `fadeInUp 0.35s ease both`,
                animationDelay: `${i * 70}ms`,
                textAlign: "left", width: "100%", minHeight: 64,
                transform: isSelected ? "scale(0.98)" : undefined,
                boxShadow: isSelected ? `0 0 0 3px ${opt.color}20` : "var(--shadow)"
              }}
            >
              <span style={{ fontSize: "2rem", flexShrink: 0, lineHeight: 1 }}>{opt.emoji}</span>
              <span style={{
                fontSize: "1rem", fontWeight: isSelected ? 700 : 500,
                color: isSelected ? opt.color : "var(--text-primary)", lineHeight: 1.3
              }}>
                {t(lang, opt)}
              </span>
              {isSelected && (
                <span style={{ marginLeft: "auto", color: opt.color, fontSize: "1.1rem", animation: "checkPop 0.3s ease forwards" }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1.25rem", lineHeight: 1.5 }}>
        {t(lang, COMMON.noWrong)}
      </p>
    </div>
  );
}
