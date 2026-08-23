import { useState } from "react";
import { Search } from "lucide-react";
import { PRODUCTS, rupiah } from "@/data/mockDashboard";
import { DASHBOARD } from "@/constants/testIds";

const statusStyle = {
  aktif: "bg-emerald-50 text-emerald-700",
  "stok tipis": "bg-orange-50 text-orange-700",
  habis: "bg-red-50 text-red-600",
};

export const Catalog = () => {
  const [q, setQ] = useState("");
  const rows = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.sku.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="rounded-3xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 p-7">
        <div>
          <h3 className="font-display text-xl font-semibold text-stone-900">
            Katalog yang dipakai agent
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Sumber jawaban RAG + validasi stok real-time.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk atau SKU..."
            data-testid={DASHBOARD.productSearch}
            className="w-full rounded-full border border-stone-300 py-2.5 pl-11 pr-4 text-sm focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400">
              <th className="px-7 py-4">Produk</th>
              <th className="px-4 py-4">SKU</th>
              <th className="px-4 py-4">Harga</th>
              <th className="px-4 py-4">Stok</th>
              <th className="px-4 py-4">Terjual 7d</th>
              <th className="px-7 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.sku}
                data-testid={DASHBOARD.productRow(p.sku)}
                className="border-b border-stone-50 text-sm transition-colors last:border-0 hover:bg-stone-50"
              >
                <td className="px-7 py-4 font-semibold text-stone-800">{p.name}</td>
                <td className="px-4 py-4 font-mono text-xs text-stone-500">{p.sku}</td>
                <td className="px-4 py-4 text-stone-700">{rupiah(p.price)}</td>
                <td className="px-4 py-4 font-bold text-stone-900">{p.stock}</td>
                <td className="px-4 py-4 text-stone-600">{p.sold}</td>
                <td className="px-7 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[p.status]}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-7 py-12 text-center text-sm text-stone-500" data-testid="catalog-empty-state">
                  Nggak ada produk yang cocok sama pencarian “{q}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
