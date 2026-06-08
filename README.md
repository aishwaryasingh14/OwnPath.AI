# OwnPath.AI

Participant support and retention tool for Caridad Community Kitchen's free 10-week culinary training program.

**Hack Arizona 2026 — Track 04: Southern Arizona Social Innovation**
**🏆 Winner: Best Preservation of Individual Autonomy ($500)**

> *"We don't predict people out of the program. We predict where support can keep them in it."*

---

## What it does

OwnPath gives participants a friendly, SMS-style nightly check-in (no app, no login required) and gives staff a respectful support queue with AI-powered explanations — never a surveillance wall. The default is always **no contact**. All outreach requires manual staff approval.

Built as a prototype to show the Community Food Bank of Southern Arizona what a low-cost, dignity-first retention tool could look like for their culinary training program.

---

## Demo routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/checkin/P001` | Rosa's check-in (active risk — transportation) |
| `/checkin/P002` | Marcus's check-in (high risk — housing + overwhelmed) |
| `/checkin/P003` | Diana's check-in (medium risk — childcare) |
| `/staff` | Staff dashboard (passcode: `caridad2026`) |

---

## Participant check-in

A 4-screen conversational flow accessible via a unique SMS link:

1. **Feeling** — 5-point mood scale, time-aware greeting, auto-skips barriers if mood ≥ 4
2. **Barriers** — multi-select (transportation, childcare, housing, overwhelmed, money, sick) + free-text that Groq LLM extracts into categories
3. **Support preference** — resources only, reminder, staff contact, peer connection, or no contact (default)
4. **Confirmation** — personalized LLM message, real Tucson local resources, data receipt showing exactly what was and wasn't shared

**Languages:** English, Spanish, French

**Participant autonomy controls:**
- "Turn off check-ins" persists via localStorage — opt-out is honored on return visits
- "Clear my data" resets the current session's check-in data and shows a confirmation toast
- No contact is always the default support preference

---

## Staff dashboard

Password-protected interface (`caridad2026`) with five tabs:

### Today's Queue
- Participant cards sorted by risk level (HIGH / MEDIUM / LOW)
- **Search by name** — filters the list in real time
- **Barrier filter chips** — narrow to participants reporting a specific barrier (transport, childcare, housing, overwhelmed, money)
- **Export CSV** — downloads a spreadsheet of all participants with risk levels, barriers, support preferences, and completion probabilities
- Each card expands to show:
  - Mood history timeline (colored blocks across all check-ins)
  - All risk factors with explanations
  - AI-generated summary, suggested action, and draft message (Groq)
  - Consent boundary enforced in UI — action buttons hidden if participant didn't allow that contact type
  - **Staff notes** — private textarea that auto-saves to localStorage; a note indicator appears on the card

### Insights
- Cohort barrier patterns, autonomy pulse, Week 3 watch, heat alerts
- Groq-powered weekly cohort analysis: headline, signals, priority action
- Full cohort heat map showing mood history across all participants

### Autonomy Audit
- Tracks opt-in rate, no-contact honored %, direct contact allowed
- Participant Bill of Rights and data OwnPath refuses to collect

### Model Card
- In-app AI transparency: what the model uses, what it never touches, limitations, human-in-loop commitment

### Manage Cohort *(new)*
- Form to add real participants (name, week, day, missed/late days, support preference, barriers)
- Custom participants persist in localStorage and appear in the queue with full risk scoring
- Remove custom participants at any time

---

## AI integrations

All LLM calls use **Groq (llama-3.3-70b-versatile)** via a Netlify serverless function:

| Function | Used for |
|---|---|
| Barrier extraction | Parses free-text check-in into barrier categories |
| Participant message | Generates warm, personalized trilingual confirmation |
| Staff explanation | Explains why a participant is flagged + suggested action + draft message |
| Intervention ranking | Re-ranks What-If Simulator options for a specific participant |
| Cohort narration | Weekly program-level analysis for staff insights tab |

All functions have offline fallback templates — the demo works without a Groq API key.

---

## Risk scoring engine

Fully rule-based (not AI), transparent scoring:

| Signal | Points |
|---|---|
| Missed days | 15 pts each (max 40) |
| Late days | 5 pts each (max 15) |
| Transportation barrier | +20 |
| Housing barrier | +25 |
| Childcare barrier | +18 |
| Overwhelmed | +15 |
| Week 3 (highest dropout) | +15 |
| 3+ consecutive barrier days | +15 |
| Extreme heat tomorrow (≥105°F) | +8 |
| No check-in today | +5 |

Score → risk level (low / medium / high) → **completion probability %**

---

## Tech stack

- **Frontend:** React 18, React Router v6, Vite 6
- **Serverless:** Netlify Functions (Node.js)
- **LLM:** Groq SDK — llama-3.3-70b-versatile
- **Weather:** National Weather Service API (free, no key)
- **Storage:** localStorage (no backend — demo-only)
- **Fonts:** DM Serif Display, DM Sans, JetBrains Mono
- **Deployed:** Netlify — `ownpath-caridad.netlify.app`

---

## Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

To enable Groq AI features, add a `.env` file:
```
GROQ_API_KEY=your_key_here
```

Without the key, all AI features fall back to pre-written templates automatically.

---

## Design principles

- **No login, no app** — participants access via unique token in an SMS link
- **Default is no contact** — participants opt in, not out
- **Consent enforced in UI** — action buttons are hidden if participant didn't allow that contact type
- **Nothing sends automatically** — all outreach is manual and requires staff approval
- **Transparent AI** — model card visible in-app, risk factors shown as plain text, no black boxes

---

*Partner: Community Food Bank of Southern Arizona*
*Challenge: Improving Workforce Training Completion for Individuals Facing Barriers to Employment*
*Caridad Community Kitchen · 845 N Main Ave, Tucson, AZ 85705 · (520) 882-5641*
