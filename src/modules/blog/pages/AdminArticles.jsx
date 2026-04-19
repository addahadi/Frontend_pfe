import React, { useState } from "react"; 
import { deleteArticle, updateArticle } from "../services/blog.service"; 
import { getArticlesWithDetails } from "../services/blog.service";
import { HeartIcon, BookmarkIcon, EditIcon, ArchiveIcon, TrashIcon, PublishIcon, SearchIcon,} from "../components/component";
import ArticleEditor from "./ArticleEditor";
import { ConfirmDialog } from "../components/component";
import { TypeBadge } from "../components/component";
import { StatusBadge } from "../components/component"; 
import { AlertTriangle } from "lucide-react";

const AdminArticles = () => {  
  
  const [search, setSearch]               = useState("");
  const [typeFilter, setTypeFilter]       = useState("All");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [articles, setArticles]           = useState(getArticlesWithDetails());
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [forceEditorValidation, setForceEditorValidation] = useState(false);

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

  // Check if article has all required fields for publishing
  const isArticleComplete = (article) => {
    const hasContent = article.content && 
                       article.content !== "" && 
                       article.content !== "{}" &&
                       article.content !== "null" &&
                       article.content !== "undefined";
    
    const hasExcerpt = (article.excerpt && article.excerpt.trim() !== "") || 
                       (article.description && article.description.trim() !== "");
    
    const hasCoverImage = article.cover_img && article.cover_img !== "";
    
    return { hasContent, hasExcerpt, hasCoverImage, isComplete: hasContent && hasExcerpt && hasCoverImage };
  };

  // Handle publish button click from list
  const handlePublishFromList = (article) => {
    const checks = isArticleComplete(article);
    
    if (!checks.isComplete) {
      // Open editor with validation errors shown
      setForceEditorValidation(true);
      setEditingArticle(article);
    } else {
      // Proceed with publish immediately
      handleToggleStatus(article);
    }
  };

  // Handle edit button click
  const handleEdit = (article) => {
    setForceEditorValidation(false);
    setEditingArticle(article);
  };

  const handleEditorClose = () => {
    setEditingArticle(null);
    setForceEditorValidation(false);
    setArticles(getArticlesWithDetails());
  };

  // If editing, render the editor fullscreen
  if (editingArticle) {
    return (
      <ArticleEditor
        articleToEdit={editingArticle}
        onClose={handleEditorClose}
        forceValidation={forceEditorValidation}
      />
    );
  }

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

      {/* Top Bar */}
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

      {/* Table */}
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
          {filtered.map((article, idx) => {
            const checks = isArticleComplete(article);
            const isIncomplete = !checks.isComplete && article.status === "DRAFT";
            
            return (
              <tr
                key={article.article_id}
                className={`hover:bg-gray-50 transition-colors ${idx < filtered.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <td className="px-4 py-4">
                  <div className="font-semibold text-sm text-gray-900 truncate flex items-center gap-2">
                    {article.title}
                    {isIncomplete && (
                      <span title="Missing required fields for publishing" className="text-orange-500"><AlertTriangle className="text-yellow-500" size={14} /></span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 truncate mt-0.5">
                    {article.excerpt || article.description || "No excerpt"}
                  </div>
                </td>
                <td className="px-4 py-4"><TypeBadge type={article.type} /></td>
                <td className="px-4 py-4"><StatusBadge status={article.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="inline-block px-2 py-0.5 rounded-full text-xs text-gray-500 bg-gray-100 truncate">
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-xs text-gray-400">+{article.tags.length - 2} more</span>
                    )}
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <EditIcon /> Edit
                    </button>

                    {article.status === "PUBLISHED" ? (
                      <button
                        onClick={() => handleToggleStatus(article)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <ArchiveIcon /> Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublishFromList(article)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                          checks.isComplete 
                            ? "text-green-600 border-green-500 hover:bg-green-50" 
                            : "text-orange-600 border-orange-500 hover:bg-orange-50"
                        }`}
                        title={checks.isComplete ? "Publish now" : "Complete required fields to publish"}
                      >
                        <PublishIcon /> {checks.isComplete ? "Publish" : "Complete"}
                      </button>
                    )}

                    <button
                      onClick={() => setConfirmTarget(article)}
                      className="inline-flex items-center justify-center w-8 h-7 rounded-md text-red-500 bg-white border border-red-200 hover:bg-red-50 hover:border-red-400 transition-colors cursor-pointer flex-shrink-0"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
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