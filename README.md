# OverturnIt

**Spell check for health insurance denials.**

Paste a denial letter, get back a win-probability score + a drafted appeal letter that cites the federal/state rules the insurer broke. Free. ~60 seconds.

## Why

- ~17% of in-network claims are denied.
- ~75% of internal appeals win.
- <1% of denied patients ever file one.

The asymmetry isn't knowledge — it's paperwork. OverturnIt removes the paperwork barrier.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind v4
- **Anthropic Claude Sonnet 4.6** (with 4.5 fallback) — single call per request
- **Prompt caching** on the federal corpus + state cheat sheet (~90% cost reduction after first call)
- **@react-pdf/renderer** for downloadable appeal letter PDFs
- **Vercel** — Node runtime, stateless, no DB, no auth, no PHI persistence

## Architecture

```
User browser
  ↓
Next.js App Router (Vercel)
  ├── /              landing + 3-step form
  ├── /result        renders ResultCard from sessionStorage
  └── /api/overturn  POST → Anthropic Messages API
                     system = federal corpus + state cheat sheet (cached)
                     output = strict JSON
  ↓
ResultCard.tsx (gauge + letter + deadlines)
  ↓
@react-pdf/renderer → Appeal.pdf
```

## Run locally

```bash
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
npm install
npm run dev
```

Open http://localhost:3000.

Smoke test the API:
```bash
curl -X POST http://localhost:3000/api/overturn \
  -H 'content-type: application/json' \
  -d '{
    "denial_text": "Your claim for MRI is denied as not medically necessary per InterQual.",
    "state": "CA",
    "plan_type": "Employer",
    "service_category": "Medical necessity denied"
  }' | jq .
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import on vercel.com → New Project.
3. Add `ANTHROPIC_API_KEY` env var (Production + Preview).
4. Deploy.

## Disclaimer

OverturnIt is a drafting tool, not legal advice. It does not establish an attorney–client relationship. Consult a licensed professional for your specific situation.
