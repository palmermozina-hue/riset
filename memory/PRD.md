# TuntasUMKM — PRD (Living Doc)

## Original Problem Statement
Landing page marketing untuk **TuntasUMKM** — AI Operational Agent buat UMKM Indonesia. Phase 1: landing page statis, fokus konversi visitor jadi lead/demo request untuk presentasi AI Hackfest 2026. Belum konek backend; semua tombol mock.

## User Choices (locked)
- Brand: bebas ideasi (agent yang tentuin warna/logo)
- Tone copy: kasual & hangat bahasa Indonesia ("kamu", "nggak")
- Waitlist form: mock saja (console.log + toast)
- Aset visual: kombinasi foto stok + mockup UI dibangun pakai kode
- Next phase: fokus landing page dulu

## User Personas
1. **Owner UMKM** (F&B, fashion, elektronik) — capek balesin chat repetitif, cari solusi praktis.
2. **Juri AI Hackfest 2026** — nilai kejelasan value prop, kedalaman teknis (7-stage pipeline), polish.
3. **Early adopter / pilot user** — mau daftar waitlist.

## Architecture
- Frontend: React 19 (CRA + craco), Tailwind, shadcn/ui, framer-motion, lucide-react, sonner
- Single route `/` → `src/pages/Landing.jsx`, section components di `src/components/landing/`
- Copy & mock data terpusat di `src/data/content.js`
- Backend FastAPI + MongoDB: masih template default, belum dipakai

## Design System
- Archetype: Organic & Earthy (trust + warmth)
- Primary Deep Emerald `#064E3B`, Accent Terracotta `#EA580C`, Background Stone-50 `#FAFAF9`
- Font: Outfit (heading) + Plus Jakarta Sans (body)
- Pill buttons, rounded-3xl cards, dotted-grid texture, glassmorphism nav

## Implemented (2026-06)
- Sticky glass navbar + mobile hamburger
- Hero: headline "Agen AI yang nggak cuma jawab, tapi bertindak", dual CTA, 3 stat strip, code-built chat mockup dengan approval card
- Problem: stat 64% + 3 pain point
- How It Works: 7-stage pipeline interaktif (klik untuk highlight), horizontal scroll
- Features: bento grid 7 kartu asimetris
- Differentiator: tabel Chatbot Biasa vs TuntasUMKM
- Demo Preview: mockup chat + dashboard operasional (KPI, bar chart produk, antrean approval) — semua HTML/Tailwind
- Segments: 3 kartu use case dengan foto + gradient overlay
- Waitlist: form MOCK (validasi email, toast, success state)
- Footer: link PRD, GitHub repo, hackathon
- Testing: iteration_1 — 100% frontend pass (15 checks, 0 issue)

## Backlog
### P0
- (none — Phase 1 selesai)
### P1
- Chat Simulator interaktif (user bisa ngetik, agent balas via LLM)
- Approval Queue Dashboard (approve/reject aksi agent)
- Waitlist beneran simpan email ke MongoDB + notifikasi email
### P2
- Testimonial / social proof section
- FAQ accordion
- Dark mode & i18n (EN)
- Deploy prep + custom domain

## Next Tasks
1. Review copy & visual sama user, revisi kalau perlu
2. Pilih Phase 2: Chat Simulator atau Approval Queue
3. Sambungkan CTA "Coba Demo" ke produk Phase 2
