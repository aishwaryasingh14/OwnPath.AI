export default function LanguageToggle({ lang, setLang }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "2px",
      background: "rgba(0,0,0,0.06)",
      borderRadius: "50px",
      padding: "3px"
    }}>
      {["en", "es"].map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: "4px 14px",
            borderRadius: "50px",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            transition: "all 0.2s ease",
            background: lang === l ? "#fff" : "transparent",
            color: lang === l ? "var(--brand-primary)" : "var(--text-secondary)",
            boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
            cursor: "pointer",
            border: "none",
            minHeight: "32px"
          }}
          aria-pressed={lang === l}
        >
          {l === "en" ? "EN" : "ES"}
        </button>
      ))}
    </div>
  );
}
