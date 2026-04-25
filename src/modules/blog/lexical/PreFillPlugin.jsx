import { useRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function PreFillPlugin({ initialContent }) {
  const [editor] = useLexicalComposerContext();
  const didFill = useRef(false);

  useEffect(() => {
    if (!initialContent || didFill.current) return;

    try {
      let content = initialContent;

      // ✅ إذا كان string → parse
      if (typeof content === "string") {
        content = JSON.parse(content);
      }

      // ✅ تحقق أنه Lexical JSON صحيح
      if (content?.root) {
        const state = editor.parseEditorState(content);
        editor.setEditorState(state);
        didFill.current = true;
      }
    } catch (err) {
      console.error("❌ PreFill error:", err);
    }
  }, [editor, initialContent]);

  return null;
}