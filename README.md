# OwnPath.AI

AI-powered participant support and retention platform for Caridad Community Kitchen's free 10-week culinary job-training program in Tucson, AZ.

**Hack Arizona 2026 · Track 04 · Southern Arizona Social Innovation**
**🏆 Winner: Best Preservation of Individual Autonomy ($500)**

> *"We don't predict people out of the program. We predict where support can keep them in it."*

---

## The problem

Caridad Community Kitchen runs a free 10-week culinary training program for people facing significant employment barriers: transportation gaps, housing instability, childcare responsibilities, and financial stress. Week 3 has historically the highest dropout rate. Staff have limited time and no systematic way to know who needs a check-in before it is too late.

Traditional retention tools either require app downloads (friction), collect excessive personal data (distrust), or surface everyone as a concern (alert fatigue). OwnPath takes a different approach: quiet SMS check-ins, rule-based transparent risk scoring, and AI that assists staff without replacing their judgment, with participant consent controlling everything.

---

## How it works

### Participant side: Nightly SMS check-in

Each participant gets a unique link texted every evening. No app, no login, no account. Clicking it opens a 4-screen conversational flow:

1. **How are you feeling?** A 5-point mood scale with a time-aware greeting. If mood is 4 or 5, barriers are auto-skipped.
2. **What's making things harder?** Multi-select barrier chips (transportation, childcare, housing, overwhelmed, money, not well) plus a free-text area with AI extraction and voice input.
3. **What kind of support would help?** Resources only, reminder, staff contact, peer connection, or no contact. No contact is always the default.
4. **Confirmation.** A warm personalized message, AI-matched local Tucson resources (if requested), and a data receipt showing exactly what was and was not shared.

**Languages:** English, Spanish, French. Every string on every screen is translated.

**Participant autonomy controls:**
- Quick check-in: type one free-form message; AI extracts feeling, barriers, and support preference automatically
- Voice input: speak instead of type on the barriers screen (Web Speech API, language-aware)
- Turn off check-ins: opt-out is persisted and honored on all return visits
- Clear my data: resets the current session immediately
- No contact is always the default; nothing sends without staff approval

### Staff side: Support queue dashboard

Password-protected (`caridad2026`) interface with five tabs:

- **Today's Queue**:
    Participant cards ranked by risk level (HIGH / MEDIUM / LOW). Each card shows completion probability %, mood trend indicator (Declining / Improving), and the top risk factor. Expand any card to see: full mood history timeline, all risk factors, AI explanation and suggested action and draft message, consent boundary enforced in UI, peer match suggestion, outcome tracking (graduated / dropped), and private staff notes. Search by name, filter by barrier type, export to CSV.

- **Insights**:
    Cohort barrier patterns, autonomy pulse (how many participants chose no contact), Week 3 watch, and extreme heat alerts based on the National Weather Service forecast.

    - **AI Weekly Analysis** (generated on demand using tonight's check-in data): Groq reads the evening's full cohort snapshot and produces a headline insight, two or three specific data-grounded signals, and the single highest-leverage staff action for the current week. This is not auto-scheduled; staff trigger it when they want a fresh read.
    - **AI Anomaly Detection** (generated on demand): scans the cohort for non-obvious patterns that standard risk scoring may miss, including barrier spikes, clusters of participants at the same week with similar issues, systemic signals (such as multiple transport issues suggesting a bus route change), and participants whose individual scores look fine but whose combination of signals warrants attention.

- **Autonomy Audit**:
    Opt-in rate, no-contact honored percentage, consent breakdown, Participant Bill of Rights, and data OwnPath refuses to collect.

- **Model Card**
    In-app AI transparency: what the model uses, what it never touches, limitations, and the human-in-loop commitment.

- **Manage Cohort**
    Add real participants (name, week, day, missed and late days, support preference, barriers). Custom participants persist in localStorage with full risk scoring and can be removed at any time.

---

## AI integrations

All LLM calls use **Groq (llama-3.3-70b-versatile)** via a Netlify serverless function with no API key exposed to the client. Every call has an offline fallback so the demo works without a Groq key.

| Feature | Where | What the AI does |
|---|---|---|
| Natural language check-in | Participant, Quick check-in | Extracts feeling rating (1 to 5), barrier categories, and support preference from a single free-text message |
| Barrier extraction | Participant, Barriers screen | Parses free-text description into structured barrier categories with an empathetic paraphrase |
| AI resource matching | Participant, Confirmation screen | Picks the 2 to 3 most relevant real Tucson resources for the participant's specific barriers, with a personalized reason and urgency level. Responds in the participant's chosen language. |
| Personalized confirmation message | Participant, Confirmation screen | Generates a warm, encouraging closing message in English, Spanish, and French |
| Staff explanation | Staff, Participant card | Explains why a participant is flagged in plain English, suggests a concrete action, and optionally drafts a warm outreach message |
| Intervention ranking | Staff, What-If Simulator | Re-ranks intervention options for the specific participant's barriers and week, with estimated impact deltas |
| Cohort weekly analysis | Staff, Insights tab | Reads tonight's check-in snapshot and generates a headline, specific data-grounded signals, and the highest-leverage staff action for the week |
| Cohort anomaly detection | Staff, Insights tab | Detects non-obvious patterns: barrier spikes, at-risk clusters, systemic issues, and participants who may be missed by standard risk scoring |

---

## Risk scoring engine

Fully rule-based (not AI), transparent, and auditable:

| Signal | Points |
|---|---|
| Missed days | 15 pts each (max 40) |
| Late days | 5 pts each (max 15) |
| Transportation barrier | +20 |
| Housing barrier | +25 |
| Childcare barrier | +18 |
| Overwhelmed | +15 |
| Week 3 (highest dropout week) | +15 |
| No check-in today | +5 |
| Extreme heat tomorrow (105F or above) | +8 |
| Combination: transport + week 3 + no check-in | +12 bonus |
| Combination: housing + overwhelmed | +8 bonus |
| Combination: childcare + missed days | +7 bonus |
| Combination: 3 or more barriers at once | +10 bonus |
| Mood trajectory: 3 or more consecutive declines | up to +18 |

Score maps to risk level (LOW / MEDIUM / HIGH) and then to a completion probability percentage.

Mood trajectory is analyzed separately across the participant's full check-in history and integrated into the total score. The trend (Declining, Stable, or Improving) appears as a badge on each participant card.

---

## Tech stack

- **Frontend:** React 18, React Router v6, Vite 6
- **Serverless:** Netlify Functions (Node.js ESM)
- **LLM:** Groq SDK, llama-3.3-70b-versatile
- **Voice input:** Web Speech API (browser-native, no third-party service)
- **Weather:** National Weather Service API (free, no key required)
- **Storage:** localStorage (no backend, prototype only)
- **Fonts:** DM Serif Display, DM Sans, JetBrains Mono
- **Deployed:** Netlify

---

## Local development

```bash
npm install
netlify dev
```

Visit `http://localhost:8888`

To enable Groq AI features locally, create a `.env` file:

```
GROQ_API_KEY=your_key_here
```

Without the key, all AI features fall back to pre-written templates automatically. The full participant flow and staff dashboard are usable without it.

---

## Demo routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/checkin/P001` | Rosa's check-in (transportation barrier, Week 3) |
| `/checkin/P002` | Marcus's check-in (high risk: housing + overwhelmed) |
| `/checkin/P003` | Diana's check-in (medium risk: childcare) |
| `/staff` | Staff dashboard, passcode: `caridad2026` |

The `/checkin/P001` route shows Rosa's check-in to demonstrate the participant perspective. In a real deployment, each participant receives a unique SMS link every evening and clicking it opens this exact flow, personalized to them. No app download or login required.

---

## Design principles

- **No login, no app.** Participants access via a unique token in an SMS link.
- **Default is no contact.** Participants opt in, not out.
- **Consent enforced in UI.** Action buttons are hidden if the participant did not allow that contact type.
- **Nothing sends automatically.** All outreach is manual and requires staff approval.
- **Transparent AI.** Model card visible in-app, risk factors shown as plain English bullet points, no black boxes.
- **Peer learning.** The platform suggests peer matches based on shared barriers and recovery stories; staff confirms before connecting.

---

*Partner: Community Food Bank of Southern Arizona*
*Challenge: Improving Workforce Training Completion for Individuals Facing Barriers to Employment*
*Caridad Community Kitchen · 845 N Main Ave, Tucson, AZ 85705 · (520) 882-5641*
