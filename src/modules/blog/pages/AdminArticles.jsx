import React, { useState } from "react"; 
import { deleteArticle } from "../services/blog.service"; 
import { getArticlesWithDetails } from "../services/blog.service";






const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ArchiveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const PublishIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 8 12 16" />
    <polyline points="8 12 12 8 16 12" />
  </svg>
);

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const TypeBadge = ({ type }) => {
  const styles = {
    BLOG: "text-blue-500 bg-blue-50 border border-blue-200",
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
    DRAFT: "text-amber-600 bg-amber-50 border border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
};

const AdminArticles = () => {   

  const handleDeleteArticle = (id) => {
  const updated = deleteArticle(id);
  setArticles(updated);
}; 

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All"); 
  const [articles, setArticles] = useState(getArticlesWithDetails());
  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || a.type === typeFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  }); 
  

  return (
    <div className="w-full bg-white rounded-xl shadow-sm font-sans">

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
              {/* Title */}
              <td className="px-4 py-4">
                <div className="font-semibold text-sm text-gray-900 truncate">{article.title}</div>
                <div className="text-xs text-gray-400 truncate mt-0.5">{article.description}</div>
              </td>

              {/* Type */}
              <td className="px-4 py-4">
                <TypeBadge type={article.type} />
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <StatusBadge status={article.status} />
              </td>

              {/* Tags */}
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1">
                  {article.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-0.5 rounded-full text-xs text-gray-500 bg-gray-100 truncate">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>

              {/* Likes */}
              <td className="px-4 py-4">
                <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                  <HeartIcon /> {article.likes}
                </span>
              </td>

              {/* Saves */}
              <td className="px-4 py-4">
                <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                  <BookmarkIcon /> {article.saves}
                </span>
              </td>

              {/* Actions */}
              <td className="px-4 py-4 ">
                <div className="flex items-center gap-4">
                  <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap">
                    <EditIcon /> Edit
                  </button>

                  {article.status === "PUBLISHED" ? (
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap">
                      <ArchiveIcon /> Archive
                    </button>
                  ) : (
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-green-600 bg-white border border-green-500 hover:bg-green-50 transition-colors cursor-pointer whitespace-nowrap">
                      <PublishIcon /> Publish
                    </button>
                  )}

<button
onClick={() => handleDeleteArticle(article.article_id)}
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
    </div>
  );
};

export default AdminArticles;