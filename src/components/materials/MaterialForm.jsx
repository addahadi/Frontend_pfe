import { useState, useEffect } from 'react';
import Button from '../shared/Button.jsx';
import { validateMaterial, hasErrors } from '../../utils/validators.js';

const EMPTY_FORM = {
  material_name_en     : '',
  material_name_ar     : '',
  category_slug        : '',
  unit_id              : '',
  formula_id           : '',
  material_type        : 'PRIMARY',
  min_price_usd        : 0,
  max_price_usd        : 0,
  unit_price_usd       : 0,
  default_waste_factor : 0,
};

// unit options — fetched from DB or hardcoded fallback
const UNIT_OPTIONS = [
  { value: '',  label: '— Select unit —' },
  { value: 'kg-id',  label: 'Kilogram (kg)' },
  { value: 't-id',   label: 'Tonne (t)' },
  { value: 'm2-id',  label: 'Mètre carré (m²)' },
  { value: 'm3-id',  label: 'Mètre cube (m³)' },
  { value: 'm-id',   label: 'Mètre (m)' },
  { value: 'u-id',   label: 'Unité' },
  { value: 'l-id',   label: 'Litre (L)' },
];

export default function MaterialForm({ initial, onSave, onCancel }) {
  const [form,   setForm]   = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset when initial changes (edit → different row)
  useEffect(() => {
    setForm(initial ? { ...initial } : { ...EMPTY_FORM });
    setErrors({});
  }, [initial]);

  const set = (key) => (e) => {
    const raw = e.target.value;
    const val = ['min_price_usd','max_price_usd','unit_price_usd','default_waste_factor']
                  .includes(key)
                  ? parseFloat(raw) || 0
                  : raw;
    setForm(prev => ({ ...prev, [key]: val }));
    // Clear error on change
    if (errors[key]) setErrors(prev => { const c = { ...prev }; delete c[key]; return c; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateMaterial(form);
    if (hasErrors(errs)) { setErrors(errs); return; }
    try {
      setSaving(true);
      await onSave(form);
    } catch (err) {
      setErrors({ _global: err.message });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (key) =>
    `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all
     focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
     ${errors[key] ? 'border-red-400 bg-red-50' : 'border-slate-200'}`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

      {/* Row 1 — Names */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name (EN) <span className="text-red-500">*</span>
          </label>
          <input
            className={fieldClass('material_name_en')}
            value={form.material_name_en}
            onChange={set('material_name_en')}
            placeholder="Portland Cement..."
          />
          {errors.material_name_en && <p className="text-xs text-red-500 mt-1">{errors.material_name_en}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name (AR)</label>
          <input
            dir="rtl"
            className={fieldClass('material_name_ar')}
            value={form.material_name_ar}
            onChange={set('material_name_ar')}
            placeholder="اسم المادة..."
          />
        </div>
      </div>

      {/* Row 2 — Category + Unit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category Slug</label>
          <input
            className={fieldClass('category_slug')}
            value={form.category_slug}
            onChange={set('category_slug')}
            placeholder="semelle-isolee..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
          <select
            className={fieldClass('unit_id')}
            value={form.unit_id}
            onChange={set('unit_id')}
          >
            {UNIT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3 — Formula ID */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Formula ID <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-400 mb-1">
          Must point to a MATERIAL formula — its expression computes this material's quantity
        </p>
        <input
          className={fieldClass('formula_id')}
          value={form.formula_id}
          onChange={set('formula_id')}
          placeholder="e.g. a0000000-0000-0000-0000-000000000003"
          spellCheck={false}
        />
        {errors.formula_id && <p className="text-xs text-red-500 mt-1">{errors.formula_id}</p>}
      </div>

      {/* Row 4 — Material Type toggle */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Material Type</label>
        <p className="text-xs text-slate-400 mb-2">
          PRIMARY = main material · ACCESSORY = fittings / extras
        </p>
        <div className="grid grid-cols-2 gap-2">
          {['PRIMARY', 'ACCESSORY'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, material_type: t }))}
              className={[
                'py-2 rounded-lg text-sm font-semibold border transition-all',
                form.material_type === t
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Row 5 — Prices */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Min Price ($)</label>
          <input type="number" min="0" step="0.01"
            className={fieldClass('min_price_usd')}
            value={form.min_price_usd}
            onChange={set('min_price_usd')}
          />
          {errors.min_price_usd && <p className="text-xs text-red-500 mt-1">{errors.min_price_usd}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Max Price ($)</label>
          <input type="number" min="0" step="0.01"
            className={fieldClass('max_price_usd')}
            value={form.max_price_usd}
            onChange={set('max_price_usd')}
          />
          {errors.max_price_usd && <p className="text-xs text-red-500 mt-1">{errors.max_price_usd}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
          <input type="number" min="0" step="0.01"
            className={fieldClass('unit_price_usd')}
            value={form.unit_price_usd}
            onChange={set('unit_price_usd')}
          />
          {errors.unit_price_usd && <p className="text-xs text-red-500 mt-1">{errors.unit_price_usd}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Waste Factor</label>
          <input type="number" min="0" max="1" step="0.01"
            className={fieldClass('default_waste_factor')}
            value={form.default_waste_factor}
            onChange={set('default_waste_factor')}
            placeholder="0.05"
          />
          <p className="text-xs text-slate-400 mt-1">0.05 = 5%</p>
          {errors.default_waste_factor && <p className="text-xs text-red-500 mt-1">{errors.default_waste_factor}</p>}
        </div>
      </div>

      {/* Formula required alert */}
      {!form.formula_id.trim() && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm">
          <span>⚠️</span>
          <span>A Formula ID is required — every material must be linked to its MATERIAL formula.</span>
        </div>
      )}

      {/* Global error */}
      {errors._global && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <span>❌</span>
          <span>{errors._global}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={saving} icon="💾">
          {saving ? 'Saving...' : 'Save Material'}
        </Button>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
