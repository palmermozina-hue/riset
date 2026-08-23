"""InsForge integration helper — REST client + optional direct Postgres pool.

Digunakan sebagai lapisan tipis di atas REST API InsForge. Postgres pool
disediakan buat query kompleks kalau diperlukan (mis. seed/migration di
runtime, join berat) — tapi default-nya kita lewat REST supaya konsisten.
"""
from __future__ import annotations

import os
from typing import Any, Optional

import httpx


INSFORGE_URL = os.environ.get("INSFORGE_URL", "").rstrip("/")
INSFORGE_API_KEY = os.environ.get("INSFORGE_API_KEY", "")
INSFORGE_PG_URL = os.environ.get("INSFORGE_POSTGRES_URL", "")


def is_configured() -> bool:
    return bool(INSFORGE_URL) and bool(INSFORGE_API_KEY)


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {INSFORGE_API_KEY}",
        "Content-Type": "application/json",
    }


class InsForgeError(RuntimeError):
    pass


async def rest_get(path: str, params: Optional[dict] = None) -> Any:
    """Panggil InsForge REST endpoint (server-side, pakai admin API key)."""
    if not is_configured():
        raise InsForgeError("InsForge belum dikonfigurasi (INSFORGE_URL/INSFORGE_API_KEY kosong)")
    url = f"{INSFORGE_URL}{path if path.startswith('/') else '/' + path}"
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(url, headers=_headers(), params=params or {})
    if r.is_error:
        raise InsForgeError(f"GET {url} → {r.status_code}: {r.text[:200]}")
    try:
        return r.json()
    except ValueError:
        return r.text


async def rest_post(path: str, body: Any) -> Any:
    if not is_configured():
        raise InsForgeError("InsForge belum dikonfigurasi")
    url = f"{INSFORGE_URL}{path if path.startswith('/') else '/' + path}"
    headers = {**_headers(), "Prefer": "return=representation"}
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.post(url, headers=headers, json=body)
    if r.is_error:
        raise InsForgeError(f"POST {url} → {r.status_code}: {r.text[:200]}")
    try:
        return r.json()
    except ValueError:
        return r.text


async def ping() -> dict:
    """Cek konektivitas — return status ringkas untuk /api/insforge/health."""
    if not is_configured():
        return {"configured": False, "ok": False, "error": "env belum di-set"}
    try:
        tables = await rest_get("/api/database/tables")
        return {
            "configured": True,
            "ok": True,
            "url": INSFORGE_URL,
            "tables_count": len(tables) if isinstance(tables, list) else None,
        }
    except InsForgeError as exc:
        return {"configured": True, "ok": False, "error": str(exc)}
