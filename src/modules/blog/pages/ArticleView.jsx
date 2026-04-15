import React, { useState, useEffect,  } from "react";
import { useParams, Link } from "react-router-dom";
import {Link as LinkIcon,

  ChevronLeft,
} from "lucide-react";
import {
  getLikesCount,
  getPublishedArticles,

} from "../services/blog.service";
import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ImageNode } from "../lexical/ImageNode"; 
import { isLexicalJson,} from "../utils/blog.utils"; 
import { Hero , TagList ,RelatedArticles ,PopularTags ,ShareSection } from "../components/component"; 


// ── Hook: converts raw content (JSON or HTML) → HTML string ─────────────────
// Fix: move setState into a microtask / setTimeout so it never fires
// synchronously inside the effect body, eliminating both "cascading setState"
// warnings while keeping the conversion logic unchanged.
const useRenderedContent = (rawContent) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!rawContent) return;

    // Plain HTML — defer the setState so it isn't synchronous in the effect
    if (!isLexicalJson(rawContent)) {
      const id = setTimeout(() => setHtml(rawContent), 0);
      return () => clearTimeout(id);
    }

    // Lexical JSON — convert to HTML (includes ImageNode so <img> tags appear)
    const editor = createEditor({
      nodes: [
        HeadingNode, QuoteNode,
        ListNode, ListItemNode,
        CodeNode, CodeHighlightNode,
        AutoLinkNode, LinkNode,
        ImageNode, // ← required so the serialiser knows about image nodes
      ],
    });

    const parsed = editor.parseEditorState(rawContent);
    editor.setEditorState(parsed);

    // $generateHtmlFromNodes is synchronous; defer the setState call
    let html = "";
    editor.read(() => {
      html = $generateHtmlFromNodes(editor, null);
    });

    const id = setTimeout(() => setHtml(html), 0);
    return () => clearTimeout(id);
  }, [rawContent]);

  return html;
};



// ── Sub Components ───────────────────────────────────────────────────────────


const ArticleContent = ({ article }) => {
  const html = useRenderedContent(article.content);

  return (
    <div className="prose max-w-none">
      <p className="text-base md:text-lg text-gray-600 italic leading-relaxed mb-6 border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-2 pr-4 rounded-r-lg">
        {article.excerpt}
      </p>

      <div
        className="text-gray-700 leading-relaxed text-sm md:text-base
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-gray-900 [&_h1]:mt-8 [&_h1]:mb-3
          [&_h2]:text-xl  [&_h2]:font-bold [&_h2]:text-gray-800 [&_h2]:mt-6 [&_h2]:mb-2
          [&_h3]:text-lg  [&_h3]:font-semibold [&_h3]:text-gray-700 [&_h3]:mt-5 [&_h3]:mb-2
          [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-gray-700 [&_h4]:mt-4 [&_h4]:mb-1
          [&_p]:mb-4 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-4
          [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
          [&_code]:bg-gray-100 [&_code]:text-red-600 [&_code]:px-1.5 [&_code]:py-0.5
          [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
          [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-xl
          [&_pre]:overflow-x-auto [&_pre]:my-4 [&_pre]:text-sm
          [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800
          [&_strong]:font-bold [&_strong]:text-gray-900
          [&_em]:italic
          [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-4 [&_img]:block"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};






// ── Main Component ───────────────────────────────────────────────────────────

const ArticleView = () => {
  const { id } = useParams();

  // Fix warning 2: initialise loading as true so we never call setLoading(true)
  // synchronously inside an effect body.
  const [loading, setLoading]       = useState(true);
  const [article, setArticle]       = useState(null); 
  // eslint-disable-next-line 
  const [allArticles, setAllArticles] = useState([]);
  const [liked, setLiked]           = useState(false);
  const [saved, setSaved]           = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    // `loading` is already true from initial state — no synchronous setState here
    const timer = setTimeout(() => {
      const published = getPublishedArticles();
      setAllArticles(published);

      const found = published.find((a) => a.slug === id || a.article_id === id);
      if (found) {
        setArticle(found);
        setLikesCount(getLikesCount(found.article_id));
        setLiked(false);
        setSaved(false);
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  const handleLike = () => {
    if (!article) return;
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    if (!article) return;
    setSaved((prev) => !prev);
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
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ChevronLeft size={18} />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Hero
          article={article}
          likesCount={likesCount}
          isLiked={liked}
          isSaved={saved}
          onLike={handleLike}
          onSave={handleSave}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
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

export default ArticleView;