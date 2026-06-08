import { useState } from "react";
import { extractFullCheckin } from "../../lib/groqClient";
import LoadingSpinner from "../common/LoadingSpinner";

const COPY = {
  title:    { en: "Quick check-in",    es: "Registro rápido",        fr: "Enregistrement rapide" },
  subtitle: {
    en: "Just tell us how you're doing in your own words — we'll handle the rest.",
    es: "Cuéntanos cómo estás con tus propias palabras — nosotros nos encargamos del resto.",
    fr: "Dites-nous simplement comment vous allez — nous nous occupons du reste."
  },
  placeholder: {
    en: "How are you doing right now? What's making things hard tonight?",
    es: "¿Cómo estás ahora mismo? ¿Qué te está complicando las cosas esta noche?",
    fr: "Comment vous sentez-vous en ce moment ? Qu'est-ce qui est difficile ce soir ?"
  },
  submit:      { en: "Submit →",        es: "Enviar →",               fr: "Envoyer →" },
  processing:  { en: "Processing...",   es: "Procesando...",           fr: "Traitement..." },
  error: {
    en: "Something went wrong — please try again.",
    es: "Algo salió mal. Por favor intenta de nuevo.",
    fr: "Quelque chose s'est mal passé. Veuillez réessayer."
  },
  privacy: {
    en: "AI reads your message to extract your check-in. Only what you share here is passed to staff.",
    es: "La IA lee tu mensaje para extraer tu registro. Solo lo que compartes aquí llega al equipo.",
    fr: "L'IA lit votre message pour extraire votre enregistrement. Seul ce que vous partagez ici est transmis."
  },
  extracted: {
    en: "Got it — here's what we heard:",
    es: "Entendido — esto es lo que escuchamos:",
    fr: "Compris — voici ce que nous avons retenu :"
  }
};

const t = (lang, obj) => obj[lang] || obj.en;

const MOOD_LABELS = {
  en: ["", "Really struggling", "A bit worried", "Okay", "Ready to go!", "Feeling great!"],
  es: ["", "Me está costando mucho", "Un poco preocupado/a", "Creo que estoy bien", "¡Listo/a para mañana!", "¡Me siento genial!"],
  fr: ["", "Vraiment du mal", "Un peu inquiet(e)", "Ça va", "Prêt(e) pour demain !", "Je me sens très bien !"]
};

export default function QuickCheckinScreen({ participant, lang, onComplete }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [extracted, setExtracted] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(false);
    const result = await extractFullCheckin(text.trim(), participant.firstName, lang);
    setLoading(false);
    if (result) {
      setExtracted(result);
      setTimeout(() => onComplete(result), 2000);
    } else {
      setError(true);
    }
  };

  return (
    <div className="screen-transition">
      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
        marginBottom: "1.5rem", boxShadow: "var(--shadow)"
      }}>
        <h2 style={{ fontSize: "1.35rem", marginBottom: "0.3rem" }}>{t(lang, COPY.title)}</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{t(lang, COPY.subtitle)}</p>
      </div>

      <textarea
        rows={5}
        placeholder={t(lang, COPY.placeholder)}
        value={text}
        onChange={e => { setText(e.target.value); setError(false); setExtracted(null); }}
        disabled={loading || !!extracted}
        style={{
          width: "100%", padding: "1rem", resize: "none",
          borderRadius: "var(--radius-sm)",
          border: `1.5px solid ${error ? "var(--risk-high)" : extracted ? "var(--brand-secondary)" : "var(--border)"}`,
          fontSize: "1rem", background: "var(--bg-card)", color: "var(--text-primary)",
          outline: "none", lineHeight: 1.6, fontFamily: "inherit",
          marginBottom: "1rem", transition: "border-color 0.2s ease",
          opacity: extracted ? 0.75 : 1
        }}
        onFocus={e => { if (!extracted) e.target.style.borderColor = "var(--brand-primary)"; }}
        onBlur={e => { if (!extracted) e.target.style.borderColor = error ? "var(--risk-high)" : "var(--border)"; }}
        autoFocus
      />

      {extracted && (
        <div style={{
          padding: "0.875rem 1rem", marginBottom: "1rem",
          background: "rgba(44,95,46,0.07)", border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "var(--radius-sm)", animation: "fadeInUp 0.25s ease both"
        }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--brand-secondary)", marginBottom: "0.5rem" }}>
            {t(lang, COPY.extracted)}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
            {extracted.summary}
          </div>
          <div style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Mood: {(MOOD_LABELS[lang] || MOOD_LABELS.en)[extracted.feelingRating] || "—"}
            {extracted.barriers?.length > 0 && ` · Barriers: ${extracted.barriers.join(", ")}`}
          </div>
        </div>
      )}

      {error && (
        <p style={{ fontSize: "0.82rem", color: "var(--risk-high)", marginBottom: "0.75rem" }}>
          {t(lang, COPY.error)}
        </p>
      )}

      {!extracted && (
        <button
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          className="btn-primary"
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          {loading
            ? <><LoadingSpinner size={16} color="#fff" /> {t(lang, COPY.processing)}</>
            : t(lang, COPY.submit)}
        </button>
      )}

      <p style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "1rem", lineHeight: 1.5 }}>
        {t(lang, COPY.privacy)}
      </p>
    </div>
  );
}
