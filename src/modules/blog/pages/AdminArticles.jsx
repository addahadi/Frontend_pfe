import React, { useState } from "react"; 
import { deleteArticle, updateArticle } from "../services/blog.service"; 
import { getArticlesWithDetails } from "../services/blog.service";
import { HeartIcon, BookmarkIcon, EditIcon, ArchiveIcon, TrashIcon, PublishIcon, SearchIcon } from "../components/component";

// ═══════════════════════════════════════════════════════════════════════════════
// Confirm Delete Dialog
// ═══════════════════════════════════════════════════════════════════════════════
const ConfirmDialog = ({ article, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[popIn_0.2s_ease-out]">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>

        {/* Text */}
        <h3 className="text-center text-gray-900 font-bold text-base mb-1">
          Delete Article?
        </h3>
        <p className="text-center text-gray-500 text-sm mb-1">
          You are about to delete:
        </p>
        <p className="text-center text-gray-800 font-semibold text-sm mb-5 px-2 truncate">
          "{article.title}"
        </p>
        <p className="text-center text-red-500 text-xs mb-6">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Yes, Delete
          </button>
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
const TypeBadge = ({ type }) => {
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

const StatusBadge = ({ status }) => {
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
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
const AdminArticles = () => {
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [articles, setArticles]         = useState(getArticlesWithDetails());
  const [confirmTarget, setConfirmTarget] = useState(null);

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All" || a.type === typeFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleDeleteConfirmed = () => {
    deleteArticle(confirmTarget.article_id);
    setArticles(getArticlesWithDetails());
    setConfirmTarget(null);
  };

  const handleToggleStatus = (article) => {
    const newStatus = article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    updateArticle(article.article_id, { status: newStatus });
    setArticles(getArticlesWithDetails());
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm font-sans">

      {/* Confirm Dialog */}
      {confirmTarget && (
        <ConfirmDialog
          article={confirmTarget}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {/* ── Top Bar ── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50 outline-none focus:border-gray-400 focus:bg-white transition-colors"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none cursor-pointer focus:border-gray-400 transition-colors"
        >
          <option>All</option>
          <option>BLOG</option>
          <option>ACTUALITE</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none cursor-pointer focus:border-gray-400 transition-colors"
        >
          <option>All</option>
          <option>PUBLISHED</option>
          <option>DRAFT</option>
        </select>
      </div>

      {/* ── Table ── */}
      <table className="w-full border-collapse table-fixed">
        <colgroup>
          <col style={{ width: "26%" }} />
          <col style={{ width: "9%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "28%" }} />
        </colgroup>

        <thead>
          <tr className="bg-gray-50">
            {["Title", "Type", "Status", "Tags", "Likes", "Saves", "Actions"].map((col) => (
              <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 border-b border-gray-100">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filtered.map((article, idx) => (
            <tr
              key={article.article_id}
              className={`hover:bg-gray-50 transition-colors ${idx < filtered.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <td className="px-4 py-4">
                <div className="font-semibold text-sm text-gray-900 truncate">{article.title}</div>
                <div className="text-xs text-gray-400 truncate mt-0.5">{article.description}</div>
              </td>
              <td className="px-4 py-4"><TypeBadge type={article.type} /></td>
              <td className="px-4 py-4"><StatusBadge status={article.status} /></td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1">
                  {article.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-0.5 rounded-full text-xs text-gray-500 bg-gray-100 truncate">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4">
                <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                  <HeartIcon /> {article.likes}
                </span>
              </td>
              <td className="px-4 py-4">
                <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                  <BookmarkIcon /> {article.saves}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-4">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap">
                    <EditIcon /> Edit
                  </button>

                  {article.status === "PUBLISHED" ? (
                    <button
                      onClick={() => handleToggleStatus(article)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <ArchiveIcon /> Archive
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(article)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-green-600 bg-white border border-green-500 hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <PublishIcon /> Publish
                    </button>
                  )}

                  {/* Delete — opens confirm dialog */}
                  <button
                    onClick={() => setConfirmTarget(article)}
                    className="inline-flex items-center justify-center w-10 h-7 rounded-md text-red-500 bg-white border border-red-200 hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-400 text-sm">
          No articles found.
        </div>
      )}
    </div>
  );
};

export default AdminArticles;