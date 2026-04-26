import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { DEMO_PARTICIPANTS } from "../../data/participants";
import { getTucsonWeather } from "../../lib/weatherApi";
import LanguageToggle from "../common/LanguageToggle";
import FeelingScreen from "./FeelingScreen";
import BarrierScreen from "./BarrierScreen";
import SupportScreen from "./SupportScreen";
import ConfirmScreen from "./ConfirmScreen";

const STEPS = ["How are you?", "What's hard?", "What would help?", "All set"];

export default function CheckinFlow() {
  const { participantToken } = useParams();
  const [lang, setLang] = useState("en");
  const [step, setStep] = useState(0);
  const [feelingRating, setFeelingRating] = useState(null);
  const [barriers, setBarriers] = useState([]);
  const [supportPreference, setSupportPreference] = useState("none");
  const [weather, setWeather] = useState(null);

  const participant = DEMO_PARTICIPANTS.find(p => p.id === participantToken)
    || DEMO_PARTICIPANTS[0];

  useEffect(() => { getTucsonWeather().then(setWeather); }, []);

  const handleFeeling = (rating) => {
    setFeelingRating(rating);
    setStep(rating >= 4 ? 2 : 1);
  };
  const handleBarriers = (b) => { setBarriers(b); setStep(2); };
  const handleSupport  = (p) => { setSupportPreference(p); setStep(3); };

  const skipBarriers = feelingRating >= 4;
  const visibleSteps = skipBarriers ? [STEPS[0], STEPS[2], STEPS[3]] : STEPS;
  const stepIndex    = skipBarriers && step === 2 ? 1 : skipBarriers && step === 3 ? 2 : step;
  const progress     = step === 3 ? 100 : Math.round(((stepIndex) / (visibleSteps.length - 1)) * 100);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-warm)" }}>

      {/* Header */}
      <header style={{
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0.875rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 20
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--brand-primary), #f07030)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem", boxShadow: "0 2px 8px rgba(212,80,10,0.3)"
          }}>🍳</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)", lineHeight: 1.15 }}>OwnPath</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1 }}>Caridad Community Kitchen</div>
          </div>
        </Link>
        <LanguageToggle lang={lang} setLang={setLang} />
      </header>

      {/* Progress */}
      {step < 3 && (
        <div>
          <div style={{ height: 3, background: "var(--border)" }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--brand-primary), #f07030)",
              borderRadius: "0 2px 2px 0",
              transition: "width 0.45s ease"
            }} />
          </div>
          {/* Step labels */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0.5rem 1.25rem 0",
            gap: "0.25rem"
          }}>
            {visibleSteps.map((s, i) => (
              <span key={i} style={{
                fontSize: "0.65rem",
                color: i === stepIndex ? "var(--brand-primary)" : "var(--text-muted)",
                fontWeight: i === stepIndex ? 700 : 400,
                transition: "color 0.3s ease",
                textAlign: "center",
                flex: 1
              }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Weather alert */}
      {weather?.isDangerous && step === 0 && (
        <div style={{
          background: "rgba(192,57,43,0.07)",
          borderBottom: "1px solid rgba(192,57,43,0.18)",
          padding: "0.55rem 1.25rem",
          fontSize: "0.78rem",
          color: "var(--risk-high)",
          display: "flex", alignItems: "center", gap: "0.4rem"
        }}>
          <span>🌡️</span>
          <span>
            {lang === "es" ? `Mañana: ${weather.temp}°F — planifica tu viaje con tiempo.`
            : lang === "fr" ? `Demain : ${weather.temp}°F — planifiez votre trajet à l'avance.`
            : `Tomorrow's forecast: ${weather.temp}°F — plan your ride early and stay hydrated.`}
          </span>
        </div>
      )}

      {/* Content */}
      <main style={{ flex: 1, padding: "1.75rem 1.25rem 2.5rem", maxWidth: 480, width: "100%", margin: "0 auto" }}>
        {step === 0 && <FeelingScreen participant={participant} lang={lang} onNext={handleFeeling} />}
        {step === 1 && <BarrierScreen lang={lang} onNext={handleBarriers} />}
        {step === 2 && <SupportScreen lang={lang} onNext={handleSupport} />}
        {step === 3 && (
          <ConfirmScreen
            participant={{ ...participant, feelingRating }}
            barriers={barriers}
            supportPreference={supportPreference}
            weather={weather}
            lang={lang}
          />
        )}
      </main>

      <footer style={{
        padding: "0.75rem 1.25rem",
        textAlign: "center",
        fontSize: "0.7rem",
        color: "var(--text-muted)",
        borderTop: "1px solid var(--border)"
      }}>
        Caridad Community Kitchen · 845 N Main Ave, Tucson, AZ · (520) 882-5641
      </footer>
    </div>
  );
}
