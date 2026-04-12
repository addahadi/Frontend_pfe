import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, Save, X } from 'lucide-react';
import { initialPlans } from './mock.js'; // <-- Import the mock data here

const PlanFeatures = () => {
  // Use the imported mock data as the initial state
  const [plans, setPlans] = useState(initialPlans);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editingPlan, setEditingPlan] = useState(null);

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setView('form');
  };

  const handleCreateNew = () => {
    setEditingPlan(null);
    setView('form');
  };

  const handleDelete = (planName) => {
    setPlans(plans.filter(p => p.name !== planName));
  };

  const handleSavePlan = (savedPlan, originalName) => {
    if (originalName) {
      setPlans(plans.map(p => p.name === originalName ? savedPlan : p));
    } else {
      setPlans([...plans, savedPlan]);
    }
    setView('list');
  };

  if (view === 'form') {
    return (
      <PlanForm 
        initialData={editingPlan} 
        onSave={handleSavePlan} 
        onCancel={() => setView('list')} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <div key={plan.name} className="border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mt-2 ${plan.tagColor}`}>
              {plan.tag}
            </span>
            <p className="text-gray-400 text-sm mt-4">{plan.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            {plan.features.map((f) => (
              <div key={f.label} className="flex justify-between text-sm">
                <span className="text-gray-300 font-medium">{f.label}</span>
                <span className={`font-semibold ${f.isBoolean ? (f.value === 'true' ? 'text-green-500' : 'text-red-400') : 'text-gray-700'}`}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => handleEdit(plan)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-100 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button 
              onClick={() => handleDelete(plan.name)}
              className="flex items-center justify-center px-4 py-2 border border-red-50 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      ))}

      <div 
        onClick={handleCreateNew}
        className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center group cursor-pointer hover:border-blue-200 transition-colors min-h-[400px]"
      >
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Plus className="text-blue-600 w-6 h-6" />
        </div>
        <span className="text-gray-400 font-medium">New Plan</span>
      </div>
    </div>
  );
};

function PlanForm({ initialData, onSave, onCancel }) {
  const isEdit = !!initialData;
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.tag || 'NORMAL');
  const [description, setDescription] = useState(initialData?.description || '');
  
  const [features, setFeatures] = useState(
    initialData?.features?.map((f, i) => ({ id: i, label: f.label, value: f.value })) || 
    [{ id: 0, label: '', value: '' }]
  );

  const handleAddFeature = () => {
    // Safer ID generation
    const newId = features.length > 0 ? Math.max(...features.map(f => f.id)) + 1 : 0;
    setFeatures([...features, { id: newId, label: '', value: '' }]);
  };

  const handleRemoveFeature = (idToRemove) => {
    setFeatures(features.filter(f => f.id !== idToRemove));
  };

  const handleFeatureChange = (id, field, newValue) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: newValue } : f));
  };

  const handleSubmit = () => {
    const cleanFeatures = features
      .filter(f => f.label.trim() !== '')
      .map(f => ({
        label: f.label,
        value: f.value,
        isBoolean: f.value === 'true' || f.value === 'false'
      }));

    const newPlan = {
      name,
      tag: type,
      tagColor: type === 'COMPANY' ? 'bg-purple-50 text-purple-500' : 'bg-cyan-50 text-cyan-500',
      description,
      features: cleanFeatures
    };

    onSave(newPlan, initialData?.name);
  };

  return (
    <div className="max-w-4xl bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-8">
        {isEdit ? `Edit: ${initialData.name}` : 'Create New Plan'}
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Plan Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pro"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Type</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors bg-white appearance-none"
          >
            <option value="NORMAL">NORMAL</option>
            <option value="COMPANY">COMPANY</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-500 mb-2">Description</label>
        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-500 mb-3">Features (key / value)</label>
        <div className="space-y-3 mb-4">
          {features.map((feature) => (
            <div key={feature.id} className="flex gap-3">
              <input 
                type="text"
                value={feature.label}
                onChange={(e) => handleFeatureChange(feature.id, 'label', e.target.value)}
                placeholder="feature_key"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
              />
              <input 
                type="text"
                value={feature.value}
                onChange={(e) => handleFeatureChange(feature.id, 'value', e.target.value)}
                placeholder="value"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-blue-600"
              />
              <button 
                onClick={() => handleRemoveFeature(feature.id)}
                className="px-3 border border-gray-200 rounded-lg text-red-400 hover:bg-red-50 hover:border-red-100 transition-colors flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={handleAddFeature}
          className="flex items-center gap-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
        >
          + Add Feature
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" /> Save Plan
        </button>
        <button 
          onClick={onCancel}
          className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors px-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PlanFeatures;