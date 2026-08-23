# TuntasUMKM — PRD (Living Doc)

## Original Problem Statement
Landing + demo interaktif + AI agent asli untuk **TuntasUMKM** — AI Operational Agent buat UMKM Indonesia. Buat AI Hackfest 2026.

## User Choices (locked)
- Brand/design ikut repo (Emerald/Terracotta, Outfit + Plus Jakarta Sans)
- Push ke `main`
- LLM: `stealth/ox-alpha` via OpenRouter (user provided API key)
- Persistensi demo tetap localStorage (bukan MongoDB) — cukup buat hackathon
- Efisiensi credit

## Architecture
- **Frontend**: React 19 (CRA + craco) + Tailwind + shadcn/ui, routes: `/`, `/auth`, `/dashboard`, `/demo`
- **Backend**: FastAPI, endpoint `POST /api/agent/chat` → panggil OpenRouter `stealth/ox-alpha`
- **Cross-page state**: `lib/mockStore.js` (localStorage) — approvals, conversation, owner events, live session
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
- Katalog produk di backend (mirror frontend); Tool calls deterministik

### 2026-08 — Phase 4 (Owner Reply Loop + Trace Viewer + Landing Polish)
- **Owner Reply Loop**: owner klik Setujui/Tolak di `/dashboard` → `pushOwnerEvent()`
  antre di localStorage → `/demo` konsumsi lewat `consumeOwnerEvents()` dan
  menampilkan konfirmasi/penolakan otomatis di chat pelanggan. Percakapan `/demo`
  sekarang persisten (`saveConversation`), jadi loop-nya jalan baik di tab yang
  sama maupun dua tab paralel (via `storage` event).
- **Trace Viewer** (`components/dashboard/TraceViewer.jsx`): panel jejak 7-tahap
  yang bisa diklik per tahap — penjelasan tahap, status, latensi per stage,
  total latensi, dan payload JSON mentah. Dipakai di Inbox dashboard.
- **Live session di Inbox**: sesi `/demo` yang sedang berjalan muncul paling atas
  di daftar percakapan (`id: "live"`) lengkap dengan trace aslinya dari backend.
- **Landing polish**: section Testimoni (3 owner UMKM + metrik) dan FAQ (6
  pertanyaan, accordion), plus **dark mode** class-based dengan tombol mengambang
  (`lib/theme.js` + `components/ThemeToggle.jsx`, override utility di `index.css`).
- **Ketahanan LLM**: `call_llm` retry 3× dengan backoff pada 429/5xx, lalu jatuh ke
  `heuristic_parse()` (rule-based intent/SKU/qty) — demo nggak mati kalau
  `stealth/ox-alpha` lagi rate-limited upstream.

## Backlog
### P0
- (none)
### P1
- Persistensi conversation di MongoDB (bukan localStorage)
- Trace viewer buka detail tool-call payload asli (request/response OpenRouter)
### P2
- Streaming response (SSE) biar reply muncul token-per-token
- Multi-turn context yang lebih dalam (>8 history)
- Dark mode juga di `/dashboard` dan `/demo`, i18n EN

## Next Tasks
1. Dark mode untuk dashboard + demo
2. Streaming LLM response (SSE)
3. Persistensi conversation ke MongoDB
