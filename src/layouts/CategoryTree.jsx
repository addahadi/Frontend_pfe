import { useState } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom"; // Added Hooks and Outlet
import { ChevronRight, ChevronDown, Plus, X } from "lucide-react";

/* ─── DESIGN TOKENS (Unchanged) ─── */
const P = {
  main: "#104ED8", mainL: "#EFF4FF", mainM: "#DBEAFE", mainD: "#0D3FAE",
  success: "#059669", warn: "#F59E0B", error: "#E11D48",
  bg: "#F8FAFC", surface: "#FFFFFF", border: "#E2E8F0", borderL: "#F1F5F9",
  txt: "#0F172A", txt2: "#475569", txt3: "#94A3B8",
};

function TreeRow({ node, depth, expanded, onToggle, onDelete }) {
  const { id: currentId } = useParams(); // Get ID from URL
  const navigate = useNavigate();

  const isLeaf = !node.children?.length;
  const isExp = expanded.includes(node.id);
  const isSel = currentId === node.id; // Selection logic based on URL

  const handleRowClick = () => {
    // Navigate to the specific route
    navigate(`/admin/modules/${node.id}`);
  };

  return (
    <div>
      <div
        onClick={handleRowClick}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: `6px 10px 6px ${12 + depth * 16}px`,
          cursor: "pointer", borderRadius: 6, marginBottom: 1,
          background: isSel ? P.mainL : "transparent",
          border: isSel ? `1px solid ${P.mainM}` : "1px solid transparent",
          transition: "all .12s", position: "relative",
          opacity: node.isActive ? 1 : .5,
        }}
        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = P.bg; }}
        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}
      >
        {depth > 0 && <div style={{ position: "absolute", left: depth * 16 - 2, top: 0, bottom: 0, width: 1, background: P.border }} />}

        <span
          onClick={e => { e.stopPropagation(); if (!isLeaf) onToggle(node.id); }}
          style={{ color: P.txt3, cursor: isLeaf ? "default" : "pointer", display: "flex", padding: "4px" }}
        >
          {!isLeaf ? (isExp ? <ChevronDown size={12} /> : <ChevronRight size={12} />) : <span style={{ width: 12 }} />}
        </span>

        <span style={{ fontSize: 13 }}>{node.icon || "📁"}</span>
        <span style={{ fontSize: 12.5, flex: 1, color: isSel ? P.main : P.txt, fontWeight: isSel ? 600 : 400 }}>
          {node.name}
        </span>

        {isLeaf && <span style={{ fontSize: 10, color: P.main, background: P.mainL, padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>LEAF</span>}

        <button
          onClick={e => { e.stopPropagation(); onDelete(node.id); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: P.txt3, display: "flex", opacity: .6 }}
        >
          <X size={12} />
        </button>
      </div>

      {!isLeaf && isExp && node.children.map(c =>
        <TreeRow key={c.id} node={c} depth={depth + 1} expanded={expanded} onToggle={onToggle} onDelete={onDelete} />
      )}
    </div>
  );
}

/* ─── CATEGORY TREE SIDEBAR ─── */
export default function CategoryTree({
  tree = [],
  onDelete = () => { },
  onAdd = () => { },
  width = 256,
}) {
  const [expanded, setExpanded] = useState([]);

  const handleToggle = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const allNodes = mAllNodes(tree);

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "100%" }}>
      {/* Sidebar Sidebar */}
      <div style={{ width, borderRight: `1px solid ${P.border}`, display: "flex", flexDirection: "column", background: P.surface, flexShrink: 0 }}>
        {/* Header with stats */}
        <div style={{ padding: "12px 12px 10px", borderBottom: `1px solid ${P.border}` }}>
          <div style={{ fontSize: 11, color: P.txt3, fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>
            Category Tree
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ fontSize: 10.5, color: P.main, background: `${P.main}14`, padding: "2px 7px", borderRadius: 4, fontWeight: 500 }}>
              {allNodes.length} nodes
            </span>
          </div>
        </div>

        {/* Tree nodes */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {tree?.map(n => (
            <TreeRow
              key={n.id}
              node={n}
              depth={0}
              expanded={expanded}
              onToggle={handleToggle}
              onDelete={onDelete}
            />
          ))}
        </div>

        {/* Add Category button */}
        <div style={{ padding: "10px 10px", borderTop: `1px solid ${P.border}` }}>
          <button onClick={onAdd} style={addBtnStyle}>
            <Plus size={13} /> Add Category
          </button>
        </div>
      </div>

      {/* Main Content Area (Outlet for child routes) */}
      <div style={{ flex: 1, overflowY: "auto", background: P.bg }}>
        <Outlet />
      </div>
    </div>
  );
}

/* --- STYLES & HELPERS --- */
const addBtnStyle = {
  width: "100%", padding: "8px", borderRadius: 7, border: `1.5px dashed ${P.border}`,
  background: "transparent", color: P.txt3, cursor: "pointer", fontSize: 13,
  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
};

function mAllNodes(nodes) {
  if (!nodes || !Array.isArray(nodes)) return [];
  const o = [];
  for (const n of nodes) {
    o.push(n);
    if (n.children?.length) o.push(...mAllNodes(n.children));
  }
  return o;
}