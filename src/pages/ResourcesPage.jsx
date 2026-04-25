import { useState, useEffect, useCallback } from 'react';
import Button from '../components/shared/Button.jsx';
import MaterialTable from '../components/materials/MaterialTable.jsx';
import MaterialForm  from '../components/materials/MaterialForm.jsx';
import ServiceTable  from '../components/services/ServiceTable.jsx';
import ServiceForm   from '../components/services/ServiceForm.jsx';
import {
  getAllMaterials, createMaterial, updateMaterial, deleteMaterial,
} from '../api/materialsApi.js';
import {
  getAllServices, createService, updateService, deleteService,
} from '../api/servicesApi.js';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const colors = { success: 'bg-emerald-500', error: 'bg-red-500', info: 'bg-blue-500' };
  return (
    <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium
      transition-all animate-fade-in ${colors[toast.type] || colors.success}`}>
      {toast.msg}
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

const TABS = ['Materials', 'Services', 'Units'];

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState('Materials');
  const [search,    setSearch]    = useState('');

  // ── Materials state ────────────────────────────────────────────────────────
  const [materials,  setMaterials]  = useState([]);
  const [matLoading, setMatLoading] = useState(true);
  const [showMatForm, setShowMatForm] = useState(false);  // inline form (Add)
  const [editMat,     setEditMat]    = useState(null);    // modal (Edit)

  // ── Services state ─────────────────────────────────────────────────────────
  const [services,   setServices]   = useState([]);
  const [svcLoading, setSvcLoading] = useState(true);
  const [showSvcForm, setShowSvcForm] = useState(false);
  const [editSvc,     setEditSvc]    = useState(null);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState(null);
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Loaders ────────────────────────────────────────────────────────────────
  const loadMaterials = useCallback(async () => {
    try {
      setMatLoading(true);
      setMaterials(await getAllMaterials());
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setMatLoading(false);
    }
  }, [showToast]);

  const loadServices = useCallback(async () => {
    try {
      setSvcLoading(true);
      setServices(await getAllServices());
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setSvcLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadMaterials(); loadServices(); }, [loadMaterials, loadServices]);

  // ── Material handlers ──────────────────────────────────────────────────────
  const handleAddMaterial = async (form) => {
    await createMaterial(form);
    await loadMaterials();
    setShowMatForm(false);
    showToast('Matériau ajouté avec succès');
  };

  const handleUpdateMaterial = async (form) => {
    await updateMaterial(editMat.material_id, form);
    await loadMaterials();
    setEditMat(null);
    showToast('Matériau mis à jour');
  };

  const handleDeleteMaterial = async (id) => {
    await deleteMaterial(id);
    await loadMaterials();
    showToast('Matériau supprimé', 'info');
  };

  // ── Service handlers ───────────────────────────────────────────────────────
  const handleAddService = async (form) => {
    await createService(form);
    await loadServices();
    setShowSvcForm(false);
    showToast('Service ajouté avec succès');
  };

  const handleUpdateService = async (form) => {
    await updateService(editSvc.service_id, form);
    await loadServices();
    setEditSvc(null);
    showToast('Service mis à jour');
  };

  const handleDeleteService = async (id) => {
    await deleteService(id);
    await loadServices();
    showToast('Service supprimé', 'info');
  };

  // ── Add button label ───────────────────────────────────────────────────────
  const addLabel = activeTab === 'Materials' ? '+ Add Material'
                 : activeTab === 'Services'  ? '+ Add Service'
                 : '+ Add Unit';

  const handleAddClick = () => {
    if (activeTab === 'Materials') {
      setSearch('');
      setShowMatForm(v => !v);
      setShowSvcForm(false);
    } else if (activeTab === 'Services') {
      setSearch('');
      setShowSvcForm(v => !v);
      setShowMatForm(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-slate-50">
      <Toast toast={toast} />

      <div className="max-w-[1300px] mx-auto px-6 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Resources</h1>
            <p className="text-sm text-slate-500 mt-0.5">Materials, Services & Units</p>
          </div>
          <Button onClick={handleAddClick}>{addLabel}</Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSearch(''); setShowMatForm(false); setShowSvcForm(false); }}
              className={[
                'px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none
              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
          />
        </div>

        {/* ── MATERIALS TAB ── */}
        {activeTab === 'Materials' && (
          <>
            {/* Inline Add Form */}
            {showMatForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-800 mb-5">New Material</h3>
                <MaterialForm
                  onSave={handleAddMaterial}
                  onCancel={() => setShowMatForm(false)}
                />
              </div>
            )}

            {/* Table */}
            {matLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <MaterialTable
                  materials={materials}
                  search={search}
                  onEdit={(m)  => { setEditMat(m); setShowMatForm(false); }}
                  onDelete={handleDeleteMaterial}
                />
              </div>
            )}
          </>
        )}

        {/* ── SERVICES TAB ── */}
        {activeTab === 'Services' && (
          <>
            {showSvcForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
                <h3 className="text-base font-semibold text-slate-800 mb-5">New Service</h3>
                <ServiceForm
                  onSave={handleAddService}
                  onCancel={() => setShowSvcForm(false)}
                />
              </div>
            )}

            {svcLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ServiceTable
                  services={services}
                  search={search}
                  onEdit={(s)  => { setEditSvc(s); setShowSvcForm(false); }}
                  onDelete={handleDeleteService}
                />
              </div>
            )}
          </>
        )}

        {/* ── UNITS TAB ── */}
        {activeTab === 'Units' && (
          <div className="text-center text-slate-400 py-16 text-sm">
            Units management — coming soon
          </div>
        )}
      </div>

      {/* Edit Material Modal */}
      {editMat && (
        <Modal title="Edit Material" onClose={() => setEditMat(null)}>
          <MaterialForm
            initial={editMat}
            onSave={handleUpdateMaterial}
            onCancel={() => setEditMat(null)}
          />
        </Modal>
      )}

      {/* Edit Service Modal */}
      {editSvc && (
        <Modal title="Edit Service" onClose={() => setEditSvc(null)}>
          <ServiceForm
            initial={editSvc}
            onSave={handleUpdateService}
            onCancel={() => setEditSvc(null)}
          />
        </Modal>
      )}
    </div>
  );
}
