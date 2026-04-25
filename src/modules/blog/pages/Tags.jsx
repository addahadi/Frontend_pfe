import React, { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Tag } from "lucide-react";
import { fetchTags, createTagApi, deleteTagApi } from "../services/blog.service";

// ═══════════════════════════════════════════════════════════════════════════════
// Confirm Dialog
// ═══════════════════════════════════════════════════════════════════════════════
const ConfirmDialog = ({
  title,
  message,
  subMessage,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDanger = true,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    />
    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[popIn_0.2s_ease-out]">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${
          isDanger ? "bg-red-100" : "bg-amber-100"
        }`}
      >
        {isDanger ? (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        ) : (
          <AlertTriangle size={22} className="text-amber-500" />
        )}
      </div>
      <h3 className="text-center text-gray-900 font-bold text-base mb-1">
        {title}
      </h3>
      <p className="text-center text-gray-500 text-sm mb-1">{message}</p>
      {subMessage && (
        <p className="text-center text-gray-800 font-semibold text-sm mb-5 px-2 truncate">
          "{subMessage}"
        </p>
      )}
      <p
        className={`text-center text-xs mb-6 ${
          isDanger ? "text-red-500" : "text-gray-400"
        }`}
      >
        This action cannot be undone.
      </p>
      <div className="flex gap-3">
        {cancelText && (
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
        )}
        <button
          onClick={onConfirm}
          className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
            isDanger
              ? "bg-red-500 hover:bg-red-600"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          {confirmText || "Confirm"}
        </button>
      </div>
    </div>
    <style>{`
      @keyframes popIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
    `}</style>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Tags Component
// ═══════════════════════════════════════════════════════════════════════════════
const Tags = () => {
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState(null);
  const [newTagNameEn, setNewTagNameEn] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null);

  // ── Load tags from backend ──────────────────────────────────────────────────
  const loadTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTags();
      setTags(data);
    } catch (err) {
      setError(err.message || "Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const closeDialog = useCallback(() => setConfirmDialog(null), []);

  // ── Delete flow ─────────────────────────────────────────────────────────────
  const handleDeleteClick = useCallback(
    (tag) => {
      if (tag.count > 0) {
        setConfirmDialog({
          type: "warning",
          tag,
          title: "Tag In Use",
          message: `"${tag.name}" is used in ${tag.count} article${
            tag.count !== 1 ? "s" : ""
          }.`,
          subMessage: null,
          confirmText: "OK",
          cancelText: null,
          isDanger: false,
          onConfirm: closeDialog,
        });
      } else {
        setConfirmDialog({
          type: "delete",
          tag,
          title: "Delete Tag?",
          message: "You are about to delete:",
          subMessage: tag.name,
          confirmText: "Yes, Delete",
          cancelText: "Cancel",
          isDanger: true,
        });
      }
    },
    [closeDialog]
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDialog?.tag) return;
    setIsMutating(true);
    try {
      await deleteTagApi(confirmDialog.tag.id);
      await loadTags();
    } catch (err) {
      setError(err.message || "Failed to delete tag");
    } finally {
      setIsMutating(false);
      setConfirmDialog(null);
    }
  }, [confirmDialog, loadTags]);

  // ── Add tag ──────────────────────────────────────────────────────────────────
  const handleAddTag = useCallback(async () => {
    const trimmedEn = newTagNameEn.trim();
    if (!trimmedEn) return;

    const exists = tags.some(
      (t) => (t.name_en || t.name).toLowerCase() === trimmedEn.toLowerCase()
    );
    if (exists) {
      setConfirmDialog({
        type: "warning",
        title: "Tag Already Exists",
        message: `"${trimmedEn}" already exists.`,
        subMessage: null,
        confirmText: "OK",
        cancelText: null,
        isDanger: false,
        onConfirm: closeDialog,
      });
      return;
    }

    setIsMutating(true);
    setError(null);
    try {
      await createTagApi(trimmedEn, trimmedEn);
      setNewTagNameEn("");
      await loadTags();
    } catch (err) {
      setError(err.message || "Failed to add tag");
    } finally {
      setIsMutating(false);
    }
  }, [newTagNameEn, tags, closeDialog, loadTags]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      {confirmDialog && (
        <ConfirmDialog
          {...confirmDialog}
          onConfirm={
            confirmDialog.onConfirm ||
            (confirmDialog.type === "delete" ? handleConfirmDelete : closeDialog)
          }
          onCancel={closeDialog}
        />
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
          <AlertTriangle size={14} />
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800">Manage Tags</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          {tags.length} tag{tags.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* ── Input ──────────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={newTagNameEn}
            onChange={(e) => setNewTagNameEn(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="New tag name…"
            disabled={isMutating}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm disabled:opacity-50 transition-all text-sm"
          />
        </div>
        <button
          onClick={handleAddTag}
          disabled={isMutating || !newTagNameEn.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm text-sm"
        >
          {isMutating ? (
            <svg
              className="animate-spin"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <Plus size={16} />
          )}
          Add Tag
        </button>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-5 py-3.5 font-semibold">Tag Name</th>
              <th className="px-5 py-3.5 font-semibold text-center w-36">Used in</th>
              <th className="px-5 py-3.5 font-semibold text-center w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-5 py-12 text-center text-gray-400">
                  <svg
                    className="animate-spin mx-auto mb-2"
                    width={22}
                    height={22}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <span className="text-sm">Loading tags…</span>
                </td>
              </tr>
            ) : (
              tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex-shrink-0">
                        <Tag size={13} />
                      </span>
                      <span className="font-medium text-gray-800 text-sm">
                        {tag.name_en || tag.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        tag.count > 0
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-gray-100 text-gray-400 border-gray-200"
                      }`}
                    >
                      {tag.count} {tag.count === 1 ? "article" : "articles"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleDeleteClick(tag)}
                      disabled={isMutating}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        tag.count > 0
                          ? "border-amber-200 text-amber-600 hover:bg-amber-50 cursor-help"
                          : "border-red-200 text-red-500 hover:bg-red-50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {tag.count > 0 ? (
                        <AlertTriangle size={13} />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      {tag.count > 0 ? "In Use" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}

            {!isLoading && tags.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-14 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                      <Tag className="text-gray-300" size={26} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No tags yet</p>
                    <p className="text-xs text-gray-400">Add your first tag above</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────────────── */}
      {tags.length > 0 && (
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Tags in use cannot be deleted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span>Available for deletion</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;