const LANGS = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
  { id: "fr", label: "FR" }
];

export default function LanguageToggle({ lang, setLang }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "2px",
      background: "rgba(0,0,0,0.06)", borderRadius: "50px", padding: "3px"
    }}>
      {LANGS.map(l => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          style={{
            padding: "4px 12px", borderRadius: "50px",
            fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em",
            transition: "all 0.2s ease",
            background: lang === l.id ? "#fff" : "transparent",
            color: lang === l.id ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: lang === l.id ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
            cursor: "pointer", border: "none", minHeight: "32px"
          }}
          aria-pressed={lang === l.id}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
