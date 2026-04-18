import { useState, useMemo } from 'react';
import Button from '../shared/Button.jsx';

const fmt     = (n) => (n != null ? `$${Number(n).toLocaleString()}` : '—');
const fmtPct  = (n) => (n > 0 ? `${Math.round(n * 100)}%` : '—');
const shortId = (id) => (id ? id.slice(0, 6) + '…' : null);

export default function MaterialTable({ materials, onEdit, onDelete, search }) {
  const [confirm, setConfirm] = useState(null); // material_id to delete

  const filtered = useMemo(() =>
    materials.filter((m) => {
      const q = (search || '').toLowerCase();
      return (
        (m.material_name_en || '').toLowerCase().includes(q) ||
        (m.material_name_ar || '').toLowerCase().includes(q) ||
        (m.material_type    || '').toLowerCase().includes(q) ||
        (m.category_slug    || '').toLowerCase().includes(q)
      );
    }),
    [materials, search]
  );

  const handleDelete = async (id) => {
    await onDelete(id);
    setConfirm(null);
  };

  return (
    <>
      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm min-w-[820px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {['Material','Type','Category','Unit','Formula ID','Price Range','Unit Price','Waste %','Actions']
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
                <td colSpan={9} className="text-center text-slate-400 py-14 text-sm">
                  No materials found
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.material_id}
                  className="hover:bg-slate-50/60 transition-colors">

                  {/* Name */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-800">{m.material_name_en}</div>
                    {m.material_name_ar && (
                      <div className="text-xs text-slate-400 mt-0.5" dir="rtl">
                        {m.material_name_ar}
                      </div>
                    )}
                  </td>

                  {/* Type badge */}
                  <td className="px-4 py-3.5">
                    <span className={[
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      m.material_type === 'PRIMARY'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700',
                    ].join(' ')}>
                      {m.material_type || '—'}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3.5">
                    {m.category_slug
                      ? <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{m.category_slug}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Unit */}
                  <td className="px-4 py-3.5 text-slate-600">
                    {m.unit_symbol || m.unit_en || '—'}
                  </td>

                  {/* Formula ID */}
                  <td className="px-4 py-3.5">
                    {m.formula_id
                      ? (
                        <span className="font-mono text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                          title={m.formula_id}>
                          {shortId(m.formula_id)}
                        </span>
                      )
                      : <span className="text-xs text-red-400 font-medium">⚠ missing</span>}
                  </td>

                  {/* Price range */}
                  <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {fmt(m.min_price_usd)} – {fmt(m.max_price_usd)}
                  </td>

                  {/* Unit price */}
                  <td className="px-4 py-3.5 font-semibold text-slate-800">
                    {fmt(m.unit_price_usd)}
                  </td>

                  {/* Waste */}
                  <td className="px-4 py-3.5">
                    {m.default_waste_factor > 0
                      ? <span className="font-semibold text-amber-600">{fmtPct(m.default_waste_factor)}</span>
                      : <span className="text-slate-300">—</span>}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Button size="sm" variant="secondary" onClick={() => onEdit(m)} icon="✏️">
                        Edit
                      </Button>
                      <button
                        onClick={() => setConfirm(m.material_id)}
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

      {/* Confirm delete dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <p className="text-slate-700 mb-1 font-medium">Supprimer ce matériau ?</p>
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
