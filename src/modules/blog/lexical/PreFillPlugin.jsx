import { useRef,useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"; 
// ═══════════════════════════════════════════════════════════════════════════════
// Pre-fill Plugin — loads existing content when editing
// ═══════════════════════════════════════════════════════════════════════════════
export default function PreFillPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  const didFill  = useRef(false);

  useEffect(() => {
    if (!initialContent || didFill.current) return;
    try {
      const parsed = JSON.parse(initialContent);
      if (parsed?.root) {
        const state = editor.parseEditorState(initialContent);
        editor.setEditorState(state);
        didFill.current = true;
      }
    } catch {
      // not a valid Lexical JSON — leave blank
    }
  }, [editor, initialContent]);

  return null;
}