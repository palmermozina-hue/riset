# TuntasUMKM — PRD (Living Doc)

## Original Problem Statement
Landing + demo interaktif + AI agent asli untuk **TuntasUMKM** — AI Operational Agent buat UMKM Indonesia. Buat AI Hackfest 2026.

## User Choices (locked)
- Brand/design ikut repo (Emerald/Terracotta, Outfit + Plus Jakarta Sans)
- Push ke `main`
- LLM: `stealth/ox-alpha` via OpenRouter (user provided API key)
- Efisiensi credit

## Architecture
- **Frontend**: React 19 + Tailwind + shadcn/ui, routes: `/`, `/auth`, `/dashboard`, `/demo`
- **Backend**: FastAPI, endpoint `POST /api/agent/chat` → panggil OpenRouter `stealth/ox-alpha`
- **Cross-page state**: `lib/mockStore.js` (localStorage) untuk approval antara `/demo` ↔ `/dashboard`
- **7-stage pipeline**: LLM handle Understanding (stage 2), sisanya deterministik di backend (Grounding, Tool Call, Approval, Response, Analytics) berdasarkan katalog produk hardcoded

## Implemented
### 2026-06 — Phase 1 (Landing)
- Landing lengkap (Hero, Problem, HowItWorks, Features, Differentiator, DemoPreview, Segments, Waitlist, Footer)
- Auth mock, Owner Dashboard (Overview, ApprovalQueue, Inbox, Catalog, Analytics)

### 2026-08 — Phase 2 (Interactive Demo)
- `/demo` — split chat + observable pipeline, mock agent scripted
- Approval otomatis sync ke `/dashboard`

### 2026-08 — Phase 3 (Real LLM Integration)
- Backend endpoint `/api/agent/chat` connect ke **OpenRouter stealth/ox-alpha**
- LLM output structured JSON: `{ intent, sku, qty, reply, confidence }`
- Katalog produk di backend (mirror frontend); Tool calls (cek_stok, buat_draft_pesanan) tetap deterministik
- Frontend `/demo` sekarang call backend (async), fallback error via toast
- Pipeline label update: "Powered by stealth/ox-alpha"

## Backlog
### P0
- (none)
### P1
- Owner approve → push konfirmasi otomatis ke chat pelanggan
- Trace viewer di Inbox dashboard (klik conversation → lihat 7-stage detail dari MongoDB)
- Persistensi conversation di MongoDB (bukan localStorage)
### P2
- Streaming response (SSE) biar reply muncul token-per-token
- Multi-turn context yang lebih dalam (>8 history)
- Testimonial, FAQ, dark mode, i18n EN

## Next Tasks
1. Owner Reply Loop
2. Trace Viewer di Inbox
3. Streaming LLM response
