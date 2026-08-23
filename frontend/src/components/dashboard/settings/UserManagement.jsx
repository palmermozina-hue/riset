import { useState } from "react";
import { Search, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";
import { SETTINGS } from "@/constants/testIds";
import { ROLES, TEAM, roleLabel } from "@/data/mockTeam";
import { GoogleIcon } from "@/components/GoogleIcon";
import { InviteMemberDialog } from "./InviteMemberDialog";

const statusStyle = {
  aktif: "bg-emerald-50 text-emerald-700",
  diundang: "bg-orange-50 text-orange-700",
  nonaktif: "bg-stone-100 text-stone-500",
};

export const UserManagement = () => {
  const [members, setMembers] = useState(TEAM);
  const [q, setQ] = useState("");
  const [inviting, setInviting] = useState(false);

  const rows = members.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.email.toLowerCase().includes(q.toLowerCase()),
  );

  const changeRole = (id, role) => {
    setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, role } : m)));
    const target = members.find((m) => m.id === id);
    toast.success(`${target?.name} sekarang jadi ${roleLabel(role)}.`);
  };

  const remove = (member) => {
    if (member.role === "owner") {
      toast.error("Owner nggak bisa dihapus. Pindahkan kepemilikan dulu.");
      return;
    }
    setMembers((ms) => ms.filter((m) => m.id !== member.id));
    toast.info(`${member.name} dikeluarkan dari tim.`);
  };

  const invite = ({ name, email, role }) => {
    const member = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      status: "diundang",
      provider: "email",
      lastActive: "Belum pernah",
    };
    setMembers((ms) => [member, ...ms]);
    setInviting(false);
    toast.success(`Undangan dikirim ke ${email}.`);
  };

  return (
    <div
      className="rounded-3xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      data-testid={SETTINGS.usersPanel}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 p-7 dark:border-stone-800">
        <div className="flex items-start gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-900 text-white">
            <Users size={19} strokeWidth={2.2} />
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
              Tim & akses
            </h3>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              <span data-testid={SETTINGS.usersCount}>{members.length}</span> anggota — atur siapa
              yang boleh approve pesanan.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
          <div className="relative min-w-[200px] flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau email..."
              data-testid={SETTINGS.usersSearchInput}
              className="w-full rounded-full border border-stone-300 py-2.5 pl-11 pr-4 text-sm focus-visible:border-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/25 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
            />
          </div>
          <button
            onClick={() => setInviting(true)}
            data-testid={SETTINGS.inviteOpenButton}
            className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 active:scale-[0.98]"
          >
            <UserPlus size={15} /> Undang
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead>
            <tr className="border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400 dark:border-stone-800">
              <th className="px-7 py-4">Anggota</th>
              <th className="px-4 py-4">Peran</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Terakhir aktif</th>
              <th className="px-7 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr
                key={m.id}
                data-testid={SETTINGS.userRow(m.id)}
                className="border-b border-stone-50 text-sm transition-colors last:border-0 hover:bg-stone-50 dark:border-stone-800/60 dark:hover:bg-stone-800/40"
              >
                <td className="px-7 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-900 text-xs font-bold text-white">
                      {m.name[0].toUpperCase()}
                    </span>
                    <div>
                      <p className="font-semibold text-stone-800 dark:text-stone-100">{m.name}</p>
                      <p className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                        {m.provider === "google" && <GoogleIcon size={11} />}
                        {m.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    disabled={m.role === "owner"}
                    data-testid={SETTINGS.userRoleSelect(m.id)}
                    className="rounded-full border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 disabled:opacity-60 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200"
                  >
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle[m.status]}`}
                    data-testid={SETTINGS.userStatus(m.id)}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-stone-600 dark:text-stone-400">{m.lastActive}</td>
                <td className="px-7 py-4 text-right">
                  <button
                    onClick={() => remove(m)}
                    data-testid={SETTINGS.userRemoveButton(m.id)}
                    aria-label={`Hapus ${m.name}`}
                    className="inline-grid h-9 w-9 place-items-center rounded-xl border border-stone-200 text-stone-500 transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-stone-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-7 py-12 text-center text-sm text-stone-500"
                  data-testid={SETTINGS.usersEmptyState}
                >
                  Nggak ada anggota yang cocok sama “{q}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 border-t border-stone-100 p-7 sm:grid-cols-2 dark:border-stone-800">
        {ROLES.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-950"
          >
            <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">{r.label}</p>
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">{r.desc}</p>
          </div>
        ))}
      </div>

      {inviting && (
        <InviteMemberDialog onClose={() => setInviting(false)} onInvite={invite} />
      )}
    </div>
  );
};
