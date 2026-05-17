import { useEffect, useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { SUPPORT_RESOURCES, BARRIER_RESOURCE_MAP } from "../../data/resources";
import { generateParticipantMessage } from "../../lib/groqClient";
import { t, COMMON } from "../../lib/i18n";

const SUPPORT_PREF_LABELS = {
  resources: {
    en: "Resources only",
    es: "Solo recursos",
    fr: "Ressources seulement"
  },
  reminder: {
    en: "Reminder tomorrow",
    es: "Recordatorio mañana",
    fr: "Rappel demain"
  },
  staff_contact: {
    en: "Staff may reach out",
    es: "El equipo puede contactarme",
    fr: "L'équipe peut me contacter"
  },
  peer: {
    en: "Peer connection",
    es: "Conexión con un compañero/a",
    fr: "Contact avec un pair"
  },
  none: {
    en: "No contact needed",
    es: "No necesito contacto",
    fr: "Pas de contact nécessaire"
  }
};

const BARRIER_LABELS = {
  transportation: { en: "Getting there", es: "El transporte", fr: "Se déplacer" },
  childcare: { en: "Childcare", es: "Cuidado de niños", fr: "Garde d'enfants" },
  housing: { en: "Housing stress", es: "Vivienda", fr: "Logement" },
  overwhelmed: { en: "Feeling overwhelmed", es: "Me siento agobiado/a", fr: "Me sentir dépassé(e)" },
  money: { en: "Money stress", es: "Estrés económico", fr: "Stress financier" },
  sick: { en: "Not feeling well", es: "No me siento bien", fr: "Ne pas me sentir bien" },
  skip: { en: "Nothing shared", es: "Nada compartido", fr: "Rien partagé" }
};

const RECEIPT_COPY = {
  title: { en: "Your choices are saved for tonight", es: "Tus decisiones están guardadas por hoy", fr: "Vos choix sont enregistrés pour ce soir" },
  shared: { en: "Shared", es: "Compartido", fr: "Partagé" },
  support: { en: "Support preference", es: "Preferencia de apoyo", fr: "Préférence de soutien" },
  notCollected: { en: "Not collected", es: "No recopilado", fr: "Non collecté" },
  notCollectedValue: {
    en: "No location, immigration status, social media, or background data",
    es: "Sin ubicación, estatus migratorio, redes sociales ni datos externos",
    fr: "Pas de localisation, statut migratoire, médias sociaux ni données externes"
  },
  staffReview: {
    en: "Staff can only see what you chose to share. Any outreach still needs approval.",
    es: "El equipo solo ve lo que decidiste compartir. Cualquier contacto requiere aprobación.",
    fr: "L'équipe ne voit que ce que vous avez choisi de partager. Tout contact demande une approbation."
  }
};

export default function ConfirmScreen({ participant, barriers, supportPreference, weather, lang, onAdjust, onTurnOff }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const weatherCtx = weather?.isDangerous ? `Extreme heat (${weather.temp}°F)`
      : weather?.isHot ? `Hot day (${weather.temp}°F)` : "normal";

    generateParticipantMessage(
      { ...participant, supportPreference },
      barriers.filter(b => b !== "skip"),
      weatherCtx,
      lang
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

  const msgText = lang === "fr" ? message?.french : lang === "es" ? message?.spanish : message?.english;
  const sharedLabels = barriers
    .filter(Boolean)
    .map(b => BARRIER_LABELS[b] ? t(lang, BARRIER_LABELS[b]) : b)
    .filter((b, idx, arr) => arr.indexOf(b) === idx);
  const sharedText = sharedLabels.length && !sharedLabels.includes(t(lang, BARRIER_LABELS.skip))
    ? sharedLabels.join(", ")
    : t(lang, BARRIER_LABELS.skip);

  return (
    <div className="screen-transition" style={{ textAlign: "center" }}>
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

      <div style={{
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "1.25rem 1.5rem",
        marginBottom: "1.25rem", boxShadow: "var(--shadow)",
        minHeight: 80, display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            <LoadingSpinner size={18} />
            <span>{t(lang, COMMON.preparing)}</span>
          </div>
        ) : (
          <p style={{
            fontSize: "1rem", color: "var(--text-primary)", lineHeight: 1.65,
            opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(6px)",
            transition: "all 0.4s ease"
          }}>
            {msgText}
          </p>
        )}
      </div>

      {supportPreference === "staff_contact" && (
        <div style={{
          background: "rgba(44,95,46,0.08)", border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "var(--radius-sm)", padding: "0.875rem 1rem",
          marginBottom: "1.25rem", fontSize: "0.875rem", color: "var(--brand-secondary)", fontWeight: 500
        }}>
          {t(lang, COMMON.staffContact)}
        </div>
      )}

      {supportPreference === "peer" && (
        <div style={{
          background: "rgba(44,95,46,0.08)", border: "1px solid rgba(44,95,46,0.22)",
          borderRadius: "var(--radius-sm)", padding: "0.875rem 1rem",
          marginBottom: "1.25rem", fontSize: "0.875rem", color: "var(--brand-secondary)", fontWeight: 500
        }}>
          {t(lang, COMMON.peerContact)}
        </div>
      )}

      {showResources && (
        <div style={{ textAlign: "left", marginBottom: "1.5rem" }}>
          <div style={{
            fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: "0.6rem"
          }}>
            {t(lang, COMMON.resources)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {relevantResources.map((r, i) => (
              <div key={i} style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)", padding: "0.875rem 1rem",
                borderLeft: "3px solid var(--brand-primary)", boxShadow: "var(--shadow)"
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

      <div style={{
        padding: "1rem", background: "rgba(212,80,10,0.04)",
        borderRadius: "var(--radius-sm)", border: "1px solid rgba(212,80,10,0.1)", marginBottom: "1.25rem"
      }}>
        <p style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "0.2rem" }}>
          {t(lang, COMMON.seeYou)}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>845 N Main Ave, Tucson, AZ 85705</p>
      </div>

      <div style={{
        textAlign: "left",
        background: "rgba(44,95,46,0.05)",
        border: "1px solid rgba(44,95,46,0.16)",
        borderRadius: "var(--radius-sm)",
        padding: "1rem",
        marginBottom: "1.25rem"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          fontSize: "0.78rem",
          fontWeight: 800,
          color: "var(--brand-secondary)",
          marginBottom: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em"
        }}>
          <span>✓</span>
          {t(lang, RECEIPT_COPY.title)}
        </div>
        {[
          { label: t(lang, RECEIPT_COPY.shared), value: sharedText },
          { label: t(lang, RECEIPT_COPY.support), value: t(lang, SUPPORT_PREF_LABELS[supportPreference] || SUPPORT_PREF_LABELS.none) },
          { label: t(lang, RECEIPT_COPY.notCollected), value: t(lang, RECEIPT_COPY.notCollectedValue) }
        ].map(row => (
          <div key={row.label} style={{
            display: "grid",
            gridTemplateColumns: "105px 1fr",
            gap: "0.75rem",
            padding: "0.4rem 0",
            borderTop: "1px solid rgba(44,95,46,0.1)"
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 700 }}>
              {row.label}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.45 }}>
              {row.value}
            </div>
          </div>
        ))}
        <p style={{ fontSize: "0.72rem", color: "var(--brand-secondary)", lineHeight: 1.5, marginTop: "0.55rem" }}>
          {t(lang, RECEIPT_COPY.staffReview)}
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
        <button onClick={onAdjust} className="btn-ghost" style={{ fontSize: "0.78rem" }}>{t(lang, COMMON.adjust)}</button>
        <button onClick={onTurnOff} className="btn-ghost" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{t(lang, COMMON.turnOff)}</button>
      </div>
    </div>
  );
}
