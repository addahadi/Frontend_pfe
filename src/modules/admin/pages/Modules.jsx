import React, { useState } from 'react';
import { 
  Home, Hammer, BrickWall, Square, Columns, Paintbrush, 
  DoorClosed, ChevronDown, ChevronRight, X, Trash2, Plus, 
  Folder, Palette, Pickaxe, Building, PenTool, Minus, Circle, 
  Wrench, Droplet, Zap, Type, Hash, EyeOff, Eye 
} from 'lucide-react';

// --- MAIN COMPONENT ---
export default function Modules() {
  // Simple state to toggle between the two views shown in your templates
  const [activeNode] = useState('isolated-footing'); // 'grand-travaux' or 'isolated-footing'

  // Activation state
  const [isActive, setIsActive] = useState(true);

  // Dynamic state for Fields
  const [fields, setFields] = useState([
    { id: 1, name: 'Length', type: 'NUMBER', unit: 'm', required: true },
    { id: 2, name: 'Width', type: 'NUMBER', unit: 'm', required: true },
    { id: 3, name: 'Thickness', type: 'NUMBER', unit: 'm', required: true }
  ]);

  // Dynamic state for Formulas
  const [formulas, setFormulas] = useState([
    { id: 1, label: 'Concrete Volume', expression: 'L * W * H', unit: 'm³' },
    { id: 2, label: 'Surface Area', expression: 'L * W', unit: 'm²' }
  ]);

  // Handlers for Fields
  const handleAddField = () => {
    const newField = { id: Date.now(), name: 'New Field', type: 'NUMBER', unit: '', required: false };
    setFields([...fields, newField]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  // Handlers for Formulas
  const handleAddFormula = () => {
    const newFormula = { id: Date.now(), label: 'New Formula', expression: '', unit: '' };
    setFormulas([...formulas, newFormula]);
  };

  const updateFormula = (id, key, value) => {
    setFormulas(formulas.map(formula => formula.id === id ? { ...formula, [key]: value } : formula));
  };

  const removeFormula = (id) => {
    setFormulas(formulas.filter(formula => formula.id !== id));
  };

  return (
    <div className="flex h-full">      
    
      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 bg-slate-50/50 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Home className="w-4 h-4" />
            <span className="text-blue-600 font-medium">Grand Travaux</span>
            {activeNode === 'isolated-footing' && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="flex items-center gap-1 text-slate-500"><BrickWall className="w-3.5 h-3.5" /> Foundations</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="flex items-center gap-1 text-blue-600 font-medium">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm"></div> Isolated Footing
                </span>
              </>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              {activeNode === 'grand-travaux' ? (
                 <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm"><Home className="w-8 h-8 text-slate-700" /></div>
              ) : (
                 <div className={`p-2 bg-white border ${isActive ? 'border-blue-200' : 'border-slate-200'} rounded-lg shadow-sm transition-colors`}>
                   <div className={`w-8 h-8 rounded transition-colors ${isActive ? 'bg-blue-600' : 'bg-slate-400'}`}></div>
                 </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2 transition-colors">
                  {activeNode === 'grand-travaux' ? 'Grand Travaux' : 'Isolated Footing'}
                </h1>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                    {activeNode === 'grand-travaux' ? 'BRANCH' : 'LEAF'}
                  </span>
                  
                  {/* Dynamic Active/Inactive Badge */}
                  {isActive ? (
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded transition-colors">Active</span>
                  ) : (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded transition-colors">Inactive</span>
                  )}
                  
                  <span className="text-slate-400 font-medium ml-1">
                    {activeNode === 'grand-travaux' ? '4 descendants' : `${fields.length} fields • ${formulas.length} formulas`}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Dynamic Toggle Button */}
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 font-medium text-sm px-4 py-2 rounded-lg transition-colors border ${
                  isActive 
                    ? 'text-slate-600 border-slate-200 hover:bg-slate-50' 
                    : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 bg-emerald-50/30'
                }`}
              >
                {isActive ? (
                  <><EyeOff className="w-4 h-4" /> Deactivate</>
                ) : (
                  <><Eye className="w-4 h-4" /> Activate</>
                )}
              </button>
            </div>
          </div>

          <div className={!isActive ? 'opacity-60 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}>
            {/* --- COMMON CARD: CATEGORY METADATA --- */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
              <div className="flex items-center gap-2 bg-slate-50/50 px-5 py-3 border-b border-slate-100">
                <Folder className="w-4 h-4 text-blue-500" />
                <h3 className="font-semibold text-slate-700 text-sm">Category Metadata</h3>
              </div>
              <div className="p-5 flex gap-8">
                <div className="flex-1 max-w-sm">
                  <label className="block text-sm text-slate-500 mb-1.5">Name</label>
                  <input 
                    type="text" 
                    value={activeNode === 'grand-travaux' ? 'Grand Travaux' : 'Isolated Footing'}
                    readOnly
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-slate-500 mb-1.5">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { i: Folder }, { i: Home, active: activeNode === 'grand-travaux' }, { i: Palette }, { i: DoorClosed }, 
                      { i: Hammer }, { i: Pickaxe }, { i: Square, bg: true, active: activeNode === 'isolated-footing' }, 
                      { i: Square, fill: true }, { i: BrickWall }, { i: Building }, { i: Square }, { i: PenTool }, 
                      { i: Minus }, { i: Square }, { i: Circle }, { i: Wrench }, { i: Droplet }, { i: Zap }, 
                      { i: Square, dash: true }, { i: Minus, sm: true }
                    ].map((iconData, idx) => {
                      const Icon = iconData.i;
                      return (
                        <button key={idx} className={`w-8 h-8 flex items-center justify-center rounded-md border ${iconData.active ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'} transition-colors`}>
                          {iconData.bg ? <div className={`w-4 h-4 rounded-sm ${iconData.active ? 'bg-blue-600' : 'bg-slate-800'}`}></div> : 
                           iconData.fill ? <div className="w-4 h-4 bg-slate-800 rounded-sm"></div> :
                           <Icon className="w-4 h-4 text-slate-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* --- BRANCH VIEW: SUB-CATEGORIES --- */}
            {activeNode === 'grand-travaux' && (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                <div className="flex items-center gap-2 bg-slate-50/50 px-5 py-3 border-b border-slate-100">
                  <Folder className="w-4 h-4 text-blue-500" />
                  <h3 className="font-semibold text-slate-700 text-sm">Sub-categories</h3>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { name: 'Excavation', icon: Hammer, type: 'LEAF', color: 'text-amber-700' },
                    { name: 'Foundations', icon: BrickWall, type: '1 children', color: 'text-red-800' },
                    { name: 'Columns', icon: Columns, type: 'LEAF', color: 'text-slate-500' }
                  ].map((sub, i) => (
                    <div key={i} className="flex items-center justify-between border border-slate-200 rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <sub.icon className={`w-5 h-5 ${sub.color}`} />
                        <span className="text-sm font-medium text-slate-700">{sub.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-blue-50 text-blue-500 font-semibold px-2 py-0.5 rounded">{sub.type}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                  
                  <button className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50/30 rounded-lg px-4 py-2.5 mt-2 hover:bg-blue-50 transition-colors">
                    <Plus className="w-4 h-4" /> Add Sub-category under "Grand Travaux"
                  </button>
                </div>
              </div>
            )}

            {/* --- LEAF VIEW: FIELDS & FORMULAS --- */}
            {activeNode === 'isolated-footing' && (
              <>
                {/* Field Definitions */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-50/50 px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      <h3 className="font-semibold text-slate-700 text-sm">Field Definitions</h3>
                    </div>
                    <span className="text-xs text-slate-400">{fields.length} input fields</span>
                  </div>
                  <div className="p-5 space-y-3">
                    {fields.map((field) => (
                      <div key={field.id} className="flex items-center gap-3 border border-slate-100 bg-slate-50/30 p-2 rounded-lg">
                        <input 
                          type="text" 
                          value={field.name} 
                          onChange={(e) => updateField(field.id, 'name', e.target.value)}
                          className="flex-1 bg-transparent border-b border-slate-200 px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                          placeholder="Field Name"
                        />
                        
                        <div className="relative w-32">
                          <select 
                            value={field.type}
                            onChange={(e) => updateField(field.id, 'type', e.target.value)}
                            className="w-full appearance-none bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:border-blue-500"
                          >
                            <option>NUMBER</option>
                            <option>TEXT</option>
                            <option>BOOLEAN</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <input 
                          type="text" 
                          value={field.unit} 
                          onChange={(e) => updateField(field.id, 'unit', e.target.value)}
                          className="w-16 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 text-center focus:outline-none focus:border-blue-500" 
                          placeholder="Unit"
                        />
                        
                        <label className="flex items-center gap-1.5 text-sm text-slate-600 bg-white border border-slate-200 px-2 py-1.5 rounded-md cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={field.required} 
                            onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                          />
                          <span className="text-xs">req</span>
                        </label>

                        <button 
                          onClick={() => removeField(field.id)}
                          className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded border border-transparent hover:border-red-100 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <button 
                      onClick={handleAddField}
                      className="flex items-center gap-2 text-sm font-medium text-emerald-600 border border-emerald-200 rounded-lg px-4 py-2 mt-4 hover:bg-emerald-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Field
                    </button>
                  </div>
                </div>

                {/* Formula Definitions */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-6 overflow-hidden">
                  <div className="flex items-center justify-between bg-slate-50/50 px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-blue-500" />
                      <h3 className="font-semibold text-slate-700 text-sm">Formula Definitions</h3>
                    </div>
                    <span className="text-xs text-slate-400">{formulas.length} output formulas</span>
                  </div>
                  <div className="p-5 space-y-4">
                    
                    {formulas.map((formula) => (
                      <div key={formula.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-end gap-3 mb-3">
                          <div className="flex-1">
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Output Label</label>
                            <input 
                              type="text" 
                              value={formula.label} 
                              onChange={(e) => updateFormula(formula.id, 'label', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500" 
                              placeholder="Label"
                            />
                          </div>
                          <div className="flex-[2]">
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Expression</label>
                            <input 
                              type="text" 
                              value={formula.expression} 
                              onChange={(e) => updateFormula(formula.id, 'expression', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-blue-700 font-mono focus:outline-none focus:border-blue-500" 
                              placeholder="e.g. L * W"
                            />
                          </div>
                          <div className="w-20">
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Unit</label>
                            <input 
                              type="text" 
                              value={formula.unit} 
                              onChange={(e) => updateFormula(formula.id, 'unit', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-700 text-center focus:outline-none focus:border-blue-500" 
                              placeholder="Unit"
                            />
                          </div>
                          <button 
                            onClick={() => removeFormula(formula.id)}
                            className="p-2 mb-0.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded border border-transparent hover:border-red-100 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="bg-blue-50 text-blue-800 text-xs font-mono p-2.5 rounded-md flex items-center border border-blue-100">
                          <span className="text-slate-500 mr-2 font-sans">Preview:</span> 
                          <strong>{formula.label || 'Output'}</strong> <span className="mx-2">=</span> {formula.expression || '...'} <span className="text-slate-400 ml-2">[{formula.unit || '-'}]</span>
                        </div>
                      </div>
                    ))}

                    <button 
                      onClick={handleAddFormula}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg px-4 py-2 mt-2 hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Formula
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}