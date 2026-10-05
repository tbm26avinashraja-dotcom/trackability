# CH&W Billing Control Tower — POC

A lightweight React + Vite proof of concept for leg-level CH&W billing-cycle exception management.

## What this POC tests

- Can users see which billing cycles need attention before they become conventional overdue receivables?
- Can a milestone timeline make the source of delay obvious?
- Can an action queue distinguish `Act today`, `Watch`, and `Diagnose`?
- Does evidence make each status understandable and auditable?

All client events and dates in this repo are synthetic demonstration scenarios. This is not a live receivables system.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Vercel

Import this GitHub repository into Vercel. The project is a standard Vite React app; Vercel should detect the build command (`npm run build`) and output directory (`dist`) automatically.

## Structure

- `src/data.js` — synthetic cycles, events, benchmark profiles, evidence
- `src/logic.js` — target dates, status, capital state, action logic
- `src/components/ControlTower.jsx` — landing view
- `src/components/CycleDetail.jsx` — milestone timeline
- `src/components/EvidenceModal.jsx` — evidence drill-down
