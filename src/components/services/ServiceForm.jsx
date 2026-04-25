import { useState, useEffect } from 'react';
import Button from '../shared/Button.jsx';
import { validateService, hasErrors } from '../../utils/validators.js';

const EMPTY_FORM = {
  service_name_en    : '',
  service_name_ar    : '',
  category           : '',
  unit_en            : 'm²',
  unit_ar            : 'م²',
  equipment_cost     : 0,
  manpower_cost      : 0,
  install_labor_price: 0,
};

export default function ServiceForm({ initial, onSave, onCancel }) {
  const [form,   setForm]   = useState(initial ? { ...initial } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ? { ...initial } : { ...EMPTY_FORM });
    setErrors({});
  }, [initial]);

  const set = (key) => (e) => {
    const raw = e.target.value;
    const val = ['equipment_cost','manpower_cost','install_labor_price'].includes(key)
                  ? parseFloat(raw) || 0
                  : raw;
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const c = { ...prev }; delete c[key]; return c; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateService(form);
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

      {/* Names */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Name (EN) <span className="text-red-500">*</span>
          </label>
          <input
            className={fieldClass('service_name_en')}
            value={form.service_name_en}
            onChange={set('service_name_en')}
            placeholder="Excavation Works..."
          />
          {errors.service_name_en && <p className="text-xs text-red-500 mt-1">{errors.service_name_en}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name (AR)</label>
          <input
            dir="rtl"
            className={fieldClass('service_name_ar')}
            value={form.service_name_ar}
            onChange={set('service_name_ar')}
            placeholder="أعمال الحفر..."
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
        <input
          className={fieldClass('category')}
          value={form.category}
          onChange={set('category')}
          placeholder="terrassement, beton, carrelage..."
        />
      </div>

      {/* Units */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unit (EN)</label>
          <input
            className={fieldClass('unit_en')}
            value={form.unit_en}
            onChange={set('unit_en')}
            placeholder="m², m³, jour..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Unit (AR)</label>
          <input
            dir="rtl"
            className={fieldClass('unit_ar')}
            value={form.unit_ar}
            onChange={set('unit_ar')}
            placeholder="م², م³, يوم..."
          />
        </div>
      </div>

      {/* Costs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Equipment Cost (DA)</label>
          <input type="number" min="0"
            className={fieldClass('equipment_cost')}
            value={form.equipment_cost}
            onChange={set('equipment_cost')}
          />
          {errors.equipment_cost && <p className="text-xs text-red-500 mt-1">{errors.equipment_cost}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Manpower Cost (DA)</label>
          <input type="number" min="0"
            className={fieldClass('manpower_cost')}
            value={form.manpower_cost}
            onChange={set('manpower_cost')}
          />
          {errors.manpower_cost && <p className="text-xs text-red-500 mt-1">{errors.manpower_cost}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Install Labor (DA)</label>
        <input type="number" min="0"
          className={fieldClass('install_labor_price')}
          value={form.install_labor_price}
          onChange={set('install_labor_price')}
        />
        <p className="text-xs text-slate-400 mt-1">Laisser à 0 si non applicable (—)</p>
        {errors.install_labor_price && <p className="text-xs text-red-500 mt-1">{errors.install_labor_price}</p>}
      </div>

      {/* Global error */}
      {errors._global && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <span>❌</span><span>{errors._global}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={saving} icon="💾">
          {saving ? 'Saving...' : 'Save Service'}
        </Button>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
