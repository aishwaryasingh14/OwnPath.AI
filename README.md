# OwnPath.AI

Built by Aishwarya Singh for Hack Arizona 2026.

Participant support tool for Caridad Community Kitchen's free 10-week culinary training program.

**Hack Arizona 2026 — Track 04: Southern Arizona Social Innovation**
Target prizes: Most Innovative Use of AI for the Public Good + Best Preservation of Individual Autonomy

## What it does

OwnPath gives participants a friendly, SMS-style nightly check-in (no app download, no login) and gives staff a respectful action queue with AI-powered explanations — never a surveillance wall.

## Tech stack

- React 18 + Vite
- React Router v6
- Pre-generated Claude-style explanations and message drafts for a stable demo
- NWS Weather API (free, no key required) for Tucson forecast
- Zero backend — runs entirely in the browser

## Setup

```bash
npm install
npm run dev
```

## Demo routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/checkin/P001` | Rosa's check-in (active risk demo) |
| `/checkin/P002` | Marcus's check-in |
| `/staff` | Staff dashboard (passcode: `caridad2026`) |

## Key features

- **Participant check-in**: 4-screen conversational flow (feeling → barriers → support preference → confirmation)
- **Bilingual**: Full English/Spanish toggle
- **Real Tucson resources**: Sun Tran Route 8, 211 Arizona, ADES, Primavera Foundation
- **Risk engine**: Transparent rule-based scoring (attendance + self-reported barriers + weather + program week)
- **What-If Simulator**: Interactive probability calculator for staff
- **Model card**: Visible in the app — what the model sees, what it never touches

## Security note

This is a static hackathon demo with mock participant data. The staff passcode is only a demo gate, not production authentication. Do not put real participant data or API keys in the browser build; a production version should use backend authentication, server-side AI calls, real consent logging, and encrypted storage.


---

*"We don't predict people out of the program. We predict where support can keep them in it."*

Caridad Community Kitchen · 845 N Main Ave, Tucson, AZ 85705 · (520) 882-5641
