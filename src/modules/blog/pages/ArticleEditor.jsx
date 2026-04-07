import React, { useState, useCallback, useEffect, useRef } from "react";  
import { getTags,createArticle } from "../services/blog.service"; 


//icon import
import {
  Save, Globe, ImageIcon, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link2, Code, Quote, Undo2, Redo2,
  ChevronDown, X, Plus, Tag, Type, Pilcrow,
  Heading1, Heading2, Heading3, Superscript, Subscript,
} from "lucide-react";

// ─── Lexical Core ─────────────────────────────────────────────────────────────
import {
  $getSelection, $isRangeSelection, $createParagraphNode,
  FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND, REDO_COMMAND, $getRoot,
} from "lexical";

// ─── Lexical React ────────────────────────────────────────────────────────────
import { LexicalComposer }          from "@lexical/react/LexicalComposer";
import { RichTextPlugin }            from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable }           from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin }             from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin }           from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary }      from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin }            from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin }                from "@lexical/react/LexicalListPlugin";
import { LinkPlugin }                from "@lexical/react/LexicalLinkPlugin";
import { CheckListPlugin }           from "@lexical/react/LexicalCheckListPlugin";
import { AutoLinkPlugin }            from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin }    from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { CharacterLimitPlugin }      from "@lexical/react/LexicalCharacterLimitPlugin";

// ─── Lexical Nodes ────────────────────────────────────────────────────────────
import {
  HeadingNode, QuoteNode,
  $createHeadingNode, $createQuoteNode, $isHeadingNode,
} from "@lexical/rich-text";
import {
  ListNode, ListItemNode,
  INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND, $isListNode,
} from "@lexical/list";
import { CodeNode, CodeHighlightNode, $createCodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $setBlocksType }            from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import { TRANSFORMERS }              from "@lexical/markdown"; 





// ─── Theme ────────────────────────────────────────────────────────────────────
const editorTheme = {
  heading: {
    h1: "editor-h1",
    h2: "editor-h2",
    h3: "editor-h3",
  },
  text: {
    bold:          "font-bold",
    italic:        "italic",
    underline:     "underline",
    strikethrough: "line-through",
    code:          "editor-inline-code",
    superscript:   "editor-superscript",
    subscript:     "editor-subscript",
  },
  list: {
    ul:       "editor-ul",
    ol:       "editor-ol",
    listitem: "editor-listitem",
    nested:   { listitem: "editor-nested-listitem" },
  },
  quote:     "editor-quote",
  code:      "editor-code-block",
  link:      "editor-link",
  paragraph: "editor-paragraph",
};

// ─── Editor Config ────────────────────────────────────────────────────────────
const initialConfig = {
  namespace: "ArticleEditor",
  theme: editorTheme,
  onError: (err) => console.error(err),
  nodes: [
    HeadingNode, QuoteNode,
    ListNode, ListItemNode,
    CodeNode, CodeHighlightNode,
    AutoLinkNode, LinkNode,
  ],
};

// ─── Auto Link Matchers ───────────────────────────────────────────────────────
const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
const AUTO_LINK_MATCHERS = [
  (text) => {
    const match = URL_REGEX.exec(text);
    if (!match) return null;
    const full = match[0];
    return {
      index: match.index, length: full.length, text: full,
      url: full.startsWith("http") ? full : `https://${full}`,
    };
  },
  (text) => {
    const match = EMAIL_REGEX.exec(text);
    if (!match) return null;
    const full = match[0];
    return {
      index: match.index, length: full.length, text: full,
      url: `mailto:${full}`,
    };
  },
];

// ─── Block Types ──────────────────────────────────────────────────────────────
const BLOCK_TYPES = {
  paragraph: { label: "Paragraph",      icon: <Pilcrow   size={14} /> },
  h1:        { label: "Heading 1",       icon: <Heading1  size={14} /> },
  h2:        { label: "Heading 2",       icon: <Heading2  size={14} /> },
  h3:        { label: "Heading 3",       icon: <Heading3  size={14} /> },
  bullet:    { label: "Bullet List",     icon: <List      size={14} /> },
  number:    { label: "Numbered List",   icon: <ListOrdered size={14} /> },
  quote:     { label: "Quote",           icon: <Quote     size={14} /> },
  code:      { label: "Code Block",      icon: <Code      size={14} /> },
};

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const Btn = ({ onClick, active, title, children, className = "" }) => (
    <button
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`relative p-1.5 rounded-md text-sm transition-all duration-150 select-none
        ${active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}
        ${className}`}
    >
      {children}
    </button>
  );

  const Sep = () => (
    <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0 self-center" />
  ); 

// ═══════════════════════════════════════════════════════════════════════════════
// Toolbar Plugin
// ═══════════════════════════════════════════════════════════════════════════════
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  // ── Text Format States ──
  const [isBold, setIsBold]               = useState(false);
  const [isItalic, setIsItalic]           = useState(false);
  const [isUnderline, setIsUnderline]     = useState(false);
  const [isStrike, setIsStrike]           = useState(false);
  const [isCode, setIsCode]               = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript]     = useState(false);
  const [isLink, setIsLink]               = useState(false);

  // ── Block State ──
  const [blockType, setBlockType]         = useState("paragraph");
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  // ── Link Dialog ──
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl]               = useState("");
  const linkInputRef                        = useRef(null);

  // ── Alignment ──
  const [align, setAlign] = useState("left");

  // ─── Sync toolbar with selection ──────────────────────────────────────────
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
    setIsStrike(selection.hasFormat("strikethrough"));
    setIsCode(selection.hasFormat("code"));
    setIsSuperscript(selection.hasFormat("superscript"));
    setIsSubscript(selection.hasFormat("subscript"));

    // Detect link
    const nodes = selection.getNodes();
    const hasLink = nodes.some((n) => {
      const parent = n.getParent();
      return parent?.__type === "link" || n.__type === "link";
    });
    setIsLink(hasLink);

    // Detect block type
    const anchor  = selection.anchor.getNode();
    const element = anchor.getKey() === "root"
      ? anchor
      : anchor.getTopLevelElementOrThrow();

    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType(anchor, ListNode);
      const listType   = (parentList ?? element).getListType();
      setBlockType(listType === "bullet" ? "bullet" : "number");
    } else if ($isHeadingNode(element)) {
      setBlockType(element.getTag());
    } else {
      setBlockType(element.getType());
    }

    // Detect alignment from DOM
    const elemKey = element.getKey();
    const elemDOM = editor.getElementByKey(elemKey);
    if (elemDOM) {
      const style = window.getComputedStyle(elemDOM);
      setAlign(style.textAlign || "left");
    }
  }, [editor]);

  useEffect(() =>
    mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      })
    ),
  [editor, updateToolbar]);

  // Close menus on outside click
  const blockMenuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (blockMenuRef.current && !blockMenuRef.current.contains(e.target)) {
        setShowBlockMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Block Formatting ─────────────────────────────────────────────────────
  const applyBlock = useCallback((type) => {
    if (type === "bullet") {
      editor.dispatchCommand(
        blockType === "bullet" ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
        undefined
      );
    } else if (type === "number") {
      editor.dispatchCommand(
        blockType === "number" ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
        undefined
      );
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        if (type === "paragraph") {
          $setBlocksType(selection, () => $createParagraphNode());
        } else if (["h1","h2","h3"].includes(type)) {
          $setBlocksType(selection, () => $createHeadingNode(type));
        } else if (type === "quote") {
          $setBlocksType(selection, () => $createQuoteNode());
        } else if (type === "code") {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockMenu(false);
  }, [editor, blockType]);

  // ─── Link Handling ────────────────────────────────────────────────────────
  const handleLinkBtn = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    } else {
      setShowLinkDialog(true);
      setTimeout(() => linkInputRef.current?.focus(), 50);
    }
  };

  const applyLink = () => {
    if (linkUrl.trim()) {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url, target: "_blank" });
    }
    setShowLinkDialog(false);
    setLinkUrl("");
  };



  const currentBlock = BLOCK_TYPES[blockType] ?? BLOCK_TYPES.paragraph;

  return (
    <div className="relative">
      {/* ── Main Toolbar ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-white border border-gray-200 border-b-0 rounded-t-xl">

        {/* Undo / Redo */}
        <Btn onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} title="Undo (Ctrl+Z)">
          <Undo2 size={15} />
        </Btn>
        <Btn onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} title="Redo (Ctrl+Y)">
          <Redo2 size={15} />
        </Btn>

        <Sep />

        {/* Block Type Dropdown */}
        <div className="relative" ref={blockMenuRef}>
          <button
            onMouseDown={(e) => { e.preventDefault(); setShowBlockMenu((v) => !v); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium text-gray-700
                       hover:bg-gray-100 transition-colors select-none border border-gray-200"
          >
            <span className="text-blue-600">{currentBlock.icon}</span>
            <span className="hidden sm:inline whitespace-nowrap">{currentBlock.label}</span>
            <ChevronDown size={12} className={`transition-transform ${showBlockMenu ? "rotate-180" : ""}`} />
          </button>

          {showBlockMenu && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-gray-200
                            rounded-xl shadow-xl py-1 min-w-[170px] overflow-hidden">
              {Object.entries(BLOCK_TYPES).map(([key, { label, icon }]) => (
                <button
                  key={key}
                  onMouseDown={(e) => { e.preventDefault(); applyBlock(key); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors
                    ${blockType === key
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <Sep />

        {/* Text Formatting */}
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}          active={isBold}        title="Bold (Ctrl+B)">        <Bold          size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}        active={isItalic}      title="Italic (Ctrl+I)">      <Italic        size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}     active={isUnderline}   title="Underline (Ctrl+U)">   <Underline     size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} active={isStrike}      title="Strikethrough">        <Strikethrough size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}          active={isCode}        title="Inline Code">          <Code          size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")}   active={isSuperscript} title="Superscript">          <Superscript   size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}     active={isSubscript}   title="Subscript">            <Subscript     size={15} /></Btn>

        <Sep />

        {/* Link */}
        <Btn onClick={handleLinkBtn} active={isLink} title={isLink ? "Remove Link" : "Insert Link"}>
          <Link2 size={15} />
        </Btn>

        <Sep />

        {/* Alignment */}
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}    active={align === "left"}    title="Align Left">    <AlignLeft    size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}  active={align === "center"}  title="Align Center">  <AlignCenter  size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}   active={align === "right"}   title="Align Right">   <AlignRight   size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")} active={align === "justify"} title="Justify">       <AlignJustify size={15} /></Btn>

        <Sep />

        {/* Lists (quick access) */}
        <Btn onClick={() => applyBlock("bullet")} active={blockType === "bullet"} title="Bullet List">
          <List size={15} />
        </Btn>
        <Btn onClick={() => applyBlock("number")} active={blockType === "number"} title="Numbered List">
          <ListOrdered size={15} />
        </Btn>
      </div>

      {/* ── Link Dialog ──────────────────────────────────────────────────── */}
      {showLinkDialog && (
        <div className="absolute top-full left-2 mt-2 z-50 bg-white border border-gray-200
                        rounded-xl shadow-xl p-3 flex gap-2 items-center">
          <span className="text-blue-500"><Link2 size={15} /></span>
          <input
            ref={linkInputRef}
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") { setShowLinkDialog(false); setLinkUrl(""); } }}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm w-60
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={applyLink}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={() => { setShowLinkDialog(false); setLinkUrl(""); }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Character Count Plugin
// ═══════════════════════════════════════════════════════════════════════════════
function CharacterCountDisplay({ limit = 10000 }) {
  const [editor] = useLexicalComposerContext();
  const [count, setCount]   = useState(0);

  useEffect(() =>
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        setCount(text.length);
      });
    }),
  [editor]);

  const pct = Math.min((count / limit) * 100, 100);
  const color = pct > 90 ? "text-red-500" : pct > 70 ? "text-yellow-500" : "text-gray-400";

  return (
    <div className={`flex items-center gap-1.5 text-xs ${color} select-none`}>
      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-400" : pct > 70 ? "bg-yellow-400" : "bg-blue-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {count} / {limit.toLocaleString()}
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// Main Article Editor
// ═══════════════════════════════════════════════════════════════════════════════
const ArticleEditor = () => { 

// tags  
const [availableTags] = useState(getTags());
const [selectedTags, setSelectedTags] = useState([]);

const TagSelector = ({ options, selected, onChange }) => { 

  const toggleTag = useCallback((id) => { 
    if (selected.includes(id)) {
      onChange(selected.filter((t) => t !== id));
    } else {
      onChange([...selected, id]);
    }
  }, [selected, onChange]);

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((tag) => {
        const active = selected.includes(tag.id);

        return (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`px-3 py-1.5 rounded-full text-xs border
              ${active
                ? "bg-blue-50 text-blue-700"
                : "bg-gray-100"}`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

  const [title, setTitle]         = useState("");
  const [excerpt, setExcerpt]     = useState("");
  const [type, setType]           = useState("BLOG");
  const [status, setStatus]       = useState("DRAFT");

  const [coverImage, setCoverImage] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [wordCount, setWordCount]   = useState(0);
  const [isSaving, setIsSaving]     = useState(false);

  const slug = title.trim().toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(URL.createObjectURL(file));
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    state.read(() => {
      const root  = $getRoot();
      const words = root.getTextContent().trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    });
  };

 const handleSave = async (publish = false) => {
  setIsSaving(true);

  await new Promise((r) => setTimeout(r, 800));

  const payload = {
    title,
    slug,
    excerpt,
    type,
    status: publish ? "PUBLISHED" : "DRAFT",
    tags: selectedTags, // ✅ مهم
    cover_img: coverImage || "",
    content: editorState
      ? JSON.stringify(editorState.toJSON())
      : "",
  };

  const savedArticle = createArticle(payload);

  console.log("Saved:", savedArticle);

  setIsSaving(false);

  if (publish) setStatus("PUBLISHED");
};

  // ── Shared styles ──
  const metaBtn = (active, colorClass) =>
    `px-4 py-1.5 text-xs font-semibold rounded-lg border-2 transition-all duration-150 select-none
     ${active ? colorClass : "border-gray-200 text-gray-400 hover:border-gray-300"}`;

  return (
    <>
      {/* ── Editor Styles ─────────────────────────────────────────────────── */}
      <style>{`
        .editor-h1         { font-size:2rem;   font-weight:700; color:#111827; margin:1rem 0 .5rem; }
        .editor-h2         { font-size:1.5rem; font-weight:700; color:#1f2937; margin:.75rem 0 .4rem; }
        .editor-h3         { font-size:1.25rem;font-weight:600; color:#374151; margin:.6rem 0 .3rem; }
        .editor-paragraph  { margin:.25rem 0; min-height:1.4em; }
        .editor-quote      { border-left:4px solid #3b82f6; padding-left:1rem; font-style:italic; color:#6b7280; margin:.75rem 0; }
        .editor-code-block { display:block; background:#1e1e2e; color:#cdd6f4; font-family:monospace;
                             font-size:.85rem; padding:1rem 1.25rem; border-radius:.75rem; margin:.75rem 0;
                             white-space:pre; overflow-x:auto; }
        .editor-inline-code{ background:#f3f4f6; color:#dc2626; font-family:monospace; font-size:.85em;
                             padding:.1em .35em; border-radius:.25rem; }
        .editor-ul         { list-style-type:disc;    padding-left:1.5rem; margin:.5rem 0; }
        .editor-ol         { list-style-type:decimal; padding-left:1.5rem; margin:.5rem 0; }
        .editor-listitem   { margin:.2rem 0; }
        .editor-nested-listitem::before { display:none; }
        .editor-link       { color:#2563eb; text-decoration:underline; cursor:pointer; }
        .editor-link:hover { color:#1d4ed8; }
        .editor-superscript{ font-size:.75em; vertical-align:super; }
        .editor-subscript  { font-size:.75em; vertical-align:sub; }
        [contenteditable]:focus { outline:none; }
        .editor-placeholder { position:absolute; top:0; left:0; right:0; pointer-events:none; color:#9ca3af; }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ═══════════════════════════════════════════════════════════════
                LEFT — Editor Area
            ═══════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-2 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your article title…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                             text-lg font-medium placeholder-gray-400 transition-shadow"
                />
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  maxLength={200}
                  placeholder="Short summary shown in article previews…"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 resize-none
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none
                             text-gray-700 placeholder-gray-400 transition-shadow"
                />
                <p className="text-xs text-gray-400 text-right mt-0.5">{excerpt.length}/200</p>
              </div>

              {/* ── Rich Text Editor ───────────────────────────────────── */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content</label>

                <LexicalComposer initialConfig={initialConfig}>
                  <div className="border border-gray-200 rounded-xl shadow-sm overflow-visible">

                    {/* Toolbar */}
                    <ToolbarPlugin />

                    {/* Editable Area */}
                    <div className="relative bg-white rounded-b-xl">
                      <RichTextPlugin
                        contentEditable={
                          <ContentEditable
                            className="min-h-[320px] max-h-[600px] overflow-y-auto px-5 py-4
                                       text-gray-800 leading-relaxed focus:outline-none"
                          />
                        }
                        placeholder={
                          <div className="editor-placeholder px-5 py-4 text-gray-400">
                            Start writing your article… (Markdown shortcuts supported)
                          </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                      />

                      {/* Plugins */}
                      <HistoryPlugin />
                      <AutoFocusPlugin />
                      <ListPlugin />
                      <CheckListPlugin />
                      <LinkPlugin />
                      <AutoLinkPlugin matchers={AUTO_LINK_MATCHERS} />
                      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                      <OnChangePlugin onChange={handleEditorChange} />
                    </div>

                    {/* Footer bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50
                                    border-t border-gray-100 rounded-b-xl text-xs text-gray-400">
                      <span>{wordCount} words</span>
                      <CharacterCountDisplay limit={10000} />
                    </div>
                  </div>
                </LexicalComposer>
              </div>

              {/* ── Action Buttons ────────────────────────────────────── */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl
                             font-medium hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-60"
                >
                  {isSaving ? (
                    <svg className="animate-spin" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : <Save size={16} />}
                  Save Draft
                </button>

                <button
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                  className="flex items-center gap-2 border-2 border-green-500 text-green-600
                             px-5 py-2.5 rounded-xl font-medium hover:bg-green-50
                             active:scale-95 transition-all disabled:opacity-60"
                >
                  <Globe size={16} /> Publish
                </button>

                <button
                  className="flex items-center gap-2 text-gray-500 px-5 py-2.5 rounded-xl
                             font-medium hover:bg-gray-100 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                RIGHT — Sidebar
            ═══════════════════════════════════════════════════════════════ */}
            <div className="space-y-5">

              {/* Metadata */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">Metadata</h3>

                {/* Type */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Type</p>
                  <div className="flex gap-2">
                    <button onClick={() => setType("BLOG")}
                      className={metaBtn(type === "BLOG", "border-blue-300 bg-blue-50 text-blue-700")}>
                      Blog
                    </button>
                    <button onClick={() => setType("ACTUALITE")}
                      className={metaBtn(type === "ACTUALITE", "border-purple-300 bg-purple-50 text-purple-700")}>
                      Actualité
                    </button>

                  </div>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-2">Status</p>
                  <div className="flex gap-2">
                    <button onClick={() => setStatus("DRAFT")}
                      className={metaBtn(status === "DRAFT", "border-yellow-300 bg-yellow-50 text-yellow-700")}>
                      Draft
                    </button>
                    <button onClick={() => setStatus("PUBLISHED")}
                      className={metaBtn(status === "PUBLISHED", "border-green-300 bg-green-50 text-green-700")}>
                      Published
                    </button>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${status === "PUBLISHED" ? "bg-green-400" : "bg-yellow-400"}`} />
                  <span className="text-gray-500">
                    {status === "PUBLISHED" ? "Live on site" : "Not yet published"}
                  </span>
                </div>
              </div>

              {/* Tags */}
<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
  <div className="flex items-center gap-2 mb-4">
    <Tag size={14} className="text-gray-400" />
    <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">
      Tags
    </h3>
  </div>

  <TagSelector
    options={availableTags}
    selected={selectedTags}
    onChange={setSelectedTags}
  />
</div>
              {/* Cover Image */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Cover Image</h3>

                <input
                  type="file"
                  accept="image/*"
                  id="cover-upload"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <label
                  htmlFor="cover-upload"
                  className="relative group block border-2 border-dashed border-gray-200 h-36
                             rounded-xl cursor-pointer overflow-hidden hover:border-blue-400
                             transition-colors"
                >
                  {coverImage ? (
                    <>
                      <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
                                      transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400
                                    group-hover:text-blue-500 transition-colors">
                      <ImageIcon size={22} />
                      <span className="text-xs font-medium">Click to upload</span>
                      <span className="text-xs opacity-60">PNG, JPG, WebP</span>
                    </div>
                  )}
                </label>

                {coverImage && (
                  <button
                    onClick={() => setCoverImage(null)}
                    className="mt-2 flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <X size={12} /> Remove image
                  </button>
                )}
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-2 text-xs text-gray-500">
                <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Info</h3>
                <div className="flex justify-between">
                  <span>Words</span>
                  <span className="font-medium text-gray-700">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reading time</span>
                  <span className="font-medium text-gray-700">~{Math.max(1, Math.round(wordCount / 200))} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Tags</span>
                  <span className="font-medium text-gray-700">{selectedTags.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleEditor;