import { useState } from "react";

const BARRIER_OPTIONS = [
  { id: "transportation", label: "🚌 Transportation" },
  { id: "childcare",      label: "👶 Childcare" },
  { id: "housing",        label: "🏠 Housing stress" },
  { id: "overwhelmed",    label: "😰 Overwhelmed" },
  { id: "money",          label: "💸 Money stress" },
  { id: "sick",           label: "😷 Not feeling well" }
];

const SUPPORT_OPTIONS = [
  { id: "none",          label: "No contact needed" },
  { id: "resources",     label: "Resources only" },
  { id: "reminder",      label: "Reminder tomorrow" },
  { id: "staff_contact", label: "Staff may reach out" },
  { id: "peer",          label: "Peer connection" }
];

const EMPTY_FORM = {
  firstName: "", lastName: "",
  currentWeek: 1, currentDay: 1,
  missedDays: 0, lateDays: 0,
  supportPreference: "none",
  reportedBarriers: [],
  consecutiveBarrierDays: 0,
  checkedInToday: false,
  checkinHistory: []
};

const inputStyle = {
  width: "100%", padding: "0.6rem 0.875rem",
  borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)",
  fontSize: "0.875rem", background: "var(--bg-warm)", color: "var(--text-primary)",
  outline: "none", transition: "border-color 0.2s ease"
};

const labelStyle = {
  display: "block", fontSize: "0.72rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.07em",
  color: "var(--text-muted)", marginBottom: "0.35rem"
};

export default function ManageCohortTab({ customParticipants, onAdd, onRemove, demoCount }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [added, setAdded] = useState(false);

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const toggleBarrier = (id) => {
    setForm(prev => ({
      ...prev,
      reportedBarriers: prev.reportedBarriers.includes(id)
        ? prev.reportedBarriers.filter(b => b !== id)
        : [...prev.reportedBarriers, id]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onAdd({
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      id: `CUSTOM_${Date.now()}`,
      currentWeek: Number(form.currentWeek),
      currentDay: Number(form.currentDay),
      missedDays: Number(form.missedDays),
      lateDays: Number(form.lateDays),
      consecutiveBarrierDays: form.reportedBarriers.length > 0 ? 1 : 0,
    });
    setForm(EMPTY_FORM);
    setErrors({});
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>Manage Cohort</h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Add participants to this cohort. Demo participants ({demoCount}) are read-only.
        </p>
      </div>

      {/* Add participant form */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontSize: "1rem", marginBottom: "1.25rem" }}>➕ Add Participant</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={labelStyle}>First name *</label>
              <input
                style={{ ...inputStyle, borderColor: errors.firstName ? "var(--risk-high)" : "var(--border)" }}
                value={form.firstName}
                onChange={e => { set("firstName", e.target.value); setErrors(prev => ({ ...prev, firstName: undefined })); }}
                onFocus={e => { e.target.style.borderColor = "var(--brand-primary)"; }}
                onBlur={e => { e.target.style.borderColor = errors.firstName ? "var(--risk-high)" : "var(--border)"; }}
                placeholder="e.g. Maria"
              />
              {errors.firstName && <div style={{ fontSize: "0.72rem", color: "var(--risk-high)", marginTop: "0.25rem" }}>{errors.firstName}</div>}
            </div>
            <div>
              <label style={labelStyle}>Last name *</label>
              <input
                style={{ ...inputStyle, borderColor: errors.lastName ? "var(--risk-high)" : "var(--border)" }}
                value={form.lastName}
                onChange={e => { set("lastName", e.target.value); setErrors(prev => ({ ...prev, lastName: undefined })); }}
                onFocus={e => { e.target.style.borderColor = "var(--brand-primary)"; }}
                onBlur={e => { e.target.style.borderColor = errors.lastName ? "var(--risk-high)" : "var(--border)"; }}
                placeholder="e.g. G."
              />
              {errors.lastName && <div style={{ fontSize: "0.72rem", color: "var(--risk-high)", marginTop: "0.25rem" }}>{errors.lastName}</div>}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
            {[
              { label: "Week (1–10)", field: "currentWeek", min: 1, max: 10 },
              { label: "Day (1–5)",   field: "currentDay",  min: 1, max: 5 },
              { label: "Missed days", field: "missedDays",  min: 0, max: 50 },
              { label: "Late days",   field: "lateDays",    min: 0, max: 50 }
            ].map(({ label, field, min, max }) => (
              <div key={field}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="number" min={min} max={max}
                  style={inputStyle}
                  value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  onFocus={e => { e.target.style.borderColor = "var(--brand-primary)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
                />
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Support preference</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.supportPreference}
              onChange={e => set("supportPreference", e.target.value)}
            >
              {SUPPORT_OPTIONS.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={labelStyle}>Reported barriers</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {BARRIER_OPTIONS.map(b => {
                const active = form.reportedBarriers.includes(b.id);
                return (
                  <button
                    key={b.id} type="button"
                    onClick={() => toggleBarrier(b.id)}
                    style={{
                      padding: "0.35rem 0.75rem", borderRadius: "50px",
                      border: active ? "1.5px solid var(--brand-primary)" : "1px solid var(--border)",
                      background: active ? "rgba(212,80,10,0.08)" : "var(--bg-card)",
                      color: active ? "var(--brand-primary)" : "var(--text-secondary)",
                      fontSize: "0.78rem", cursor: "pointer", fontWeight: active ? 600 : 400,
                      transition: "all 0.18s ease"
                    }}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button type="submit" className="btn-primary" style={{ padding: "0.6rem 1.5rem" }}>
              Add to cohort
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}
            >
              Clear
            </button>
            {added && (
              <span style={{ fontSize: "0.82rem", color: "var(--risk-low)", fontWeight: 600 }}>
                ✓ Participant added
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Custom participants list */}
      {customParticipants.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: "1rem", marginBottom: "1rem" }}>
            Added participants ({customParticipants.length})
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {customParticipants.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)", background: "var(--bg-warm)"
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                    {p.firstName} {p.lastName}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.75rem" }}>
                    Week {p.currentWeek} · Day {p.currentDay}
                    {p.missedDays > 0 && ` · ${p.missedDays} missed`}
                    {p.reportedBarriers?.length > 0 && ` · ${p.reportedBarriers.join(", ")}`}
                  </span>
                </div>
                <button
                  onClick={() => onRemove(p.id)}
                  style={{
                    fontSize: "0.75rem", color: "var(--risk-high)", background: "none",
                    border: "1px solid rgba(192,57,43,0.25)", borderRadius: "50px",
                    padding: "0.25rem 0.65rem", cursor: "pointer", transition: "all 0.18s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(192,57,43,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {customParticipants.length === 0 && (
        <div style={{
          textAlign: "center", padding: "2rem",
          color: "var(--text-muted)", fontSize: "0.85rem",
          border: "1px dashed var(--border)", borderRadius: "var(--radius)"
        }}>
          No custom participants yet. Use the form above to add cohort members.
        </div>
      )}
    </div>
  );
}
