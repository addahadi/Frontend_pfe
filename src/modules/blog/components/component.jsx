import { useEffect,useState,useCallback } from "react";  
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"; 
import { $getRoot } from "lexical"; 
import { CheckCircle2, X } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// Confirm Delete Dialog popup for admin article page
// ═══════════════════════════════════════════════════════════════════════════════
export const ConfirmDialog = ({ article, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[popIn_0.2s_ease-out]">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className="text-center text-gray-900 font-bold text-base mb-1">Delete Article?</h3>
        <p className="text-center text-gray-500 text-sm mb-1">You are about to delete:</p>
        <p className="text-center text-gray-800 font-semibold text-sm mb-5 px-2 truncate">"{article.title}"</p>
        <p className="text-center text-red-500 text-xs mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">Yes, Delete</button>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}; 




// ═══════════════════════════════════════════════════════════════════════════════
// Badges
// ═══════════════════════════════════════════════════════════════════════════════
export const TypeBadge = ({ type }) => {
  const styles = {
    BLOG:      "text-blue-500 bg-blue-50 border border-blue-200",
    ACTUALITE: "text-amber-500 bg-amber-50 border border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide ${styles[type]}`}>
      {type}
    </span>
  );
};  
export const StatusBadge = ({ status }) => {
  const styles = {
    PUBLISHED: "text-green-600 bg-green-50 border border-green-200",
    DRAFT:     "text-amber-600 bg-amber-50 border border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}; 
 

// ═══════════════════════════════════════════════════════════════════════════════
// Toast Notification
// ═══════════════════════════════════════════════════════════════════════════════
 export const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = { 
    success: "bg-green-500", 
    draft: "bg-blue-500",
    error: "bg-red-500"  // ← REQUIRED for error messages
  };

  // Use different icons for different types
  const getIcon = () => {
    if (type === 'error') {
      return <X size={18} className="flex-shrink-0" />; // X icon for errors
    }
    return <CheckCircle2 size={18} className="flex-shrink-0" />; // Check for success/draft
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5
                  rounded-2xl shadow-2xl text-white text-sm font-medium
                  ${styles[type] || styles.success}`}  // ← Fallback to success if type unknown
      style={{ animation: "slideUp 0.3s ease-out" }}
    >
      {getIcon()}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
      <div className="absolute bottom-0 left-0 h-1 rounded-b-2xl bg-white/30 w-full overflow-hidden">
        <div className="h-full bg-white/60 rounded-b-2xl" style={{ animation: "shrink 3.5s linear forwards" }} />
      </div>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shrink  { from { width:100%; } to { width:0%; } }
      `}</style>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════════════════════════
// Character Count
// ═══════════════════════════════════════════════════════════════════════════════
export  function CharacterCountDisplay({ limit = 10000 }) {
  const [editor] = useLexicalComposerContext();
  const [count, setCount] = useState(0);
  useEffect(() => editor.registerUpdateListener(({ editorState }) => { editorState.read(() => { setCount($getRoot().getTextContent().length); }); }), [editor]);
  const pct = Math.min((count / limit) * 100, 100);
  const color = pct > 90 ? "text-red-500" : pct > 70 ? "text-yellow-500" : "text-gray-400";
  return (
    <div className={`flex items-center gap-1.5 text-xs ${color} select-none`}>
      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-400" : pct > 70 ? "bg-yellow-400" : "bg-blue-400"}`} style={{ width: `${pct}%` }} />
      </div>
      {count} / {limit.toLocaleString()}
    </div>
  );}

// ═══════════════════════════════════════════════════════════════════════════════
// tagselector
// ═══════════════════════════════════════════════════════════════════════════════

  export   const TagSelector = ({ options, selected, onChange }) => {
      const toggleTag = useCallback((id) => {
        onChange(selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id]);
      }, [selected, onChange]);
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((tag) => {
            const active = selected.includes(tag.id);
            return (
              <button key={tag.id} onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-xs border ${active ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                {tag.name}
              </button>
            );
          })}
        </div>
      );
    };


// ═══════════════════════════════════════════════════════════════════════════════
// Icons
// ═══════════════════════════════════════════════════════════════════════════════
export const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

 export const BookmarkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

 export const ArchiveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const PublishIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 8 12 16" />
    <polyline points="8 12 12 8 16 12" />
  </svg>
);

export const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
); 

