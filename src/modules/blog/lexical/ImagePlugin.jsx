import { useEffect } from "react"; 
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE_COMMAND } from "./ImageNode"; 
import { $createImageNode } from "./ImageNode";
import { $getSelection } from "lexical"; 
import { $isRangeSelection } from "lexical"; 
import { $getRoot } from "lexical"; 
import { COMMAND_PRIORITY_EDITOR } from "lexical"; 
import { ImageNode } from "./ImageNode";

// ─── Image Plugin ─────────────────────────────────────────────────────────────
export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      ({ src, alt, width }) => {
        const imageNode = $createImageNode(src, alt, width);
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            selection.insertNodes([imageNode]);
          } else {
            $getRoot().append(imageNode);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);
  return null;
}