
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
  const text = content.replace(/<[^>]*>/g, " ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};
