import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, Save, X } from 'lucide-react';

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState('Plans & Features');

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500 mt-1">Plans, features & subscribers</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gray-100 mb-8">
        {['Plans & Features', 'Subscribers'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-all relative ${
              activeTab === tab 
                ? 'text-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'Plans & Features' ? <PlansTab /> : <SubscribersTab />}
    </div>
  );
}

// --- TAB 1: PLANS & FEATURES ---
function PlansTab() {
  // Moved plans to state so they can be edited/added
  const [plans, setPlans] = useState([
    {
      name: 'Free',
      tag: 'NORMAL',
      tagColor: 'bg-cyan-50 text-cyan-500',
      description: 'Basic access for individuals',
      features: [
        { label: 'max_projects', value: '3' },
        { label: 'max_calculations', value: '20' },
        { label: 'can_export_pdf', value: 'false', isBoolean: true },
        { label: 'support_level', value: 'none' },
      ]
    },
    {
      name: 'Pro',
      tag: 'NORMAL',
      tagColor: 'bg-cyan-50 text-cyan-500',
      description: 'Full access for professionals',
      features: [
        { label: 'max_projects', value: '20' },
        { label: 'max_calculations', value: '500' },
        { label: 'can_export_pdf', value: 'true', isBoolean: true },
        { label: 'can_use_api', value: 'false', isBoolean: true },
        { label: 'support_level', value: 'email' },
      ]
    },
    {
      name: 'Enterprise',
      tag: 'COMPANY',
      tagColor: 'bg-purple-50 text-purple-500',
      description: 'Unlimited for construction firms',
      features: [
        { label: 'max_projects', value: 'unlimited' },
        { label: 'max_calculations', value: 'unlimited' },
        { label: 'can_export_pdf', value: 'true', isBoolean: true },
        { label: 'can_use_api', value: 'true', isBoolean: true },
        { label: 'support_level', value: 'priority' },
        { label: 'team_members', value: '25' },
      ]
    }
  ]);

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
      // Edit existing
      setPlans(plans.map(p => p.name === originalName ? savedPlan : p));
    } else {
      // Create new
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

      {/* New Plan Card */}
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
}

// --- NEW COMPONENT: PLAN FORM ---
function PlanForm({ initialData, onSave, onCancel }) {
  const isEdit = !!initialData;
  
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.tag || 'NORMAL');
  const [description, setDescription] = useState(initialData?.description || '');
  
  // Initialize features or provide two empty rows by default
  const [features, setFeatures] = useState(
    initialData?.features?.map((f, i) => ({ id: i, label: f.label, value: f.value })) || 
    [
      { id: Date.now(), label: '', value: '' },
      { id: Date.now() + 1, label: '', value: '' }
    ]
  );

  const handleAddFeature = () => {
    setFeatures([...features, { id: Date.now(), label: '', value: '' }]);
  };

  const handleRemoveFeature = (idToRemove) => {
    setFeatures(features.filter(f => f.id !== idToRemove));
  };

  const handleFeatureChange = (id, field, newValue) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: newValue } : f));
  };

  const handleSubmit = () => {
    // Basic formatting before save
    const cleanFeatures = features
      .filter(f => f.label.trim() !== '') // remove empty rows
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

// --- TAB 2: SUBSCRIBERS (Unchanged) ---
function SubscribersTab() {
  const subscribers = [
    { name: 'Karim Benali', email: 'karim@mail.com', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', start: '2025-11-03', end: '2026-11-03', init: 'KB' },
    { name: 'Sara Meziani', email: 'sara@corp.dz', plan: 'Enterprise', type: 'COMPANY', status: 'ACTIVE', start: '2025-09-14', end: '2026-09-14', init: 'SM' },
    { name: 'Amine Touati', email: 'amine@mail.com', plan: 'Free', type: 'NORMAL', status: 'INACTIVE', start: '2026-01-22', end: '-', init: 'AT' },
    { name: 'Lina Hadjadj', email: 'lina@archi.dz', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', start: '2025-12-01', end: '2026-12-01', init: 'LH' },
    { name: 'Yacine Oussad', email: 'yacine@build.com', plan: 'Enterprise', type: 'COMPANY', status: 'ACTIVE', start: '2025-08-07', end: '2026-08-07', init: 'YO' },
    { name: 'Omar Rezig', email: 'omar@construct.dz', plan: 'Pro', type: 'NORMAL', status: 'ACTIVE', start: '2025-10-30', end: '2026-10-30', init: 'OR' },
  ];

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select className="border border-gray-100 rounded-xl px-6 py-3 text-sm text-gray-600 focus:outline-none min-w-[120px]">
          <option>All</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Start Date</th>
              <th className="px-6 py-4 font-semibold">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscribers.map((sub, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {sub.init}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{sub.name}</div>
                      <div className="text-gray-400 text-xs">{sub.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-blue-500 font-semibold text-sm">{sub.plan}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-[10px] font-bold ${sub.type === 'COMPANY' ? 'bg-purple-50 text-purple-400' : 'bg-cyan-50 text-cyan-400'}`}>
                    {sub.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold text-xs ${sub.status === 'ACTIVE' ? 'text-green-400' : 'text-gray-300'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">{sub.start}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{sub.end}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}