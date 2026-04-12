import React, { useState, useEffect,  } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Clock,
  Calendar,
  Heart,
  Bookmark,
  Share2,
  ChevronLeft,
} from "lucide-react";
import {
  getLikesCount,
  getTagName,
  getPublishedArticles,
  getTags,
} from "../services/blog.service";
import { createEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ImageNode } from "../lexical/ImageNode";

// ── Lexical JSON detector ────────────────────────────────────────────────────
const isLexicalJson = (content) => {
  try {
    const parsed = JSON.parse(content);
    return parsed?.root !== undefined;
  } catch {
    return false;
  }
};

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

// ── Helper Functions ─────────────────────────────────────────────────────────

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const estimateReadTime = (content) => {
  const text = content.replace(/<[^>]*>/g, " ");
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
};


// ── Sub Components ───────────────────────────────────────────────────────────

const Hero = ({ article, likesCount, isLiked, isSaved, onLike, onSave }) => (
  <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden mb-8 shadow-lg">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${article.cover_img})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
    </div>

    <Link
      to="/articles"
      className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-10"
    >
      <ChevronLeft size={20} />
    </Link>

    <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider">
          {article.type}
        </span>
        {article.tags.length > 1 && (
          <span className="inline-flex w-fit items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm">
            +{article.tags.length - 1}
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl leading-tight mb-4">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-white/90">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} />
          <span>{fmtDate(article.created_at)}</span>
        </div>
        <span className="text-white/40">|</span>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} />
          <span>{estimateReadTime(article.content)} min read</span>
        </div>
        <span className="text-white/40">|</span>
        <div className="flex items-center gap-1 text-sm">
          <Heart size={14} className={isLiked ? "fill-red-500 text-red-500" : ""} />
          <span>{likesCount}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-sm transition-all ${
            isLiked ? "bg-red-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>
        <button
          onClick={onSave}
          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
            isSaved ? "bg-yellow-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <Bookmark size={18} className={isSaved ? "fill-current" : ""} />
        </button>
        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  </div>
);

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

const TagList = ({ tags }) => (
  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-2 flex items-center">
      Tags:
    </span>
    {tags.map((tagId) => {
      const tagName = getTagName(tagId);
      return (
        <Link
          key={tagId}
          to={`/articles?tag=${tagId}`}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-sm bg-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 }`}
        >
          {tagName}
        </Link>
      );
    })}
  </div>
);

const RelatedArticles = ({ articles, currentSlug }) => {
  const related = articles.filter((a) => a.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
        Related Articles
      </h3>
      <div className="space-y-3">
        {related.map((item) => (
          <Link
            key={item.article_id}
            to={`/articles/${item.slug}`}
            className="group block p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <img
                src={item.cover_img}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                  {item.type}
                </span>
                <h4 className="text-sm font-semibold text-gray-900 mt-0.5 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{fmtDate(item.created_at)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const PopularTags = () => {
  const allTags = getTags().sort((a, b) => b.count - a.count).slice(0, 8);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
        Popular Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Link
            key={tag.id}
            to={`/articles?tag=${tag.id}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-sm  bg-gray-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200`}
          >
            {tag.name}
            <span className="ml-1.5 opacity-60">({tag.count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

const ShareSection = ({ title }) => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const copyLink = () => navigator.clipboard.writeText(shareUrl);

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Share this article:
        </span>
        <div className="flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
          >
            <Twitter size={18} />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100 text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
          >
            <Linkedin size={18} />
          </a>
          <button
            onClick={copyLink}
            className="p-2.5 bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-all"
          >
            <LinkIcon size={18} />
          </button>
        </div>
      </div>
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
              <RelatedArticles articles={allArticles} currentSlug={article.slug} />
              <PopularTags />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;