import React, { useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { Box, Sparkles, LogOut, ChevronRight, ChevronDown, Folder, Layers } from "lucide-react";

/* ─── DYNAMIC TREE ROW (Sidebar Integration) ─── */
function TreeRow({ node, depth, expanded, onToggle }) {
  const { categoryId, projectId } = useParams(); 
  const navigate = useNavigate();
  
  const isLeaf = !node.children?.length;
  const isExp = expanded.includes(node.id);
  const isSel = categoryId === node.id; // User route uses categoryId

  const handleRowClick = () => {
    // Navigate strictly within the user project hierarchy
    navigate(`/projects/${projectId}/explorer/${node.id}`);
  };

  return (
    <div>
      <div
        onClick={handleRowClick}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: `8px 12px 8px ${12 + depth * 16}px`,
          cursor: "pointer", borderRadius: 8, marginBottom: 2,
          background: isSel ? "#104ED815" : "transparent",
          color: isSel ? "#104ED8" : "#475569",
          transition: "all .12s", position: "relative",
        }}
        onMouseEnter={e => !isSel && (e.currentTarget.style.background = "#F8FAFC")}
        onMouseLeave={e => !isSel && (e.currentTarget.style.background = "transparent")}
      >
        <span
          onClick={e => { e.stopPropagation(); if (!isLeaf) onToggle(node.id); }}
          style={{ color: "#94A3B8", cursor: isLeaf ? "default" : "pointer", display: "flex" }}
        >
          {!isLeaf ? (isExp ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span style={{ width: 14 }} />}
        </span>

        <span style={{ display: "flex", alignItems: "center", opacity: isSel ? 1 : 0.7 }}>
          {isLeaf ? <Layers size={14} /> : <Folder size={14} fill={isExp ? "#F59E0B" : "none"} color={isExp ? "#F59E0B" : "currentColor"} />}
        </span>
        
        <span style={{ fontSize: 13, flex: 1, fontWeight: isSel ? 600 : 500 }}>
          {node.name}
        </span>

        {isLeaf && <span style={{ fontSize: 9, fontWeight: 800, color: "#104ED8", background: "#EFF4FF", padding: "2px 4px", borderRadius: 4 }}>LEAF</span>}
      </div>

      {/* Render Children if Expanded */}
      {!isLeaf && isExp && node.children?.map(c => (
        <TreeRow key={c.id} node={c} depth={depth + 1} expanded={expanded} onToggle={onToggle} />
      ))}
    </div>
  );
}

/* ─── PROJECT EXPLORER LAYOUT ─── */
const ProjectExplorerLayout = ({ treeData = [] }) => {
  const [expanded, setExpanded] = useState([]);

  const handleToggle = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const collapseAll = () => setExpanded([]);

  return (
    <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ─── DYNAMIC SIDEBAR ─── */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <img src="/logo.png" alt="APEX Logo" className="w-10 h-10 rounded-lg shadow-sm object-cover" />
          <div>
            <h1 className="font-bold text-lg leading-none">APEX</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Workspace v2.0</p>
          </div>
        </div>

        {/* Project Context Info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-2 text-blue-600">
             <Box size={14} />
             <h3 className="text-xs font-bold uppercase tracking-widest">Skyline Tower</h3>
           </div>
        </div>

        {/* INLINE CATEGORY NAV (Directly in Sidebar) */}
        <nav className="flex-1 overflow-y-auto p-3">
          {treeData.map(node => (
            <TreeRow 
              key={node.id} 
              node={node} 
              depth={0} 
              expanded={expanded} 
              onToggle={handleToggle} 
            />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={collapseAll}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-200 transition-colors"
          >
            <LogOut size={14} className="rotate-90" />
            Collapse All
          </button>
        </div>
      </aside>

      {/* ─── MAIN WORKSPACE ─── */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-md shadow-blue-100 transition-all">
              <Sparkles size={16} />
              AI Assistant
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-blue-100 overflow-hidden cursor-pointer">
              <img src="https://ui-avatars.com/api/?name=John+Doe" className="w-full h-full" alt="profile" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProjectExplorerLayout;