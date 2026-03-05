# The Next Big Thing — Onboarding Wizard

A 5-step onboarding wizard demo built with React 19, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite | Build tool |
| React Router v7 | Client-side routing (each step is a route) |
| Tailwind CSS v4 | Utility-first styling |
| React Hook Form + Zod | Form state management + schema validation |
| Framer Motion | Animations and page transitions |

## Wizard Flow

```
/welcome  →  /profile  →  /preferences  →  /identity  →  /finish
```

| Route | Step | Description |
|---|---|---|
| `/welcome` | — | Animated brand intro with "Get Started" CTA |
| `/profile` | 1 | First name, last name, email with Zod validation |
| `/preferences` | 2 | Role selector + interests multi-select |
| `/identity` | 3 | Avatar picker + async screen name availability check |
| `/finish` | — | Celebration screen + full submission summary |

## Architecture

### Service / Mock API Layer

The app uses a layered architecture that mirrors how it would interact with a real backend:

```
Component
  → wizardService.ts      (business logic layer)
    → mockController.ts   (simulates HTTP endpoints with fake latency)
      → storageService.ts (localStorage read/write)
```

**To connect a real backend:** replace the `mockController` calls in `wizardService.ts` with `fetch`/`axios` calls pointing at your API. Component and context code remains unchanged.

### State Management

`WizardContext` holds all form data, current step, and completed steps. It initialises from localStorage via `wizardService.loadDraft()` on mount and auto-saves on every step submission.

### Validation

Each step uses a **Zod schema** (`src/schemas/`) paired with **React Hook Form**. The `isValid` state from RHF is reported to `WizardContext` via `setStepValid`, which drives the enabled/disabled state of the navigation buttons.

### Screen Name Validation (Identity Step)

The screen name field has two validation layers:

1. **Character filtering** — input silently strips non-alphanumeric characters on change
2. **Async availability check** — 500ms debounce fires `wizardService.checkScreenName()`, which simulates a network call (600–1000ms delay). Names without a number are "unavailable" and trigger suggestions. Adding a number makes the name "available".

## Project Structure

```
src/
├── api/mock/          # Mock HTTP controller + delay helper
├── services/          # Business logic (wizardService, storageService)
├── context/           # WizardContext — global state
├── schemas/           # Zod validation schemas per step
├── components/
│   ├── layout/        # WizardLayout, StepIndicator, NavButtons
│   ├── ui/            # Reusable primitives: Button, Input, Card
│   └── steps/         # One component per wizard step
├── assets/avatars/    # Placeholder SVG avatars
└── types/wizard.ts    # Shared TypeScript types
```
