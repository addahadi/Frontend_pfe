import React, { useState, useCallback, useEffect, useRef } from "react";   
import {
  ImageIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link2,
  Quote,
  Undo2,
  Redo2,
  ChevronDown,
  X,
  Superscript,
  Subscript,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3, 
} from "lucide-react"; 

import ImageDialog from "../lexical/ImageDialog"; 


const Btn = ({ onClick, active, title, children, className = "" }) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    className={`p-1.5 rounded-md text-sm ${
      active
        ? "bg-blue-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    } ${className}`}
  >
    {children}
  </button>
);

const Sep = () => (
  <div className="w-px h-5 bg-gray-200 mx-1" />
);


// ─── Lexical Core ─────────────────────────────────────────────────────────────
import {
  $getSelection, $isRangeSelection, $createParagraphNode,
  FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND, REDO_COMMAND, 
} from "lexical";

// ─── Lexical React ────────────────────────────────────────────────────────────

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";


// ─── Lexical Nodes ────────────────────────────────────────────────────────────
import {

  $createHeadingNode, $createQuoteNode, $isHeadingNode,
} from "@lexical/rich-text";
import {
  ListNode, 
  INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND, $isListNode,
} from "@lexical/list";

import { TOGGLE_LINK_COMMAND } from "@lexical/link";

import { $setBlocksType }            from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";




import {  INSERT_IMAGE_COMMAND } from "../lexical/ImageNode";  


const BLOCK_TYPES = {
  paragraph: { label: "Paragraph",    icon: <Pilcrow     size={14} /> },
  h1:        { label: "Heading 1",     icon: <Heading1    size={14} /> },
  h2:        { label: "Heading 2",     icon: <Heading2    size={14} /> },
  h3:        { label: "Heading 3",     icon: <Heading3    size={14} /> },
  bullet:    { label: "Bullet List",   icon: <List        size={14} /> },
  number:    { label: "Numbered List", icon: <ListOrdered size={14} /> },
  quote:     { label: "Quote",         icon: <Quote       size={14} /> },
};






// ═══════════════════════════════════════════════════════════════════════════════
// Toolbar Plugin
// ═══════════════════════════════════════════════════════════════════════════════
export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold]               = useState(false);
  const [isItalic, setIsItalic]           = useState(false);
  const [isUnderline, setIsUnderline]     = useState(false);
  const [isStrike, setIsStrike]           = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript]     = useState(false);
  const [isLink, setIsLink]               = useState(false);
  const [blockType, setBlockType]         = useState("paragraph");
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false); // ← new
  const [linkUrl, setLinkUrl]               = useState("");
  const linkInputRef                        = useRef(null);
  const [align, setAlign]                   = useState("left");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
    setIsStrike(selection.hasFormat("strikethrough"));
    setIsSuperscript(selection.hasFormat("superscript"));
    setIsSubscript(selection.hasFormat("subscript"));
    const nodes = selection.getNodes();
    setIsLink(nodes.some((n) => { const p = n.getParent(); return p?.__type === "link" || n.__type === "link"; }));
    const anchor = selection.anchor.getNode();
    const element = anchor.getKey() === "root" ? anchor : anchor.getTopLevelElementOrThrow();
    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType(anchor, ListNode);
      setBlockType((parentList ?? element).getListType() === "bullet" ? "bullet" : "number");
    } else if ($isHeadingNode(element)) {
      setBlockType(element.getTag());
    } else {
      setBlockType(element.getType());
    }
    const elemDOM = editor.getElementByKey(element.getKey());
    if (elemDOM) setAlign(window.getComputedStyle(elemDOM).textAlign || "left");
  }, [editor]);

  useEffect(() => mergeRegister(editor.registerUpdateListener(({ editorState }) => { editorState.read(() => updateToolbar()); })), [editor, updateToolbar]);

  const blockMenuRef = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (blockMenuRef.current && !blockMenuRef.current.contains(e.target)) setShowBlockMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applyBlock = useCallback((type) => {
    if (type === "bullet") {
      editor.dispatchCommand(blockType === "bullet" ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (type === "number") {
      editor.dispatchCommand(blockType === "number" ? REMOVE_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        if (type === "paragraph") $setBlocksType(selection, () => $createParagraphNode());
        else if (["h1","h2","h3"].includes(type)) $setBlocksType(selection, () => $createHeadingNode(type));
        else if (type === "quote") $setBlocksType(selection, () => $createQuoteNode());
      });
    }
    setShowBlockMenu(false);
  }, [editor, blockType]);

  const handleLinkBtn = () => {
    if (isLink) { editor.dispatchCommand(TOGGLE_LINK_COMMAND, null); }
    else { setShowLinkDialog(true); setTimeout(() => linkInputRef.current?.focus(), 50); }
  };

  const applyLink = () => {
    if (linkUrl.trim()) editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`, target: "_blank" });
    setShowLinkDialog(false); setLinkUrl("");
  };

  const handleImageInsert = ({ src, alt }) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, alt, width: "100%" });
    setShowImageDialog(false);
  };

  const currentBlock = BLOCK_TYPES[blockType] ?? BLOCK_TYPES.paragraph;

  return (
    <div className="relative">
      {/* Image Dialog (portal-like, above everything) */}
      {showImageDialog && (
        <ImageDialog onInsert={handleImageInsert} onClose={() => setShowImageDialog(false)} />
      )}

      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-white border border-gray-200 border-b-0 rounded-t-xl">
        <Btn onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} title="Undo"><Undo2 size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} title="Redo"><Redo2 size={15} /></Btn>
        <Sep />
        <div className="relative" ref={blockMenuRef}>
          <button onMouseDown={(e) => { e.preventDefault(); setShowBlockMenu((v) => !v); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors select-none border border-gray-200">
            <span className="text-blue-600">{currentBlock.icon}</span>
            <span className="hidden sm:inline whitespace-nowrap">{currentBlock.label}</span>
            <ChevronDown size={12} className={`transition-transform ${showBlockMenu ? "rotate-180" : ""}`} />
          </button>
          {showBlockMenu && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-1 min-w-[170px] overflow-hidden">
              {Object.entries(BLOCK_TYPES).map(([key, { label, icon }]) => (
                <button key={key} onMouseDown={(e) => { e.preventDefault(); applyBlock(key); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors ${blockType === key ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-gray-50"}`}>
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <Sep />
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}          active={isBold}        title="Bold">        <Bold          size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}        active={isItalic}      title="Italic">      <Italic        size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}     active={isUnderline}   title="Underline">   <Underline     size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} active={isStrike}      title="Strikethrough"><Strikethrough size={15} /></Btn>
        {/* ── Image button replaces inline code ── */}
        <Btn onClick={() => setShowImageDialog(true)} title="Insert Image"><ImageIcon size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")}   active={isSuperscript} title="Superscript"> <Superscript   size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}     active={isSubscript}   title="Subscript">   <Subscript     size={15} /></Btn>
        <Sep />
        <Btn onClick={handleLinkBtn} active={isLink} title={isLink ? "Remove Link" : "Insert Link"}><Link2 size={15} /></Btn>
        <Sep />
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}    active={align === "left"}    title="Align Left">   <AlignLeft    size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}  active={align === "center"}  title="Align Center"> <AlignCenter  size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}   active={align === "right"}   title="Align Right">  <AlignRight   size={15} /></Btn>
        <Btn onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")} active={align === "justify"} title="Justify">      <AlignJustify size={15} /></Btn>
        <Sep />
        <Btn onClick={() => applyBlock("bullet")} active={blockType === "bullet"} title="Bullet List"><List size={15} /></Btn>
        <Btn onClick={() => applyBlock("number")} active={blockType === "number"} title="Numbered List"><ListOrdered size={15} /></Btn>
      </div>

      {showLinkDialog && (
        <div className="absolute top-full left-2 mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-3 flex gap-2 items-center">
          <span className="text-blue-500"><Link2 size={15} /></span>
          <input ref={linkInputRef} type="url" placeholder="https://example.com" value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") { setShowLinkDialog(false); setLinkUrl(""); } }}
            className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <button onClick={applyLink} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Apply</button>
          <button onClick={() => { setShowLinkDialog(false); setLinkUrl(""); }} className="p-1 text-gray-400 hover:text-gray-600 rounded"><X size={15} /></button>
        </div>
      )}
    </div>
  );
}