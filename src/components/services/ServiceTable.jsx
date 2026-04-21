import { useState, useMemo } from 'react';
import Button from '../shared/Button.jsx';

const fmtDA = (n) => (n != null && n !== 0 ? Number(n).toLocaleString() : '—');

export default function ServiceTable({ services, onEdit, onDelete, search }) {
  const [confirm, setConfirm] = useState(null);

  const filtered = useMemo(() =>
    services.filter((s) => {
      const q = (search || '').toLowerCase();
      return (
        (s.service_name_en || '').toLowerCase().includes(q) ||
        (s.service_name_ar || '').toLowerCase().includes(q) ||
        (s.category        || '').toLowerCase().includes(q)
      );
    }),
    [services, search]
  );

  const handleDelete = async (id) => {
    await onDelete(id);
    setConfirm(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {['Service','Category','Unit','Equipment (DA)','Manpower (DA)','Install Labor','Actions']
                .map(h => (
                  <th key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-400 py-14 text-sm">
                  No services found
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.service_id}
                  className="hover:bg-slate-50/60 transition-colors">

                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-800">{s.service_name_en}</div>
                    {s.service_name_ar && (
                      <div className="text-xs text-slate-400 mt-0.5" dir="rtl">
                        {s.service_name_ar}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    {s.category
                      ? <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s.category}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Unit */}
                  <td className="px-4 py-3.5 text-slate-600">
                    {s.unit_en || '—'}
                  </td>

                  {/* Equipment */}
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    {fmtDA(s.equipment_cost)}
                  </td>

                  {/* Manpower */}
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    {fmtDA(s.manpower_cost)}
                  </td>

                  {/* Install Labor */}
                  <td className="px-4 py-3.5 text-slate-600">
                    {fmtDA(s.install_labor_price)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="secondary" onClick={() => onEdit(s)} icon="✏️">
                        Edit
                      </Button>
                      <button
                        onClick={() => setConfirm(s.service_id)}
                        title="Delete"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400
                          hover:bg-red-50 hover:text-red-500 transition-colors">
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm delete */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <p className="text-slate-700 mb-1 font-medium">Supprimer ce service ?</p>
            <p className="text-sm text-slate-400 mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => setConfirm(null)}>Annuler</Button>
              <Button variant="danger"    onClick={() => handleDelete(confirm)}>Supprimer</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
