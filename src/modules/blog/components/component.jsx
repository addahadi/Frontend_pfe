import { useEffect, useState, useCallback } from "react";

// router (ناقص عندك)
import { Link } from "react-router-dom";

// lexical
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

// icons (كان ناقص بزاف هنا)
import {
  CheckCircle2,
  X,
  Calendar,
  Clock,
  Heart,
  Bookmark,
  Share2,
  ChevronLeft,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";

// services
import { getTagName, getTags } from "../services/blog.service";

// utils
import { estimateReadTime, fmtDate } from "../utils/blog.utils"; 


// ═══════════════════════════════════════════════════════════════════════════════
// Confirm Delete Dialog popup for admin article page
// ═══════════════════════════════════════════════════════════════════════════════
export const ConfirmDialog = ({ article, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[popIn_0.2s_ease-out]">
        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className="text-center text-gray-900 font-bold text-base mb-1">Delete Article?</h3>
        <p className="text-center text-gray-500 text-sm mb-1">You are about to delete:</p>
        <p className="text-center text-gray-800 font-semibold text-sm mb-5 px-2 truncate">"{article.title}"</p>
        <p className="text-center text-red-500 text-xs mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors">Yes, Delete</button>
        </div>
      </div>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}; 




// ═══════════════════════════════════════════════════════════════════════════════
// Badges
// ═══════════════════════════════════════════════════════════════════════════════
export const TypeBadge = ({ type }) => {
  const styles = {
    BLOG:      "text-blue-500 bg-blue-50 border border-blue-200",
    ACTUALITE: "text-amber-500 bg-amber-50 border border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide ${styles[type]}`}>
      {type}
    </span>
  );
};  
export const StatusBadge = ({ status }) => {
  const styles = {
    PUBLISHED: "text-green-600 bg-green-50 border border-green-200",
    DRAFT:     "text-amber-600 bg-amber-50 border border-amber-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}; 
 

// ═══════════════════════════════════════════════════════════════════════════════
// Toast Notification
// ═══════════════════════════════════════════════════════════════════════════════
 export const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = { 
    success: "bg-green-500", 
    draft: "bg-blue-500",
    error: "bg-red-500"  // ← REQUIRED for error messages
  };

  // Use different icons for different types
  const getIcon = () => {
    if (type === 'error') {
      return <X size={18} className="flex-shrink-0" />; // X icon for errors
    }
    return <CheckCircle2 size={18} className="flex-shrink-0" />; // Check for success/draft
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5
                  rounded-2xl shadow-2xl text-white text-sm font-medium
                  ${styles[type] || styles.success}`}  // ← Fallback to success if type unknown
      style={{ animation: "slideUp 0.3s ease-out" }}
    >
      {getIcon()}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <X size={15} />
      </button>
      <div className="absolute bottom-0 left-0 h-1 rounded-b-2xl bg-white/30 w-full overflow-hidden">
        <div className="h-full bg-white/60 rounded-b-2xl" style={{ animation: "shrink 3.5s linear forwards" }} />
      </div>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shrink  { from { width:100%; } to { width:0%; } }
      `}</style>
    </div>
  );
};
// ═══════════════════════════════════════════════════════════════════════════════
// Character Count
// ═══════════════════════════════════════════════════════════════════════════════
export  function CharacterCountDisplay({ limit = 10000 }) {
  const [editor] = useLexicalComposerContext();
  const [count, setCount] = useState(0);
  useEffect(() => editor.registerUpdateListener(({ editorState }) => { editorState.read(() => { setCount($getRoot().getTextContent().length); }); }), [editor]);
  const pct = Math.min((count / limit) * 100, 100);
  const color = pct > 90 ? "text-red-500" : pct > 70 ? "text-yellow-500" : "text-gray-400";
  return (
    <div className={`flex items-center gap-1.5 text-xs ${color} select-none`}>
      <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${pct > 90 ? "bg-red-400" : pct > 70 ? "bg-yellow-400" : "bg-blue-400"}`} style={{ width: `${pct}%` }} />
      </div>
      {count} / {limit.toLocaleString()}
    </div>
  );}

// ═══════════════════════════════════════════════════════════════════════════════
// tagselector
// ═══════════════════════════════════════════════════════════════════════════════

  export   const TagSelector = ({ options, selected, onChange }) => {
      const toggleTag = useCallback((id) => {
        onChange(selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id]);
      }, [selected, onChange]);
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((tag) => {
            const active = selected.includes(tag.id);
            return (
              <button key={tag.id} onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1.5 rounded-full text-xs border ${active ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
                {tag.name}
              </button>
            );
          })}
        </div>
      );
    }; 



// ═══════════════════════════════════════════════════════════════════════════════
// ArticleView Components 
// ═══════════════════════════════════════════════════════════════════════════════ 


    
export const Hero = ({ article, likesCount, isLiked, isSaved, onLike, onSave }) => (
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



 export const TagList = ({ tags }) => (
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

export const RelatedArticles = ({ articles, currentSlug }) => {
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

export const PopularTags = () => {
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

export const ShareSection = ({ title }) => {
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


// ═══════════════════════════════════════════════════════════════════════════════
// Icons
// ═══════════════════════════════════════════════════════════════════════════════
export const HeartIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

 export const BookmarkIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

export const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

 export const ArchiveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
);

export const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

export const PublishIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 8 12 16" />
    <polyline points="8 12 12 8 16 12" />
  </svg>
);

export const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
); 

