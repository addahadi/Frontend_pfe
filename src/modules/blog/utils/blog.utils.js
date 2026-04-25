
// ── Lexical JSON detector ────────────────────────────────────────────────────
export const isLexicalJson = (content) => {
  try {
    const parsed = JSON.parse(content);
    return parsed?.root !== undefined;
  } catch {
    return false;
  }
};

// ── Helper Functions ─────────────────────────────────────────────────────────

//date function
export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); 

//estimate time function
export const estimateReadTime = (content) => {
  let text = "";

  try {
    if (!content) return 1;

    // ✅ إذا string
    if (typeof content === "string") {
      try {
        const parsed = JSON.parse(content);
        content = parsed;
      } catch {
        text = content;
      }
    }

    // ✅ إذا Lexical JSON
    if (typeof content === "object" && content?.root) {
      const extractText = (node) => {
        if (!node) return "";
        if (node.text) return node.text;
        if (node.children) {
          return node.children.map(extractText).join(" ");
        }
        return "";
      };

      text = extractText(content.root);
    }

    // fallback
    if (!text && typeof content === "string") {
      text = content;
    }

    const words = text.trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));
  } catch (err) {
    console.error("ReadTime error:", err);
    return 1;
  }
};
