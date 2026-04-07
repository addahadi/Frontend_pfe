import React, { useState, useEffect } from "react";
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

// ── Helper Functions ─────────────────────────────────────────────────────────

const fmtDate = (iso) => {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const estimateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

const getTagColor = (tagName) => {
  const colors = {
    "Béton armé": "bg-orange-100 text-orange-700 border-orange-200",
    Fondations: "bg-amber-100 text-amber-700 border-amber-200",
    Isolation: "bg-cyan-100 text-cyan-700 border-cyan-200",
    "Calcul de charge": "bg-purple-100 text-purple-700 border-purple-200",
    Maçonnerie: "bg-stone-100 text-stone-700 border-stone-200",
    Enduit: "bg-pink-100 text-pink-700 border-pink-200",
    Carrelage: "bg-teal-100 text-teal-700 border-teal-200",
    "Actualité BTP": "bg-blue-100 text-blue-700 border-blue-200",
    Youcef: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };
  return colors[tagName] || "bg-gray-100 text-gray-700 border-gray-200";
};

// ── Sub Components ───────────────────────────────────────────────────────────

const Hero = ({ article, likesCount, isLiked, isSaved, onLike, onSave }) => (
  <div className="relative h-[300px] md:h-[400px] lg:h-[450px] rounded-xl overflow-hidden mb-8 shadow-lg">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${article.cover_img})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
    </div>

    {/* Back Button */}
    <Link
      to="/articles"
      className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors z-10"
    >
      <ChevronLeft size={20} />
    </Link>

    {/* Content */}
    <div className="relative h-full flex flex-col justify-end p-6 md:p-10">
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold uppercase tracking-wider">
          {article.tags[0] ? getTagName(article.tags[0]) : "Article"}
        </span>
        {article.tags.length > 1 && (
          <span className="inline-flex w-fit items-center px-2 py-1 rounded-full bg-white/20 text-white text-xs backdrop-blur-sm">
            +{article.tags.length - 1}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white max-w-3xl leading-tight mb-4">
        {article.title}
      </h1>

      {/* Meta Info (No Author) */}
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

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full backdrop-blur-sm transition-all ${
            isLiked
              ? "bg-red-500 text-white"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
          <span className="text-sm font-medium">{likesCount}</span>
        </button>
        <button
          onClick={onSave}
          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
            isSaved
              ? "bg-yellow-500 text-white"
              : "bg-white/20 text-white hover:bg-white/30"
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
  // Split content by newlines to create paragraphs if needed
  const contentParagraphs = article.content
    .split("\n")
    .filter((p) => p.trim().length > 0);

  return (
    <div className="prose max-w-none">
      {/* Excerpt as intro */}
      <p className="text-base md:text-lg text-gray-600 italic leading-relaxed mb-6 border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-2 pr-4 rounded-r-lg">
        {article.excerpt}
      </p>

      {/* Main content - real data only */}
      {contentParagraphs.length > 1 ? (
        contentParagraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base"
          >
            {paragraph}
          </p>
        ))
      ) : (
        <p className="text-gray-600 leading-relaxed mb-4 text-sm md:text-base whitespace-pre-wrap">
          {article.content}
        </p>
      )}
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
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all hover:shadow-sm ${getTagColor(
            tagName
          )}`}
        >
          {tagName}
        </Link>
      );
    })}
  </div>
);

const RelatedArticles = ({ articles, currentSlug }) => {
  const related = articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, 3);

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
                  {item.tags[0] ? getTagName(item.tags[0]) : "Article"}
                </span>
                <h4 className="text-sm font-semibold text-gray-900 mt-0.5 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {fmtDate(item.created_at)}
                </p>
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
        <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
        Popular Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Link
            key={tag.id}
            to={`/articles?tag=${tag.id}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-sm ${getTagColor(
              tag.name
            )}`}
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
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="border-t border-gray-200 pt-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Share this article:
        </span>
        <div className="flex items-center gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-gray-100 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
          >
            <Twitter size={18} />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`}
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
  const [article, setArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);



  useEffect(() => {
    setLoading(true);

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
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSave = () => {
    if (!article) return;
    setSaved(!saved);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Article Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            The article you're looking for doesn't exist.
          </p>
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
              <RelatedArticles
                articles={allArticles}
                currentSlug={article.slug}
              />
              <PopularTags />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView;