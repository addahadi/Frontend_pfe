// ─── Material validators ──────────────────────────────────────────────────────

export function validateMaterial(form) {
  const errors = {};

  if (!form.material_name_en?.trim())
    errors.material_name_en = 'Name (EN) est obligatoire';

  if (!form.formula_id?.trim())
    errors.formula_id = 'Formula ID est obligatoire — doit pointer vers une formule MATERIAL';

  if (form.unit_price_usd < 0)
    errors.unit_price_usd = 'Unit Price doit être ≥ 0';

  if (form.min_price_usd > form.unit_price_usd)
    errors.min_price_usd = 'Min Price doit être ≤ Unit Price';

  if (form.max_price_usd !== 0 && form.max_price_usd < form.unit_price_usd)
    errors.max_price_usd = 'Max Price doit être ≥ Unit Price';

  if (form.default_waste_factor < 0 || form.default_waste_factor > 1)
    errors.default_waste_factor = 'Waste Factor doit être entre 0 et 1 (ex: 0.05 = 5%)';

  return errors;
}

// ─── Service validators ───────────────────────────────────────────────────────

export function validateService(form) {
  const errors = {};

  if (!form.service_name_en?.trim())
    errors.service_name_en = 'Name (EN) est obligatoire';

  if ((form.equipment_cost ?? 0) < 0)
    errors.equipment_cost = 'Equipment Cost doit être ≥ 0';

  if ((form.manpower_cost ?? 0) < 0)
    errors.manpower_cost = 'Manpower Cost doit être ≥ 0';

  if ((form.install_labor_price ?? 0) < 0)
    errors.install_labor_price = 'Install Labor doit être ≥ 0';

  return errors;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const hasErrors = (errors) => Object.keys(errors).length > 0;
