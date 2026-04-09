import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Trash2, AlertTriangle, X } from 'lucide-react';
import { getTags, addTag, deleteTag } from '../services/blog.service';

// ═══════════════════════════════════════════════════════════════════════════════
// Confirm Dialog Component (مستخرج ليكون قابلاً لإعادة الاستخدام)
// ═══════════════════════════════════════════════════════════════════════════════
const ConfirmDialog = ({ title, message, subMessage, confirmText, cancelText, onConfirm, onCancel, isDanger = true }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />

      {/* Dialog Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[popIn_0.2s_ease-out]">
        {/* Icon */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full mx-auto mb-4 ${isDanger ? 'bg-red-100' : 'bg-blue-100'}`}>
          {isDanger ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          ) : (
            <AlertTriangle size={22} className="text-blue-500" />
          )}
        </div>

        {/* Text */}
        <h3 className="text-center text-gray-900 font-bold text-base mb-1">
          {title}
        </h3>
        <p className="text-center text-gray-500 text-sm mb-1">
          {message}
        </p>
        {subMessage && (
          <p className="text-center text-gray-800 font-semibold text-sm mb-5 px-2 truncate">
            "{subMessage}"
          </p>
        )}
        
        <p className={`text-center text-xs mb-6 ${isDanger ? 'text-red-500' : 'text-gray-400'}`}>
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${
              isDanger 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {confirmText || "Confirm"}
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
// Main Tags Component
// ═══════════════════════════════════════════════════════════════════════════════
const Tags = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [newTagName, setNewTagName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // حالة الـ Dialog
  const [confirmDialog, setConfirmDialog] = useState(null); // { type: 'delete', tag: tagObject }

  const tags = useMemo(() => getTags(), [refreshKey]);

  const handleDeleteClick = useCallback((tag) => {
    if (tag.count > 0) {
      // إذا كان التاغ مستخدماً، نظهر تحذير خاص
      setConfirmDialog({
        type: 'warning',
        tag: tag,
        title: 'Cannot Delete Tag',
        message: `This tag is used in ${tag.count} article(s).`,
        subMessage: tag.name,
        confirmText: 'I Understand',
        cancelText: 'Close',
        isDanger: false
      });
    } else {
      // تأكيد الحذف العادي
      setConfirmDialog({
        type: 'delete',
        tag: tag,
        title: 'Delete Tag?',
        message: 'You are about to delete:',
        subMessage: tag.name,
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        isDanger: true
      });
    }
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!confirmDialog?.tag) return;
    
    setIsLoading(true);
    try {
      deleteTag(confirmDialog.tag.id);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error deleting tag:', error);
      alert('Failed to delete tag');
    } finally {
      setIsLoading(false);
      setConfirmDialog(null);
    }
  }, [confirmDialog]);

  const handleAddTag = useCallback(() => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    
    // التحقق من عدم التكرار
    const exists = tags.some(t => t.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setConfirmDialog({
        type: 'warning',
        title: 'Tag Already Exists',
        message: `A tag with the name "${trimmed}" already exists.`,
        subMessage: null,
        confirmText: 'OK',
        cancelText: null, // لا زر إلغاء هنا
        isDanger: false,
        onConfirm: () => setConfirmDialog(null)
      });
      return;
    }

    try {
      addTag(trimmed);
      setRefreshKey(prev => prev + 1);
      setNewTagName("");
    } catch (error) {
      console.error('Error adding tag:', error);
      setConfirmDialog({
        type: 'error',
        title: 'Error',
        message: 'Failed to add tag. Please try again.',
        confirmText: 'OK',
        cancelText: null,
        isDanger: true,
        onConfirm: () => setConfirmDialog(null)
      });
    }
  }, [newTagName, tags]);

  // إغلاق الـ Dialog
  const closeDialog = useCallback(() => {
    setConfirmDialog(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* ── Confirm Dialog ── */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          subMessage={confirmDialog.subMessage}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          isDanger={confirmDialog.isDanger}
          onConfirm={confirmDialog.onConfirm || (confirmDialog.type === 'delete' ? handleConfirmDelete : closeDialog)}
          onCancel={closeDialog}
        />
      )}

      {/* ── Input ── */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          placeholder="New tag name..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm disabled:opacity-50 transition-all"
        />
        <button
          onClick={handleAddTag}
          disabled={isLoading || !newTagName.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all active:scale-95 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          <Plus size={20} />
          Add Tag
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Tag Name</th>
              <th className="px-6 py-4 font-semibold text-center w-32">ID</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Used in</th>
              <th className="px-6 py-4 font-semibold text-center w-32">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {tag.name}
                </td>
                <td className="px-6 py-4 text-center text-gray-400 font-mono text-xs">
                  {tag.id}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                    tag.count > 0
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {tag.count || 0} {tag.count === 1 ? 'article' : 'articles'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteClick(tag)}
                    disabled={isLoading}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                      tag.count > 0
                        ? 'border-amber-200 text-amber-600 hover:bg-amber-50 cursor-help'
                        : 'border-red-200 text-red-600 hover:bg-red-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {tag.count > 0 ? <AlertTriangle size={14} /> : <Trash2 size={14} />}
                    {tag.count > 0 ? 'In Use' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}

            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Plus className="text-gray-400" size={32} />
                    </div>
                    <p className="text-sm font-medium">No tags yet</p>
                    <p className="text-xs text-gray-400">Add your first tag above</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Helper Text ── */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <span>Tags in use cannot be deleted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <span>Available for deletion</span>
        </div>
      </div>
    </div>
  );
};

export default Tags;