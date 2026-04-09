import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { getTags, addTag, deleteTag } from '../services/blog.service';

const Tags = () => {

  const [tags, setTags] = useState(getTags());
  const [newTagName, setNewTagName] = useState("");

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteTag = (id) => {
    deleteTag(id);
    // ✅ spread into a new array so React sees a new reference → triggers re-render
    setTags([...getTags()]);
  };

  // ── Add ──────────────────────────────────────────────────────────────────────
  const handleAddTag = () => {
    if (newTagName.trim() === "") return;
    addTag(newTagName.trim());
    setTags([...getTags()]);
    setNewTagName("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">

      {/* ── Input ── */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          placeholder="New tag name..."
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
        <button
          onClick={handleAddTag}
          className="bg-[#1D4ED8] hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Tag
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 bg-opacity-50">
            <tr className="border-b border-gray-50 text-gray-400 text-sm">
              <th className="px-6 py-4 font-medium">Tag Name</th>
              <th className="px-6 py-4 font-medium text-center">ID</th>
              <th className="px-6 py-4 font-medium text-center">Used in</th>
              <th className="px-6 py-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50 transition-colors">

                {/* Name */}
                <td className="px-6 py-4 font-bold text-gray-800">
                  {tag.name}
                </td>

                {/* ID */}
                <td className="px-6 py-4 text-center text-gray-300 font-mono text-sm">
                  {tag.id}
                </td>

                {/* Count */}
                <td className="px-6 py-4 text-center">
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    tag.count > 0
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {tag.count} {tag.count === 1 ? 'article' : 'articles'}
                  </span>
                </td>

                {/* Delete */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-all text-sm font-bold"
                  >
                    {tag.count > 0 ? <AlertTriangle size={16} /> : <Trash2 size={16} />}
                    Delete
                  </button>
                </td>

              </tr>
            ))}

            {tags.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                  No tags yet. Add your first tag above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tags;