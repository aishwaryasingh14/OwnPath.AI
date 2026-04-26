import { MODEL_CARD } from "../../data/modelCard";

export default function ModelCardTab() {
  return (
    <div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        marginBottom: "1.25rem"
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: "var(--radius-sm)",
          background: "var(--brand-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.2rem",
          flexShrink: 0
        }}>📋</div>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "2px" }}>
            OwnPath Risk Model — Model Card
          </h2>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
            v{MODEL_CARD.version} · {MODEL_CARD.date} · {MODEL_CARD.team}
          </div>
        </div>
      </div>

      <div style={{
        border: "1.5px solid var(--border)",
        borderRadius: "var(--radius)",
        overflow: "hidden"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {MODEL_CARD.rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: i < MODEL_CARD.rows.length - 1 ? "1px solid var(--border)" : "none"
                }}
              >
                <td style={{
                  padding: "1rem 1.25rem",
                  width: "34%",
                  verticalAlign: "top",
                  background: "var(--bg-warm)",
                  borderRight: "1px solid var(--border)"
                }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-line",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    lineHeight: 1.4
                  }}>
                    {row.label}
                  </span>
                </td>
                <td style={{
                  padding: "1rem 1.25rem",
                  verticalAlign: "top",
                  background: "var(--bg-card)"
                }}>
                  {row.content && (
                    <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.6 }}>
                      {row.content}
                    </p>
                  )}
                  {row.bullets && (
                    <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                      {row.bullets.map((b, j) => (
                        <li key={j} style={{
                          fontSize: "0.875rem",
                          color: row.negative ? "var(--risk-high)" : "var(--text-primary)",
                          lineHeight: 1.6,
                          marginBottom: "0.15rem"
                        }}>
                          {row.negative ? "✗ " : ""}{b}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: "1.25rem",
        padding: "1rem",
        background: "rgba(44,95,46,0.06)",
        border: "1px solid rgba(44,95,46,0.18)",
        borderRadius: "var(--radius-sm)"
      }}>
        <p style={{ fontSize: "0.82rem", color: "var(--brand-secondary)", fontStyle: "italic", lineHeight: 1.6 }}>
          "We don't predict people out of the program. We predict where support can keep them in it."
        </p>
      </div>

      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.75rem", lineHeight: 1.5 }}>
        This model card follows the format recommended by Mitchell et al. (2019). It is intended to be read by program staff, not participants. Questions? Contact program leadership at Caridad Community Kitchen · (520) 882-5641
      </p>
    </div>
  );
}
