import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  fetchArticleBySlug,
  toggleLike,
  toggleSave,
  fetchTags,
} from "../services/blog.service";
import { isLexicalJson } from "../utils/blog.utils";
import { Hero, TagList, RelatedArticles, PopularTags, ShareSection } from "../components/component";

// ── Global Cache: Prevents re-processing identical Lexical JSON ──────────────
const lexicalCache = new Map();

// ── Main Component ───────────────────────────────────────────────────────────
const ArticleView = () => {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState(null);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        await fetchTags();
        const art = await fetchArticleBySlug(id);
        if (!cancelled) {
          if (art) {
            setArticle(art);
            setLikesCount(art.likesCount);
            setLiked(false);
            setSaved(false);
          }
        }
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleLike = async () => {
    if (!article) return;
    try {
      const res = await toggleLike(article.article_id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) { console.error(err); }
  };

  const handleSave = async () => {
    if (!article) return;
    try {
      const res = await toggleSave(article.article_id);
      setSaved(res.saved);
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/articles" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ChevronLeft size={18} /> Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Hero article={article} likesCount={likesCount} isLiked={liked} isSaved={saved} onLike={handleLike} onSave={handleSave} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
  {/* Article Type Badge */}
  {article.type && (
    <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
      {article.type}
    </span>
  )}

  <ArticleContent article={article} />
  <TagList tags={article.tags} />
  <ShareSection title={article.title} />
</div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <RelatedArticles currentArticle={article} />
              <PopularTags />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── ArticleContent ───────────────────────────────────────────────────────────
const ArticleContent = ({ article }) => {
  const rawContent =
    article.content ||
    article.content_en ||
    article.content_ar ||
    "";

  // 🔥 normalize (OBJECT → STRING)
  const content =
    typeof rawContent === "object"
      ? JSON.stringify(rawContent)
      : rawContent;

  const hasContent = content && content.trim().length > 0;
  const isHtml = hasContent && !content.trim().startsWith("{");

  const renderedContent = useMemo(() => {
    if (!hasContent) {
      return (
        <div className="text-gray-400 text-sm italic py-4">
          No content available for this article.
        </div>
      );
    }

    if (isHtml) {
      return (
        <div
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    return <LexicalContent content={content} />;
  }, [content, hasContent, isHtml]);

  return (
    <div className="prose max-w-none">
      <p className="text-base text-gray-600 italic mb-6">
        {article.excerpt || "No excerpt available"}
      </p>
      {renderedContent}
    </div>
  );
};

// ── LexicalContent: Safe JSON → HTML renderer with validation & cache ────────
const LexicalContent = ({ content }) => {
  const [html, setHtml] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let normalized = content;

    // 🔥 OBJECT → STRING
    if (typeof content === "object") {
      normalized = JSON.stringify(content);
    }

    if (!normalized || !isLexicalJson(normalized)) {
      setError(true);
      setLoading(false);
      return;
    }

    if (lexicalCache.has(normalized)) {
      setHtml(lexicalCache.get(normalized));
      setLoading(false);
      return;
    }

    let cancelled = false;

    const renderLexical = async () => {
      try {
        const [
          lexicalModule,
          htmlModule,
          richTextModule,
          listModule,
          codeModule,
          linkModule,
          imageModule,
        ] = await Promise.all([
          import("lexical"),
          import("@lexical/html"),
          import("@lexical/rich-text"),
          import("@lexical/list"),
          import("@lexical/code"),
          import("@lexical/link"),
          import("../lexical/ImageNode"),
        ]);

        const { createEditor } = lexicalModule;
        const { $generateHtmlFromNodes } = htmlModule;
        const { HeadingNode, QuoteNode } = richTextModule;
        const { ListNode, ListItemNode } = listModule;
        const { CodeNode, CodeHighlightNode } = codeModule;
        const { AutoLinkNode, LinkNode } = linkModule;
        const { ImageNode } = imageModule;

        const editor = createEditor({
          namespace: "ArticleView",
          nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            CodeNode,
            CodeHighlightNode,
            AutoLinkNode,
            LinkNode,
            ImageNode,
          ],
        });

        const parsed = JSON.parse(normalized);

        if (!parsed?.root || !Array.isArray(parsed.root.children)) {
          throw new Error("Invalid Lexical JSON");
        }

        if (parsed.root.children.length === 0) {
          setHtml("");
          setLoading(false);
          return;
        }

        const editorState = editor.parseEditorState(parsed);
        editor.setEditorState(editorState);

        let generatedHtml = "";
        editor.read(() => {
          generatedHtml = $generateHtmlFromNodes(editor);
        });

        if (!cancelled) {
          lexicalCache.set(normalized, generatedHtml);
          setHtml(generatedHtml || "");
          setLoading(false);
        }
      } catch (err) {
        console.error("Lexical error:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    renderLexical();

    return () => {
      cancelled = true;
    };
  }, [content]);

  if (loading) return <p>Loading content...</p>;

  if (error) return <p className="text-gray-500">Content unavailable</p>;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export default ArticleView;