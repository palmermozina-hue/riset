# TuntasUMKM — PRD (Living Doc)

## Original Problem Statement
Landing + demo interaktif + AI agent asli untuk **TuntasUMKM** — AI Operational Agent buat UMKM Indonesia. Buat AI Hackfest 2026.

## User Choices (locked)
- Brand/design ikut repo (Emerald/Terracotta, Outfit + Plus Jakarta Sans)
- Push ke `main`
- LLM: `stealth/ox-alpha` via OpenRouter (user provided API key)
- **Persistensi backend: MongoDB** (upgrade dari localStorage sejak Phase 6)
- Efisiensi credit

## Architecture
- **Frontend**: React 19 (CRA + craco) + Tailwind + shadcn/ui, routes: `/`, `/auth`, `/dashboard`, `/demo`
- **Backend**: FastAPI, endpoint `POST /api/agent/chat` → panggil OpenRouter `stealth/ox-alpha`
- **Source of truth**: MongoDB (`conversations`, `workflow_traces`, `approvals`, `owner_events`, `live_sessions`)
- **Frontend store**: `lib/mockStore.js` — localStorage sebagai cache + write-through ke API + polling (approvals 3s, owner_events 2.5s)
- **7-stage pipeline**: LLM handle Understanding (stage 2), sisanya deterministik di backend berdasarkan katalog produk hardcoded

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
- Owner Reply Loop via localStorage cross-tab
- Trace Viewer (klikable per stage) di Inbox dashboard
- Live session di Inbox
- Landing polish (Testimoni, FAQ, dark mode)
- Ketahanan LLM: retry 3× + heuristic fallback

### 2026-08 — Phase 5 (Dark Mode Polish + i18n ID/EN)
- Dark mode coverage penuh (Landing, Dashboard, Demo)
- i18n ID/EN context-based

### 2026-08 — Phase 6 (MongoDB Persistence + Trace Payload) ✅ BARU
**Backend jadi source of truth — bukan lagi localStorage.**
- **New collections**: `conversations`, `workflow_traces`, `approvals`, `owner_events`, `live_sessions`
- **`/agent/chat` sekarang menyimpan**:
  - Trace lengkap ke `workflow_traces` dengan `llm_payload` (request+response OpenRouter mentah, termasuk metadata retry/fallback) — memenuhi P1-B
  - Approval otomatis persist ke `approvals` collection dengan `session_id` (bukan cuma dikirim balik ke frontend)
  - `trace_id` di-return biar frontend bisa fetch payload lengkap
- **New endpoints**:
  - `GET /agent/conversations/{session_id}` · `PUT /agent/conversations/{session_id}` · `POST /agent/conversations/{session_id}/reset`
  - `GET /agent/traces/{trace_id}` · `GET /agent/traces?session_id=&limit=`
  - `GET /agent/approvals?status=` · `POST /agent/approvals/{id}/decide`
  - `GET /agent/owner-events?session_id=&consume=true` (owner reply loop)
  - `GET /agent/live-session` · `PUT /agent/live-session`
- **Auto-seed 3 approvals** saat fresh install (mirror `mockDashboard.APPROVALS`)
- **Frontend `mockStore.js`** — API-backed write-through:
  - Session ID di-generate & persist di localStorage (`getSessionId()`)
  - Approvals di-hydrate dari `/agent/approvals`, di-poll setiap 3 dtk
  - Conversation write-through ke `PUT /agent/conversations/{sid}`
  - `pushOwnerEvent` → `POST /agent/approvals/{id}/decide` (bukan lagi localStorage antrean)
  - Polling `/agent/owner-events` per 2.5 dtk → drain di CustomerDemo
  - Interface publik tetap sama → konsumen (CustomerDemo, OwnerDashboard, Inbox) tidak perlu diubah

## Backlog
### P0
- (none)
### P1
- (none — P1-A & P1-B done di Phase 6)
### P2
- Streaming response (SSE) biar reply muncul token-per-token
- Multi-turn context yang lebih dalam (>8 history)
- WebSocket menggantikan polling supaya push instan (saat ini 2.5 dtk cukup)
- Trace Viewer di Inbox tampilkan `llm_payload` mentah (endpoint sudah ready, tinggal wire UI)

## Next Tasks
1. Wire Trace Viewer UI ke `GET /agent/traces/{trace_id}` — tampilkan OpenRouter request/response mentah per stage Understanding
2. Streaming LLM response (SSE) biar reply muncul token-per-token
3. WebSocket untuk owner_events push instant (gantiin polling 2.5 dtk)
