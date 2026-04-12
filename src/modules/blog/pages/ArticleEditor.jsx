import React, { useState, useEffect } from "react";
import { getTags, createArticle, updateArticle } from "../services/blog.service"; 
import {Save, Globe, ImageIcon, X, Tag, ArrowLeft} from "lucide-react";
import { $getRoot } from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown"; 
import { ImageNode } from "../lexical/ImageNode.jsx";
import ImagePlugin from "../lexical/ImagePlugin"; 
import ToolbarPlugin from "../lexical/ToolbarPlugin"; 
import PreFillPlugin from "../lexical/PreFillPlugin";  
import { Toast } from "../components/component";
import { CharacterCountDisplay } from "../components/component"; 
import { TagSelector } from "../components/component";

const editorTheme = {
  heading: { h1: "editor-h1", h2: "editor-h2", h3: "editor-h3" },
  text: {
    bold: "font-bold", italic: "italic", underline: "underline",
    strikethrough: "line-through",
    superscript: "editor-superscript", subscript: "editor-subscript",
  },
  list: {
    ul: "editor-ul", ol: "editor-ol", listitem: "editor-listitem",
    nested: { listitem: "editor-nested-listitem" },
  },
  quote: "editor-quote", code: "editor-code-block",
  link: "editor-link", paragraph: "editor-paragraph",
};

const URL_REGEX = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const EMAIL_REGEX = /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const AUTO_LINK_MATCHERS = [
  (text) => { const m = URL_REGEX.exec(text); if (!m) return null; const f = m[0]; return { index: m.index, length: f.length, text: f, url: f.startsWith("http") ? f : `https://${f}` }; },
  (text) => { const m = EMAIL_REGEX.exec(text); if (!m) return null; const f = m[0]; return { index: m.index, length: f.length, text: f, url: `mailto:${f}` }; },
];

const ArticleEditor = ({ articleToEdit = null, onClose = null, forceValidation = false }) => { 

  
  const isEditMode = !!articleToEdit;

  const [availableTags] = useState(getTags()); 
  const [selectedTags, setSelectedTags] = useState(() => {
    if (!isEditMode) return [];
    const rawTags = articleToEdit.tag_ids ?? articleToEdit.tags ?? [];
    const allTags = getTags();
    const areIds = rawTags.every((t) => allTags.some((tag) => tag.id === t));
    if (areIds) return rawTags;
    return rawTags.map((name) => allTags.find((tag) => tag.name === name)?.id).filter(Boolean);
  });

  const [title, setTitle] = useState(isEditMode ? articleToEdit.title : "");
  const [excerpt, setExcerpt] = useState(isEditMode ? (articleToEdit.excerpt ?? articleToEdit.description ?? "") : "");
  const [type, setType] = useState(isEditMode ? articleToEdit.type : "BLOG");
  const [status, setStatus] = useState(isEditMode ? articleToEdit.status : "DRAFT");
  const [coverImage, setCoverImage] = useState(isEditMode ? articleToEdit.cover_img : null);
  const [editorState, setEditorState] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [editorKey, ] = useState(0); // Force re-render if needed

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Validation function
  const validateForPublish = (showMessages = true) => {
    const newErrors = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required for publishing";
    }
    
    if (!excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required for publishing";
    }
    
    if (!coverImage) {
      newErrors.coverImage = "Cover image is required for publishing";
    }
    
    // Check content
    if (editorState) {
      editorState.read(() => {
        const textContent = $getRoot().getTextContent().trim();
        if (!textContent) {
          newErrors.content = "Content is required for publishing";
        }
      });
    } else {
      // If no editor state yet, check if we have initial content from article
      if (!articleToEdit?.content || articleToEdit.content === "{}" || articleToEdit.content === "") {
        newErrors.content = "Content is required for publishing";
      }
    }

    setErrors(newErrors);
    
    if (showMessages && Object.keys(newErrors).length > 0) {
      showToast("Please complete all required fields before publishing", "error");
      
      // Scroll to first error after render
      setTimeout(() => {
        const errorElements = document.querySelectorAll('.border-red-500, .ring-red-500, .border-red-400');
        if (errorElements.length > 0) {
          errorElements[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Try to focus the input inside
          const input = errorElements[0].querySelector('input, textarea') || errorElements[0];
          if (input.focus) input.focus();
        }
      }, 100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle forceValidation from AdminArticles (when clicking Publish on incomplete article)
  useEffect(() => {
    if (forceValidation) {
      // Wait for editor to be ready
      const timer = setTimeout(() => {
        validateForPublish(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [forceValidation]);

  const slug = title.trim().toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
      if (errors.coverImage) setErrors(prev => ({...prev, coverImage: null}));
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    state.read(() => {
      const words = $getRoot().getTextContent().trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    });
    // Clear content error if user starts typing
    if (errors.content) {
      setErrors(prev => ({...prev, content: null}));
    }
  };

const handleSave = async (publish = false) => {
  setErrors({});
  
  if (publish && !validateForPublish(true)) {
    return;
  }

  setIsSaving(true);
  await new Promise((r) => setTimeout(r, 800));

  const payload = {
    title: title.trim(),
    slug: slug || "untitled",
    excerpt: excerpt.trim(),
    type,
    status: publish ? "PUBLISHED" : "DRAFT",
    tags: selectedTags,
    cover_img: coverImage || "",
    content: editorState ? JSON.stringify(editorState.toJSON()) : (articleToEdit?.content || ""),
  };

  if (isEditMode) {
    updateArticle(articleToEdit.article_id, payload);
  } else {
    createArticle(payload);
  }

  setIsSaving(false);

  // Fixed toast logic with proper type handling
  if (publish) {
    setStatus("PUBLISHED");
    showToast("🎉 Article published successfully!", "success");
  } else {
    // Fixed: Use info or draft type, and ensure isEditMode is checked correctly
    const action = isEditMode ? "updated" : "saved";
    showToast(`📝 Draft ${action} successfully!`, "draft");
  }
};

  const metaBtn = (active, colorClass) =>
    `px-4 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all duration-150 select-none ${
      active ? colorClass : "border-gray-200 text-gray-400 hover:border-gray-300"
    }`;

  const initialConfig = {
    namespace: "ArticleEditor",
    theme: editorTheme,
    onError: (err) => console.error(err),
    nodes: [
      HeadingNode, QuoteNode, ListNode, ListItemNode,
      CodeNode, CodeHighlightNode, AutoLinkNode, LinkNode, ImageNode,
    ],
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        .editor-h1 { font-size:2rem; font-weight:700; color:#111827; margin:1rem 0 .5rem; }
        .editor-h2 { font-size:1.5rem; font-weight:700; color:#1f2937; margin:.75rem 0 .4rem; }
        .editor-h3 { font-size:1.25rem; font-weight:600; color:#374151; margin:.6rem 0 .3rem; }
        .editor-paragraph { margin:.25rem 0; min-height:1.4em; }
        .editor-quote { border-left:4px solid #3b82f6; padding-left:1rem; font-style:italic; color:#6b7280; margin:.75rem 0; }
        .editor-code-block { display:block; background:#1e1e2e; color:#cdd6f4; font-family:monospace; font-size:.85rem; padding:1rem 1.25rem; border-radius:.75rem; margin:.75rem 0; white-space:pre; overflow-x:auto; }
        .editor-ul { list-style-type:disc; padding-left:1.5rem; margin:.5rem 0; }
        .editor-ol { list-style-type:decimal; padding-left:1.5rem; margin:.5rem 0; }
        .editor-listitem { margin:.2rem 0; }
        .editor-nested-listitem::before { display:none; }
        .editor-link { color:#2563eb; text-decoration:underline; cursor:pointer; }
        .editor-link:hover { color:#1d4ed8; }
        [contenteditable]:focus { outline:none; }
        .editor-placeholder { position:absolute; top:0; left:0; right:0; pointer-events:none; color:#9ca3af; }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

          {/* Back button */}
          {isEditMode && onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Articles
            </button>
          )}

          {/* Edit mode banner */}
          {isEditMode && (
            <div className="mb-6 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
              <span className="font-semibold">Editing:</span>
              <span className="truncate font-medium text-blue-900">{articleToEdit.title}</span>
              <span className="ml-auto text-xs text-blue-400 font-mono">{articleToEdit.article_id}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* LEFT — Editor */}
            <div className="lg:col-span-2 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors(prev => ({...prev, title: null}));
                  }}
                  placeholder="Enter your article title…"
                  className={`w-full border rounded-xl px-4 py-2.5 text-gray-900 text-lg font-medium placeholder-gray-400 transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-pulse">
                    <span>●</span> {errors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Slug <span className="font-normal text-gray-400 text-xs">(auto-generated)</span>
                </label>
                <div className="flex items-center gap-2 border border-gray-100 rounded-xl px-4 py-2.5 bg-gray-100">
                  <span className="text-gray-400 text-sm">/articles/</span>
                  <span className="text-gray-500 text-sm font-mono truncate">{slug || "your-article-title"}</span>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Excerpt <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={excerpt} 
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    if (errors.excerpt) setErrors(prev => ({...prev, excerpt: null}));
                  }}
                  rows={3} 
                  maxLength={200} 
                  placeholder="Short summary shown in article previews…"
                  className={`w-full border rounded-xl px-4 py-2.5 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all ${
                    errors.excerpt ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                />
                <div className="flex justify-between mt-0.5">
                  {errors.excerpt ? (
                    <p className="text-red-500 text-xs flex items-center gap-1 animate-pulse">
                      <span>●</span> {errors.excerpt}
                    </p>
                  ) : <span></span>}
                  <p className="text-xs text-gray-400">{excerpt.length}/200</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <div className={`rounded-xl overflow-hidden transition-all ${errors.content ? 'ring-2 ring-red-500' : ''}`}>
                  <LexicalComposer initialConfig={initialConfig} key={editorKey}>
                    <div className="border border-gray-200 rounded-xl shadow-sm overflow-visible bg-white">
                      <ToolbarPlugin />
                      <div className="relative rounded-b-xl">
                        <RichTextPlugin
                          contentEditable={
                            <ContentEditable className="min-h-[320px] max-h-[600px] overflow-y-auto px-5 py-4 text-gray-800 leading-relaxed outline-none" />
                          }
                          placeholder={
                            <div className="editor-placeholder px-5 py-4 text-gray-400 pointer-events-none">
                              Start writing your article… (Markdown shortcuts supported)
                            </div>
                          }
                          ErrorBoundary={LexicalErrorBoundary}
                        />
                        <HistoryPlugin />
                        <AutoFocusPlugin />
                        <ListPlugin />
                        <CheckListPlugin />
                        <LinkPlugin />
                        <AutoLinkPlugin matchers={AUTO_LINK_MATCHERS} />
                        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                        <OnChangePlugin onChange={handleEditorChange} />
                        <ImagePlugin />
                        {isEditMode && articleToEdit?.content && (
                          <PreFillPlugin initialContent={articleToEdit.content} />
                        )}
                      </div>
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100 rounded-b-xl text-xs text-gray-400">
                        <span>{wordCount} words</span>
                        <CharacterCountDisplay limit={10000} />
                      </div>
                    </div>
                  </LexicalComposer>
                </div>
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-pulse">
                    <span>●</span> {errors.content}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button 
                  onClick={() => handleSave(false)} 
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
                >
                  {isSaving ? (
                    <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : <Save size={16} />}
                  {isEditMode ? "Update Draft" : "Save Draft"}
                </button>

                <button 
                  onClick={() => handleSave(true)} 
                  disabled={isSaving}
                  className="flex items-center gap-2 border-2 border-green-500 text-green-600 px-5 py-2.5 rounded-xl font-medium hover:bg-green-50 active:scale-95 transition-all disabled:opacity-60"
                >
                  <Globe size={16} /> {isEditMode ? "Update & Publish" : "Publish"}
                </button>

                <button 
                  onClick={() => onClose ? onClose() : window.history.back()}
                  className="flex items-center gap-2 text-gray-500 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* RIGHT — Sidebar */}
            <div className="space-y-5">

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">Metadata</h3>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Type</p>
                  <div className="flex gap-2">
                    <button onClick={() => setType("BLOG")} className={metaBtn(type === "BLOG", "border-blue-300 bg-blue-50 text-blue-700")}>Blog</button>
                    <button onClick={() => setType("ACTUALITE")} className={metaBtn(type === "ACTUALITE", "border-purple-300 bg-purple-50 text-purple-700")}>Actualité</button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>
                  <div className="flex gap-2">
                    <button onClick={() => setStatus("DRAFT")} className={metaBtn(status === "DRAFT", "border-yellow-300 bg-yellow-50 text-yellow-700")}>Draft</button>
                    <button onClick={() => setStatus("PUBLISHED")} className={metaBtn(status === "PUBLISHED", "border-green-300 bg-green-50 text-green-700")}>Published</button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${status === "PUBLISHED" ? "bg-green-400" : "bg-yellow-400"}`} />
                  <span className="text-gray-500">{status === "PUBLISHED" ? "Live on site" : "Not yet published"}</span>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={14} className="text-gray-400" />
                  <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">Tags</h3>
                </div>
                <TagSelector options={availableTags} selected={selectedTags} onChange={setSelectedTags} />
              </div>

              {/* Cover Image */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">
                  Cover Image <span className="text-red-500">*</span>
                </h3>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="cover-upload" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="cover-upload"
                  className={`relative group block border-2 border-dashed h-36 rounded-xl cursor-pointer overflow-hidden transition-all ${
                    errors.coverImage ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  {coverImage ? (
                    <>
                      <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <ImageIcon size={22} />
                      <span className="text-xs font-medium">Click to upload</span>
                      <span className="text-xs opacity-60">PNG, JPG, WebP</span>
                    </div>
                  )}
                </label>
                {errors.coverImage && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1 animate-pulse">
                    <span>●</span> {errors.coverImage}
                  </p>
                )}
                {coverImage && (
                  <button 
                    onClick={() => {
                      setCoverImage(null);
                      if (errors.coverImage) setErrors(prev => ({...prev, coverImage: null}));
                    }} 
                    className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={12} /> Remove image
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2 text-xs text-gray-500">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Info</h3>
                <div className="flex justify-between"><span>Words</span><span className="font-medium text-gray-700">{wordCount}</span></div>
                <div className="flex justify-between"><span>Reading time</span><span className="font-medium text-gray-700">~{Math.max(1, Math.round(wordCount / 200))} min</span></div>
                <div className="flex justify-between"><span>Tags</span><span className="font-medium text-gray-700">{selectedTags.length}</span></div>
                {isEditMode && (
                  <div className="flex justify-between pt-1 border-t border-gray-100 mt-1">
                    <span>Article ID</span>
                    <span className="font-mono text-gray-400 text-[10px]">{articleToEdit.article_id}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleEditor;