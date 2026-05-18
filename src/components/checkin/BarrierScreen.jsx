import { useState } from "react";
import { t, COMMON } from "../../lib/i18n";
import { extractBarriers } from "../../lib/groqClient";
import LoadingSpinner from "../common/LoadingSpinner";

const BARRIERS = [
  { id: "transportation", emoji: "🚌", en: "Getting there",        es: "El transporte",          fr: "Se déplacer" },
  { id: "childcare",      emoji: "👶", en: "Childcare",            es: "Cuidado de niños",       fr: "Garde d'enfants" },
  { id: "housing",        emoji: "🏠", en: "Housing stress",       es: "Vivienda",               fr: "Logement" },
  { id: "overwhelmed",    emoji: "😰", en: "Feeling overwhelmed",  es: "Me siento agobiado/a",   fr: "Me sentir dépassé(e)" },
  { id: "money",          emoji: "💸", en: "Money stress",         es: "Estrés económico",       fr: "Stress financier" },
  { id: "sick",           emoji: "😷", en: "Not feeling well",     es: "No me siento bien",      fr: "Ne pas me sentir bien" },
  { id: "other",          emoji: "💬", en: "Something else...",    es: "Algo más...",            fr: "Autre chose..." },
  { id: "skip",           emoji: "→",  en: "I'd rather not say",   es: "Prefiero no decir",      fr: "Je préfère ne pas dire" }
];

const TITLE    = { en: "What's making things harder?",        es: "¿Qué te complica las cosas?",       fr: "Qu'est-ce qui rend les choses plus difficiles ?" };
const SUBTITLE = { en: "Choose all that apply — or skip",     es: "Puedes elegir más de una opción",   fr: "Choisissez tout ce qui s'applique — ou ignorez" };
const OTHER_PH = { en: "Tell us a bit more...",               es: "Cuéntanos un poco más...",          fr: "Dites-nous en un peu plus..." };
const FREETEXT_LABEL = { en: "Or describe it in your own words", es: "O descríbelo con tus palabras", fr: "Ou décrivez-le à votre façon" };
const FREETEXT_PH    = { en: "What's going on for you right now?", es: "¿Qué está pasando contigo ahora?", fr: "Qu'est-ce qui se passe pour vous en ce moment ?" };
const EXTRACTED_LABEL = { en: "We heard:", es: "Entendimos:", fr: "Nous avons compris :" };

export default function BarrierScreen({ participant, lang, onNext }) {
  const [selected, setSelected] = useState([]);
  const [otherText, setOtherText] = useState("");
  const [freeText, setFreeText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const toggle = (id) => {
    if (id === "skip") { onNext(["skip"]); return; }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleContinue = async () => {
    if (selected.length > 0) {
      const barriers = selected.map(id => id === "other" ? (otherText || "other") : id);
      onNext(barriers);
      return;
    }
    if (freeText.trim()) {
      setExtracting(true);
      const result = await extractBarriers(freeText.trim(), participant?.firstName || "participant");
      setExtracting(false);
      const barriers = result.barriers?.length ? result.barriers : ["other"];
      setExtracted({ barriers, summary: result.summary });
      setTimeout(() => onNext(barriers), 1600);
      return;
    }
    onNext(["skip"]);
  };

  const hasInput = selected.length > 0 || freeText.trim().length > 0;

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
        {BARRIERS.map((b, i) => {
          const isSelected = selected.includes(b.id);
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                gap: "0.35rem", padding: "0.9rem 1rem",
                borderRadius: "var(--radius-sm)",
                border: isSelected ? "2px solid var(--brand-primary)" : "1.5px solid var(--border)",
                background: isSelected ? "rgba(212,80,10,0.07)" : "var(--bg-card)",
                cursor: "pointer", transition: "all 0.18s ease",
                animation: `fadeInUp 0.3s ease both`, animationDelay: `${i * 55}ms`,
                minHeight: b.id === "skip" ? 52 : 72,
                gridColumn: b.id === "skip" ? "1 / -1" : undefined,
                boxShadow: isSelected ? "0 0 0 3px rgba(212,80,10,0.1)" : "var(--shadow)"
              }}
            >
              <span style={{ fontSize: b.id === "skip" ? "1rem" : "1.5rem" }}>{b.emoji}</span>
              <span style={{
                fontSize: "0.82rem", fontWeight: isSelected ? 700 : 500,
                color: isSelected ? "var(--brand-primary)" : "var(--text-primary)",
                lineHeight: 1.3, textAlign: "left"
              }}>
                {t(lang, b)}
              </span>
            </button>
          );
        })}
      </div>

      {selected.includes("other") && (
        <input
          type="text"
          placeholder={t(lang, OTHER_PH)}
          value={otherText}
          onChange={e => setOtherText(e.target.value)}
          style={{
            width: "100%", marginTop: "0.6rem", padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)",
            fontSize: "0.9rem", background: "var(--bg-card)", color: "var(--text-primary)", outline: "none"
          }}
          autoFocus
        />
      )}

      {/* Free-text natural language option */}
      {selected.length === 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            {t(lang, FREETEXT_LABEL)}
          </div>
          <textarea
            rows={3}
            placeholder={t(lang, FREETEXT_PH)}
            value={freeText}
            onChange={e => setFreeText(e.target.value)}
            style={{
              width: "100%", padding: "0.75rem 1rem", resize: "none",
              borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)",
              fontSize: "0.9rem", background: "var(--bg-card)", color: "var(--text-primary)",
              outline: "none", lineHeight: 1.55, fontFamily: "inherit",
              transition: "border-color 0.2s ease",
              boxSizing: "border-box"
            }}
            onFocus={e => { e.target.style.borderColor = "var(--brand-primary)"; }}
            onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
          />
        </div>
      )}

      {/* Extraction result confirmation */}
      {extracted && (
        <div style={{
          marginTop: "0.75rem", padding: "0.75rem 1rem",
          background: "rgba(44,95,46,0.08)", border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "var(--radius-sm)", animation: "fadeInUp 0.25s ease both"
        }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--brand-secondary)", marginBottom: "0.2rem" }}>
            {t(lang, EXTRACTED_LABEL)}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
            {extracted.summary}
          </div>
        </div>
      )}

      {hasInput && !extracted && (
        <button
          onClick={handleContinue}
          disabled={extracting}
          className="btn-primary"
          style={{ width: "100%", marginTop: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          {extracting ? <><LoadingSpinner size={16} color="#fff" /> Listening...</> : t(lang, COMMON.continue)}
        </button>
      )}
    </div>
  );
}
