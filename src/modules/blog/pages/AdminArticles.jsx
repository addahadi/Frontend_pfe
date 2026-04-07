import React, { useState } from "react"; 
import { deleteArticle } from "../services/blog.service"; 
import { getArticlesWithDetails } from "../services/blog.service";
import { HeartIcon, BookmarkIcon, EditIcon,ArchiveIcon, TrashIcon , PublishIcon, SearchIcon } from "../components/component";







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
  
  // ✅ الصحيح — احذف ثم اجلب البيانات المنسّ قة
const handleDeleteArticle = (id) => {
  deleteArticle(id);
  setArticles(getArticlesWithDetails()); // ← بيانات كاملة
};

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