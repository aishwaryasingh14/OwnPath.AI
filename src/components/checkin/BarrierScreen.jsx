import { useState } from "react";

const BARRIERS = [
  { id: "transportation", emoji: "🚌", en: "Getting there",        es: "El transporte" },
  { id: "childcare",      emoji: "👶", en: "Childcare",            es: "Cuidado de niños" },
  { id: "housing",        emoji: "🏠", en: "Housing stress",       es: "Vivienda" },
  { id: "overwhelmed",    emoji: "😰", en: "Feeling overwhelmed",  es: "Me siento agobiado/a" },
  { id: "money",          emoji: "💸", en: "Money stress",         es: "Estrés económico" },
  { id: "sick",           emoji: "😷", en: "Not feeling well",     es: "No me siento bien" },
  { id: "other",          emoji: "💬", en: "Something else...",    es: "Algo más..." },
  { id: "skip",           emoji: "→",  en: "I'd rather not say",   es: "Prefiero no decir" }
];

export default function BarrierScreen({ lang, onNext }) {
  const [selected, setSelected] = useState([]);
  const [otherText, setOtherText] = useState("");

  const toggle = (id) => {
    if (id === "skip") { onNext(["skip"]); return; }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleContinue = () => {
    const barriers = selected.map(id => id === "other" ? (otherText || "other") : id);
    onNext(barriers.length ? barriers : ["skip"]);
  };

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
          {lang === "es" ? "¿Qué te complica las cosas?" : "What's making things harder?"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {lang === "es" ? "Puedes elegir más de una opción" : "Choose all that apply — or skip"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
        {BARRIERS.map((b, i) => {
          const isSelected = selected.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.35rem",
                padding: "0.9rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: isSelected ? "2px solid var(--brand-primary)" : "1.5px solid var(--border)",
                background: isSelected ? "rgba(212,80,10,0.07)" : "var(--bg-card)",
                cursor: "pointer",
                transition: "all 0.18s ease",
                animation: `fadeInUp 0.3s ease both`,
                animationDelay: `${i * 55}ms`,
                minHeight: b.id === "skip" ? 52 : 72,
                gridColumn: b.id === "skip" ? "1 / -1" : undefined,
                boxShadow: isSelected ? "0 0 0 3px rgba(212,80,10,0.1)" : "var(--shadow)"
              }}
            >
              <span style={{ fontSize: b.id === "skip" ? "1rem" : "1.5rem" }}>{b.emoji}</span>
              <span style={{
                fontSize: "0.82rem",
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? "var(--brand-primary)" : "var(--text-primary)",
                lineHeight: 1.3,
                textAlign: "left"
              }}>
                {lang === "es" ? b.es : b.en}
              </span>
            </button>
          );
        })}
      </div>

      {selected.includes("other") && (
        <input
          type="text"
          placeholder={lang === "es" ? "Cuéntanos un poco más..." : "Tell us a bit more..."}
          value={otherText}
          onChange={e => setOtherText(e.target.value)}
          style={{
            width: "100%",
            marginTop: "0.6rem",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--border)",
            fontSize: "0.9rem",
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            outline: "none"
          }}
          autoFocus
        />
      )}

      {selected.length > 0 && (
        <button onClick={handleContinue} className="btn-primary" style={{ width: "100%", marginTop: "1.25rem" }}>
          {lang === "es" ? "Continuar →" : "Continue →"}
        </button>
      )}
    </div>
  );
}
