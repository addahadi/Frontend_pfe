// src/modules/user/pages/CategoryDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, Home, DollarSign, Info, Calculator, ArrowLeft, Share2, Printer } from "lucide-react";
import { CONSTRUCTION_TREE } from "../../../shared/lib/constants";

// ==================== مكون الحاسبة (للعرض عند وجود categoryId) ====================
const CalculatorPage = ({ categoryNode, projectId }) => {
  const [length, setLength] = useState(2.50);
  const [width, setWidth] = useState(2.50);
  const [height, setHeight] = useState(0.60);
  const [concreteGrade, setConcreteGrade] = useState("C25/30 - Standard Structural");
  const [concreteVolume, setConcreteVolume] = useState(3.75);
  const [surfaceArea, setSurfaceArea] = useState(6.25);
  const [excavation, setExcavation] = useState(5.40);
  const [steel, setSteel] = useState(300.00);
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [showCostEstimate, setShowCostEstimate] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState([]);

  // بناء مسار الـ breadcrumb
  const findNodeAndPath = (nodes, targetId, currentPath = []) => {
    for (const node of nodes) {
      const newPath = [...currentPath, { id: node.id, name: node.name }];
      if (node.id === targetId) return { node, path: newPath };
      if (node.children) {
        const found = findNodeAndPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (categoryNode?.id) {
      const result = findNodeAndPath(CONSTRUCTION_TREE, categoryNode.id);
      if (result) setBreadcrumb(result.path);
    }
  }, [categoryNode]);

  const calculateQuantities = () => {
    const vol = length * width * height;
    const area = length * width + 2 * (length * height) + 2 * (width * height);
    const excav = vol * 1.44;
    const steelKg = vol * 80;
    setConcreteVolume(parseFloat(vol.toFixed(2)));
    setSurfaceArea(parseFloat(area.toFixed(2)));
    setExcavation(parseFloat(excav.toFixed(2)));
    setSteel(parseFloat(steelKg.toFixed(2)));
  };

  const resetValues = () => {
    setLength(2.50);
    setWidth(2.50);
    setHeight(0.60);
    setConcreteGrade("C25/30 - Standard Structural");
    setConcreteVolume(3.75);
    setSurfaceArea(6.25);
    setExcavation(5.40);
    setSteel(300.00);
    setEstimatedCost(null);
    setShowCostEstimate(false);
  };

  const handleCostEstimate = () => {
    if (concreteVolume) {
      const concreteCost = concreteVolume * 120;
      const steelCost = steel * 1.2;
      setEstimatedCost((concreteCost + steelCost).toFixed(2));
      setShowCostEstimate(true);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Isolated Footing Calculation', text: 'Vérifiez le calcul', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié');
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* أيقونات المشاركة والطباعة */}
      <div className="flex justify-end mb-4 gap-2">
        <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-100"><Share2 size={20} className="text-slate-500" /></button>
        <button onClick={handlePrint} className="p-2 rounded-full hover:bg-slate-100"><Printer size={20} className="text-slate-500" /></button>
      </div>

      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <div className="mb-4 text-sm text-slate-500 flex flex-wrap gap-1">
          <Link to={`/projects/${projectId}/explorer`} className="hover:text-primary flex items-center gap-1"><Home size={14} /> Project</Link>
          {breadcrumb.map((item, idx) => (
            <span key={item.id} className="flex items-center gap-1">
              <span className="mx-1">/</span>
              {idx === breadcrumb.length - 1 ? (
                <span className="font-semibold text-slate-700">{item.name}</span>
              ) : (
                <Link to={`/projects/${projectId}/explorer/${item.id}`} className="hover:text-primary">{item.name}</Link>
              )}
            </span>
          ))}
        </div>
      )}

      {/* العنوان */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Isolated Footing</h1>
        <p className="text-sm text-slate-500 mt-1">Configure and calculate structural quantities for reinforced concrete isolated footings.</p>
      </div>

      {/* عمودين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* العمود الأيسر: المدخلات */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">INPUT DIMENSIONS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div><label className="block text-sm font-medium">LENGTH (L)</label><input type="number" step="0.01" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)} className="mt-1 w-full border rounded-lg px-3 py-2" /><span className="text-xs text-slate-400">M</span></div>
              <div><label className="block text-sm font-medium">WIDTH (W)</label><input type="number" step="0.01" value={width} onChange={e => setWidth(parseFloat(e.target.value) || 0)} className="mt-1 w-full border rounded-lg px-3 py-2" /><span className="text-xs text-slate-400">M</span></div>
              <div><label className="block text-sm font-medium">HEIGHT (H)</label><input type="number" step="0.01" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)} className="mt-1 w-full border rounded-lg px-3 py-2" /><span className="text-xs text-slate-400">M</span></div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">CONCRETE GRADE</label>
              <select value={concreteGrade} onChange={e => setConcreteGrade(e.target.value)} className="mt-1 w-full border rounded-lg px-3 py-2">
                <option>C25/30 - Standard Structural</option>
                <option>C30/37 - High Strength</option>
                <option>C20/25 - Light Structural</option>
              </select>
            </div>
            <button onClick={calculateQuantities} className="w-full bg-primary text-white py-2 rounded-lg font-semibold">CALCULATE QUANTITIES</button>
            <button onClick={resetValues} className="w-full mt-3 border py-2 rounded-lg">Reset Values</button>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border p-5">
            <div className="flex items-center gap-2 mb-2"><DollarSign className="text-accent" /><h2 className="text-lg font-bold">MATERIAL COST ESTIMATION</h2></div>
            <p className="text-sm text-slate-500 mb-4">Get an automated cost estimate based on current market rates for concrete and reinforcement materials.</p>
            <button onClick={handleCostEstimate} className="px-5 py-2 bg-accent text-white rounded-lg">Calculate Estimated Material Cost</button>
            {showCostEstimate && <div className="mt-4 p-3 bg-green-50 border rounded-lg"><p className="text-green-700">Estimated cost: ${estimatedCost} USD</p></div>}
          </div>
        </div>

        {/* العمود الأيمن: النتائج والصيغ */}
        <div className="space-y-6">
          <div className="bg-blue-800 dark:bg-blue-950 rounded-xl border border-blue-700 p-6 text-white">
            <h2 className="text-lg font-bold mb-4">GRAND TRAVAUX</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-blue-600 pb-2"><span className="text-blue-100">CONCRETE VOLUME</span><span className="text-2xl font-bold">{concreteVolume.toFixed(2)} m³</span></div>
              <div className="flex justify-between border-b border-blue-600 pb-2"><span className="text-blue-100">SURFACE AREA</span><span className="text-2xl font-bold">{surfaceArea.toFixed(2)} m²</span></div>
              <div className="flex justify-between border-b border-blue-600 pb-2"><span className="text-blue-100">EXCAVATION</span><span className="text-2xl font-bold">{excavation.toFixed(2)} m³</span></div>
              <div className="flex justify-between"><span className="text-blue-100">STEEL (ESTIMATED)</span><span className="text-2xl font-bold">{steel.toFixed(2)} kg</span></div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border p-5">
            <div className="flex items-center gap-2 mb-3"><Calculator className="text-primary" /><h3 className="font-bold">CALCULATION FORMULAS</h3></div>
            <div className="space-y-1 text-sm"><p><span className="font-semibold">VOLUME CALCULATION METHOD</span></p><p>Standard Volume (Prismatic)</p><p><span className="font-semibold">PREVIEW:</span> V = L x W x H</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== مكون Category Browser (عند عدم وجود categoryId) ====================
const CategoryBrowser = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState(["grand-travaux"]);

  const toggleSection = (id) => {
    setExpandedSections(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const collapseAll = () => setExpandedSections([]);

  const grandTravaux = {
    id: "grand-travaux",
    name: "Grand Travaux",
    description: "Management of heavy structural works, foundations, and core building components.",
    icon: "🏗️",
    subcategories: [
      { name: "Gros Oeuvre", description: "Complete structural frame including vertical elements and floors.", tags: ["CONCRETE", "BEAMS", "COLUMNS"] },
      { name: "Fondations", description: "Substructure work including excavation and deep foundation...", tags: ["PILES", "EXCAVATION"] },
      { name: "Maçonnerie", description: "Brickwork, stone blocks and internal partitioning walls.", tags: ["BRICK", "MORTAR", "CLADDING"] },
    ],
  };

  const charpenteBox = {
    name: "Charpente",
    description: "Heavy timber or steel structural framing for roofs and floors.",
    tags: ["STEEL", "TIMBER"],
    icon: "🪚",
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">QuantiConstruct</h1>
        <p className="text-sm text-slate-500">Category Browser</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">SKYLINE TOWER</h2>
        <button onClick={collapseAll} className="text-sm text-slate-500 hover:text-primary flex items-center gap-1"><ChevronDown size={14} /> REDUIRE TOUT</button>
      </div>

      {/* Grand Travaux section */}
      <div className="border-b border-slate-200 dark:border-slate-700 pb-6 mb-6">
        <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleSection(grandTravaux.id)}>
          <div className="flex items-center gap-3"><span className="text-2xl">{grandTravaux.icon}</span><h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{grandTravaux.name}</h3></div>
          <button className="text-slate-400 group-hover:text-primary">{expandedSections.includes(grandTravaux.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}</button>
        </div>
        <p className="text-sm text-slate-500 mt-1 ml-9">{grandTravaux.description}</p>
        {expandedSections.includes(grandTravaux.id) && (
          <div className="mt-4 ml-9">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {grandTravaux.subcategories.map((sub, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-md">{sub.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{sub.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sub.tags.map(tag => (
                      <span key={tag} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold px-2 py-1 rounded-md text-primary">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Charpente box (مربع منفرد بنفس مقاييس المربعات الأخرى) */}
      <div className="mb-6">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-700 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{charpenteBox.icon}</span>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-md">{charpenteBox.name}</h4>
          </div>
          <p className="text-xs text-slate-500 mt-1">{charpenteBox.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {charpenteBox.tags.map(tag => (
              <span key={tag} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold px-2 py-1 rounded-md text-primary">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => navigate(`/projects/${projectId}/explorer/isolated-footing`)} className="text-primary text-sm hover:underline">Voir tous les calculs →</button>
      </div>
    </div>
  );
};

// ==================== المكون الرئيسي ====================
const CategoryDetail = () => {
  const { projectId, categoryId } = useParams();
  const [categoryNode, setCategoryNode] = useState(null);

  useEffect(() => {
    if (categoryId) {
      const findNode = (nodes, id) => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      const node = findNode(CONSTRUCTION_TREE, categoryId);
      setCategoryNode(node);
    } else {
      setCategoryNode(null);
    }
  }, [categoryId]);

  // إذا لم يوجد categoryId -> عرض Category Browser
  if (!categoryId) {
    return <CategoryBrowser />;
  }

  // إذا وجد categoryId ولكن العقدة غير موجودة
  if (!categoryNode) {
    return <div className="p-8 text-center">Category not found. <button onClick={() => window.history.back()} className="text-primary underline">Go back</button></div>;
  }

  // إذا كانت العقدة من نوع leaf -> عرض الحاسبة
  if (categoryNode.type === "leaf") {
    return <CalculatorPage categoryNode={categoryNode} projectId={projectId} />;
  }

  // إذا كانت العقدة من نوع non-leaf (مجلد) -> رسالة إرشادية
  return (
    <div className="p-8 text-center">
      <p className="text-slate-500">This is a folder. Please select a leaf category.</p>
      <button onClick={() => window.history.back()} className="mt-4 text-primary underline">Back to browser</button>
    </div>
  );
};

export default CategoryDetail;