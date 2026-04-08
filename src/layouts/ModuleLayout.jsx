import React from 'react';
import { 
  Home, Hammer, BrickWall, Columns, Paintbrush, 
  DoorClosed, ChevronDown, ChevronRight, X, Plus 
} from 'lucide-react';
import { Outlet } from 'react-router-dom';

const treeData = [
  {
    id: 'grand-travaux',
    label: 'Grand Travaux',
    icon: Home,
    type: 'branch',
    children: [
      { id: 'excavation', label: 'Excavation', icon: Hammer, type: 'leaf' },
      {
        id: 'foundations',
        label: 'Foundations',
        icon: BrickWall,
        type: 'branch',
        children: [
          { id: 'isolated-footing', label: 'Isolated Footing', type: 'leaf' }
        ]
      },
      { id: 'columns', label: 'Columns', icon: Columns, type: 'leaf' }
    ]
  },
  { id: 'finition', label: 'Finition', icon: Paintbrush, type: 'branch' },
  { id: 'portes', label: 'Portes & Fenêtres', icon: DoorClosed, type: 'branch' }
];

function ModuleLayout({ activeNode, setActiveNode }) {
  
  // Recursive function to render the tree nodes
  const renderNodes = (nodes, level = 0) => {
    return nodes.map((node) => {
      const isSelected = activeNode === node.id;
      const Icon = node.icon; // Capitalize to use as component

      return (
        <div key={node.id} className="w-full">
          <div 
            onClick={() => setActiveNode(node.id)}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              {/* Branch Arrow */}
              {node.type === 'branch' && (
                <ChevronDown className={`w-4 h-4 text-slate-400 ${node.id !== 'grand-travaux' && 'rotate-[-90deg]'}`} />
              )}
              
              {/* Node Icon or Color Box for leaves */}
              {Icon ? (
                <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
              ) : (
                <div className={`w-3 h-3 rounded-sm ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
              )}

              <span className={`${isSelected ? 'text-blue-700 font-medium' : 'text-slate-600'}`}>
                {node.label}
              </span>
            </div>

            {/* Labels for Leaves */}
            <div className="flex items-center gap-1.5">
              {node.type === 'leaf' && (
                <span className="text-[10px] bg-blue-100 text-blue-600 font-semibold px-1.5 py-0.5 rounded">LEAF</span>
              )}
              {isSelected && <X className="w-3.5 h-3.5 text-slate-400" />}
            </div>
          </div>

          {/* Render children if they exist */}
          {node.children && (
            <div className="mt-1 space-y-1 border-l border-slate-100 ml-4">
              {renderNodes(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white text-slate-800 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-white shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category Tree</h2>
          <div className="flex gap-2 text-[11px] font-medium">
            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">10 nodes</span>
            <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded">5 leaves</span>
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded">17 fields</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {renderNodes(treeData)}
        </div>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-400 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:text-slate-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 bg-slate-50/50 overflow-y-auto">
        <Outlet />  
      </main>

    </div>
  );
}

export default ModuleLayout;