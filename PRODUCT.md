# PRODUCT.md — 我的部门登记表 (Department Tracker)

register: product

## Product Purpose

A login-protected internal records app that operations teams use to keep a single, shared, trustworthy register of department records. One editable table plus a detail view plus a login gate. It is intentionally generic so the same template reskins for any operations function by renaming the entity and columns.

It doubles as the hands-on artifact for a 45-minute enterprise AI workshop: each participant forks this template and, by talking to an AI assistant in plain language, takes it from running locally to a cloud database (Neon), adds a login, and deploys to a public URL (Vercel). So the codebase must be clean, conventional, and easy for an AI agent to migrate and extend without surprises.

## Users

Non-technical operations staff, specifically:

- **HR** — candidate / employee register (name, role, stage, interviewer, dates, notes)
- **Finance (财务)** — reimbursement / invoice register (submitter, amount, category, status, date)
- **Legal (法务)** — contract register (counterparty, type, signed date, expiry, status)

They are comfortable in Excel and Notion, not in code. They handle sensitive personal and commercial data, so they are sensitive to "who can see this." In daily use they scan a list, filter it, open a record, and add or edit rows. In the workshop they are also first-time builders who need the interface to look credible and the flow to never strand them.

## Tone & Brand

Institutional, precise, trustworthy. This is a system of record, not a consumer toy. The interface should feel like an authoritative ledger: solid, legible, calm. It should make a finance or legal professional trust it at a glance. Warmth comes from clarity and generous space, not from playful color or rounded friendliness.

## Strategic Principles

- **The data is the product.** The table and the record are the hero. Chrome recedes; content leads.
- **Trust through legibility.** Tabular numbers align, status is unambiguous, nothing is decorative for its own sake.
- **Access is visible.** A logged-out visitor sees nothing sensitive; the protection is obvious, not hidden.
- **Generic by design.** Entity, columns, and labels are easy to rename. No HR-specific or finance-specific assumptions baked into structure.
- **AI-migratable.** Conventional Next.js + Postgres patterns, env-var driven config, no exotic dependencies, so an agent can move it to Neon and deploy to Vercel reliably.

## Anti-References (what this is NOT)

- Not a SaaS landing page. No hero-metric template, no gradient accents, no marketing flourish.
- Not a "fintech-as-a-toy" dashboard with rounded cards and bright pills.
- Not a from-scratch bespoke framework. It uses standard, expected affordances (top bar, data table, side panel / detail, standard form controls).
- Not over-animated. Motion conveys state only.

## Key Constraints

- Stack: Next.js (App Router) + TypeScript + Postgres (Neon in production, works locally too). Tailwind for styling.
- All secrets (DB connection string, auth secret) via environment variables; nothing hardcoded.
- Auth approach (workshop): primary = secret-token-in-URL gate; secondary = email one-time-code via Neon Auth. Code structured so swapping in real auth is a localized change.
- Bilingual-friendly copy: UI ships in Chinese (English technical terms allowed); strings centralized so they are easy to change.
- Responsive: usable on a laptop primarily; table collapses gracefully on narrow widths.
