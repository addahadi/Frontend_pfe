import React, { useState, useEffect, useCallback } from "react";
import {
  fetchAdminArticles,
  deleteArticleApi,
  updateArticleApi,
  fetchArticleById,
  fetchArticleTypes,
} from "../services/blog.service";
import {
  HeartIcon,
  BookmarkIcon,
  EditIcon,
  ArchiveIcon,
  TrashIcon,
  PublishIcon,
  SearchIcon,
} from "../components/component";
import ArticleEditor from "./ArticleEditor";
import { TypeBadge } from "../components/component";
import { StatusBadge } from "../components/component";
import { AlertTriangle, Trash2, Loader2, CheckCircle2 } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// ConfirmDialog
// ─────────────────────────────────────────────────────────────────────────────
const ConfirmDialog = ({ article, onConfirm, onCancel }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      setIsDone(true);
    } catch {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-[fadeSlideUp_0.2s_ease-out]">
        {isDeleting && !isDone && (
          <div className="absolute top-0 left-0 h-1 bg-red-500 animate-[progress_1.5s_ease-in-out_infinite]" />
        )}

        <div className="p-6">
          {isDone ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center animate-[popIn_0.3s_ease-out]">
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700">Article deleted successfully</p>
            </div>
          ) : isDeleting ? (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative w-14 h-14">
                <svg className="absolute inset-0 animate-spin w-14 h-14 text-red-400" viewBox="0 0 56 56" fill="none">
                  <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="3" strokeDasharray="100 52" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trash2 size={20} className="text-red-500 animate-pulse" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800">Deleting article…</p>
                <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">{article?.title_en || article?.title}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Delete Article</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-700">"{article?.title_en || article?.title}"</span>?
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-sm shadow-red-200">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popIn {
          0%   { transform: scale(0); }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes progress {
          0%   { width: 0%; }
          50%  { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const AdminArticles = () => {
  const [search, setSearch]             = useState("");
  const [typeFilter, setTypeFilter]     = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [articles, setArticles]         = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [confirmTarget, setConfirmTarget]                 = useState(null);
  const [editingArticle, setEditingArticle]               = useState(null);
  const [forceEditorValidation, setForceEditorValidation] = useState(false);
  const [togglingIds, setTogglingIds]   = useState(new Set());

  // ── Article types from DB (for the filter dropdown) ──────────────────────
  const [articleTypes, setArticleTypes] = useState([]);

  useEffect(() => {
    fetchArticleTypes()
      .then(setArticleTypes)
      .catch((err) => console.error("Failed to load article types:", err));
  }, []);

  // ── Load articles ─────────────────────────────────────────────────────────
  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAdminArticles("ALL");
      setArticles(res.data);
    } catch (err) {
      setError(err.message || "Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadArticles(); }, [loadArticles]);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = articles.filter((a) => {
    const matchSearch = (a.title_en || a.title || "").toLowerCase().includes(search.toLowerCase());
    // Compare against type_name_en from DB — no hardcoded UUIDs
    const matchType = typeFilter === "All" || (a.type_name_en || a.type || "") === typeFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirmed = async () => {
    await deleteArticleApi(confirmTarget.article_id);
    await new Promise((r) => setTimeout(r, 900));
    setConfirmTarget(null);
    await loadArticles();
  };

  // ── Publish readiness check ───────────────────────────────────────────────
  const isArticleReadyForPublish = (article) => {
    const titleEn = article.title_en || article.title || "";
    const hasTitleEn = titleEn.trim().length >= 3;
    const excerptEn = article.excerpt_en || article.excerpt || "";
    const hasExcerptEn = String(excerptEn).trim().length > 0;
    const hasCoverImage =
      typeof article.cover_img === "string" &&
      article.cover_img.trim() !== "" &&
      !article.cover_img.startsWith("blob:");

    const missing = [];
    if (!hasTitleEn) missing.push("Title (min 3 chars)");
    if (!hasExcerptEn) missing.push("Excerpt");
    if (!hasCoverImage) missing.push("Cover image");

    return {
      hasTitleEn,
      hasExcerptEn,
      hasCoverImage,
      isIncomplete: missing.length > 0,
      missing,
    };
  };

  // ── Toggle status ─────────────────────────────────────────────────────────
  const handleToggleStatus = async (article) => {
    if (article.status === "PUBLISHED") {
      setTogglingIds((prev) => new Set(prev).add(article.article_id));
      try {
        await updateArticleApi(article.article_id, { status: "DRAFT" });
        setArticles((prev) =>
          prev.map((a) =>
            a.article_id === article.article_id ? { ...a, status: "DRAFT" } : a
          )
        );
      } catch (err) {
        setError(err.message || "Failed to archive article");
      } finally {
        setTogglingIds((prev) => { const s = new Set(prev); s.delete(article.article_id); return s; });
      }
      return;
    }

    const checks = isArticleReadyForPublish(article);
    if (checks.isIncomplete) {
      setForceEditorValidation(true);
      setEditingArticle({ ...article, _missingFields: checks.missing });
      return;
    }

    setTogglingIds((prev) => new Set(prev).add(article.article_id));
    try {
      await updateArticleApi(article.article_id, { status: "PUBLISHED" });
      setArticles((prev) =>
        prev.map((a) =>
          a.article_id === article.article_id ? { ...a, status: "PUBLISHED" } : a
        )
      );
    } catch (err) {
      setError(null);
      const fullArticle = await fetchArticleById(article.article_id).catch(() => article);
      setForceEditorValidation(true);
      setEditingArticle(fullArticle);
    } finally {
      setTogglingIds((prev) => { const s = new Set(prev); s.delete(article.article_id); return s; });
    }
  };

  const handleCompleteFromList = async (article) => {
    setIsLoading(true);
    try {
      const full = await fetchArticleById(article.article_id);
      setForceEditorValidation(true);
      setEditingArticle(full);
    } catch (err) {
      setError(err.message || "Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (article) => {
    setForceEditorValidation(false);
    setIsLoading(true);
    try {
      const fullArticle = await fetchArticleById(article.article_id);
      setEditingArticle(fullArticle);
    } catch (err) {
      setError(err.message || "Failed to load article for editing");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorClose = async () => {
    setEditingArticle(null);
    setForceEditorValidation(false);
    await loadArticles();
  };

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
      {confirmTarget && (
        <ConfirmDialog
          article={confirmTarget}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setConfirmTarget(null)}
        />
      )}

      {error && (
        <div className="mx-4 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <AlertTriangle size={14} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Filters */}
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

        {/* Type filter — dynamic from DB */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none cursor-pointer focus:border-gray-400 transition-colors"
        >
          <option value="All">All Types</option>
          {articleTypes.map((t) => (
            <option key={t.article_type_id || t.id} value={t.name_en}>
              {t.name_en}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white outline-none cursor-pointer focus:border-gray-400 transition-colors"
        >
          <option value="All">All Statuses</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          <svg className="animate-spin mx-auto mb-3" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading articles…
        </div>
      ) : (
        <>
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
                const checks     = isArticleReadyForPublish(article);
                const isToggling = togglingIds.has(article.article_id);
                const displayTitle   = article.title_en || article.title || "Untitled";
                const displayExcerpt = article.excerpt_en || article.excerpt || "";
                // type_name_en comes directly from DB via LEFT JOIN — no hardcoding
                const displayType    = article.type_name_en || article.type || null;

                return (
                  <tr
                    key={article.article_id}
                    className={`hover:bg-gray-50 transition-colors ${idx < filtered.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="font-semibold text-sm text-gray-900 truncate flex items-center gap-2">
                        {displayTitle}
                        {article.status === "DRAFT" && checks.isIncomplete && (
                          <span title={`Missing: ${checks.missing.join(", ")}`}>
                            <AlertTriangle className="text-yellow-500 flex-shrink-0" size={14} />
                          </span>
                        )}
                        {article.status === "DRAFT" && !checks.isIncomplete && (
                          <span title="Ready to publish">
                            <CheckCircle2 className="text-green-400 flex-shrink-0" size={14} />
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">
                        {displayExcerpt || "No excerpt"}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {displayType ? (
                        <TypeBadge type={displayType} />
                      ) : (
                        <span className="text-xs text-gray-300 italic">—</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <StatusBadge status={article.status} />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        {(article.tagObjects || article.tags?.filter((t) => typeof t === "object") || [])
                          .slice(0, 2)
                          .map((tag) => (
                            <span key={tag.tag_id || tag.id} className="inline-block px-2 py-0.5 rounded-full text-xs text-gray-500 bg-gray-100 truncate">
                              {tag.name_en || tag.name}
                            </span>
                          ))}
                        {(article.tagObjects || []).length > 2 && (
                          <span className="text-xs text-gray-400">+{article.tagObjects.length - 2} more</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                        <HeartIcon /> {article.likesCount ?? 0}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-gray-500 text-xs font-medium">
                        <BookmarkIcon /> {article.savesCount ?? 0}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(article)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <EditIcon /> Edit
                        </button>

                        {isToggling ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-gray-400 border border-gray-200 bg-gray-50 whitespace-nowrap">
                            <Loader2 size={11} className="animate-spin" />
                            Please wait…
                          </span>
                        ) : article.status === "PUBLISHED" ? (
                          <button
                            onClick={() => handleToggleStatus(article)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors whitespace-nowrap"
                          >
                            <ArchiveIcon /> Archive
                          </button>
                        ) : checks.isIncomplete ? (
                          <button
                            onClick={() => handleCompleteFromList(article)}
                            title={`Missing: ${checks.missing.join(", ")}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-orange-600 border border-orange-400 bg-orange-50 hover:bg-orange-100 transition-colors whitespace-nowrap"
                          >
                            <PublishIcon /> Complete
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(article)}
                            title="Publish this article"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-green-600 border border-green-500 bg-white hover:bg-green-50 transition-colors whitespace-nowrap"
                          >
                            <PublishIcon /> Publish
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

          {filtered.length === 0 && !isLoading && (
            <div className="py-16 text-center text-gray-400 text-sm">No articles found.</div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminArticles;