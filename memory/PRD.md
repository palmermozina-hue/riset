# TuntasUMKM — PRD (Living Doc)

## Original Problem Statement
Landing page + demo interaktif untuk **TuntasUMKM** — AI Operational Agent buat UMKM Indonesia. Fokus konversi visitor + wow factor untuk juri AI Hackfest 2026. Semua tetap FE mock, belum ada backend real.

## User Choices (locked)
- Brand & design ikut repo (Emerald/Terracotta, Outfit + Plus Jakarta Sans)
- Fokus FE only, backend belum
- Push ke branch `main`
- Efisiensi credit — 1 fitur besar per iterasi

## User Personas
1. **Owner UMKM** — pengelola toko yang butuh dashboard approval + monitoring
2. **Juri AI Hackfest 2026** — nilai kejelasan value prop, demo interaktif, differentiator teknis
3. **Pelanggan / visitor demo** — coba jadi customer via `/demo` publik

## Architecture (FE-only)
- React 19 + CRA/craco, Tailwind, shadcn/ui, framer-motion, lucide-react, sonner
- Routes: `/` (Landing), `/auth` (Login/Register mock), `/dashboard` (Owner), `/demo` (Customer chat + pipeline live)
- Cross-page state: `lib/mockStore.js` — localStorage-backed approval + conversation store
- Scripted agent: `lib/mockAgent.js` — 7-stage pipeline simulator dengan intent detection sederhana
- Copy & mock data di `data/content.js` + `data/mockDashboard.js`
- Backend FastAPI + MongoDB masih template default, belum dipakai

## Implemented
### 2026-06 — Phase 1 (Landing)
- Sticky glass navbar + mobile hamburger
- Hero, Problem, HowItWorks (7-stage), Features (bento), Differentiator, DemoPreview, Segments, Waitlist, Footer
- Auth mock (login/register)
- Owner Dashboard: Overview, ApprovalQueue, Inbox, Catalog, Analytics

### 2026-08 — Phase 2 (Interactive Demo)
- `/demo` — Customer Chat Simulator dengan split view: chat + observable pipeline
- Scripted agent handles: `tanya_stok`, `tanya_produk`, `mau_pesan`, `keluhan`, `lainnya`
- 7-stage pipeline animate progresif (220ms per stage) dengan status: ok/wait/skip/warn/err/idle
- Approval otomatis push ke `mockStore` → langsung muncul di `/dashboard` (subscribed via listener)
- Quick reply chips (stok, harga, pesan, keluhan) untuk juri cepet coba
- Reset button + link balik ke beranda + shortcut ke dashboard owner
- Landing CTA "Coba Demo" & nav CTA sekarang route ke `/demo` (bukan scroll ke mockup)

## Backlog
### P0
- (none — Phase 2 selesai)
### P1
- Sinkronisasi realtime dua arah: owner approve → agent chat lanjut kirim konfirmasi ke pelanggan
- Trace viewer di dashboard (klik conversation → lihat 7-stage detail)
- Backend real: FastAPI + MongoDB, connect LLM (Claude Sonnet / GPT via Emergent LLM Key)
### P2
- Testimonial / social proof section
- FAQ accordion
- Dark mode & i18n (EN)
- Deploy prep (Cloud VPS AI Hosting IDwebhost)

## Next Tasks
1. **Two-way sync**: owner approve → customer chat dapat notif "pesananmu sudah dikonfirmasi"
2. **Trace viewer** di inbox dashboard — lihat 7-stage per percakapan
3. **Backend integration**: MongoDB + Claude Sonnet buat NLU/response asli
4. **Analytics real**: hitung metrik dari data yang beneran ada di store
