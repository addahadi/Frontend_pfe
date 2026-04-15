import React, { useState, useMemo, useEffect } from "react";
import {
  getLikesCount,
  getTagName,
  getPublishedArticles,
  getTags, 
} from "../services/blog.service"; 

// ── Constants ─────────────────────────────────────────────────────────────────
const ARTICLES_PER_PAGE = 9;

// ── Component ─────────────────────────────────────────────────────────────────
const PublicArticles = () => { 
  const published = getPublishedArticles(); 

  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const tags = useMemo(() => getTags(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return published.filter((a) => {
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q);
      const matchTag = !activeTag || a.tags.includes(activeTag);
      return matchSearch && matchTag;
    });
  }, [published, search, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ARTICLES_PER_PAGE,
    safePage * ARTICLES_PER_PAGE
  );

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentPage(1);
  }, [search, activeTag]);

  const handleSearch = (e) => setSearch(e.target.value);
  const handleTagClick = (tagId) => setActiveTag((prev) => (prev === tagId ? null : tagId));
  const handlePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  const clearFilters = () => {
    setSearch("");
    setActiveTag(null);
    setCurrentPage(1);
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const hasNoPublishedArticles = published.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div className="max-w-full mx-auto">
        {/* Page Header */}
        <div className="mb-10 max-w-4xl animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Insights & Updates</h1>
          <p className="text-gray-500 text-sm">
            Stay informed with the latest trends in sustainable construction,
            quantity surveying, and digital transformation in the industry.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Article Grid */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            {hasNoPublishedArticles ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100 border-dashed animate-fade-in-up">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-lg font-medium text-gray-600 mb-1">No Published Articles Yet</p>
                <p className="text-sm text-gray-400 max-w-sm text-center">
                  Check back later for new insights and updates.
                </p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-xl border border-gray-100 animate-fade-in-up">
                <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">No articles found</p>
                <button onClick={clearFilters} className="mt-3 text-xs text-blue-600 hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {paginated.map((article, index) => (
                  <article
                    key={article.article_id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col animate-fade-in-up group"
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    {/* Image with Zoom Effect */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={article.cover_img}
                        alt={article.title}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {article.type && (
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-semibold px-2.5 py-1 rounded uppercase tracking-wide shadow-sm transform transition-transform group-hover:translate-y-0.5">
                          {article.type}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                        <span>{fmtDate(article.created_at)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                          </svg>
                          {getLikesCount(article.article_id)}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                        {article.title}
                      </h2>

                      <p className="text-sm text-gray-600 leading-relaxed mb-3 flex-1 line-clamp-3">
                        {article.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {article.tags.slice(0, 3).map((tid) => (
                          <button
                            key={`${article.article_id}-${tid}`}
                            onClick={() => handleTagClick(tid)}
                            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                              activeTag === tid
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            {getTagName(tid)}
                          </button>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-[11px] text-gray-400 px-1">+{article.tags.length - 3}</span>
                        )}
                      </div>

                      <a
                        href={`/articles/${article.slug}`}
                        className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 w-fit group/link"
                      >
                        Read More
                        <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!hasNoPublishedArticles && totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-8 animate-fade-in-up">
                <button
                  onClick={() => handlePage(safePage - 1)}
                  disabled={safePage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 text-sm transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePage(page)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                      safePage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 text-sm transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-56 flex-shrink-0 space-y-4 order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            {!hasNoPublishedArticles && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 pr-9 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                </div>
              </div>
            )}

            {(activeTag || search) && !hasNoPublishedArticles && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between animate-fade-in-up">
                <span className="text-xs text-blue-800 font-medium truncate">
                  {activeTag ? `Tag: ${getTagName(activeTag)}` : `Search: "${search}"`}
                </span>
                <button onClick={clearFilters} className="text-blue-500 hover:bg-blue-100 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagClick(tag.id)}
                    className={`text-xs rounded-lg px-2.5 py-1.5 transition-colors flex items-center gap-1 border ${
                      activeTag === tag.id
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {tag.name}
                    <span className={`text-[10px] px-1 py-0.5 rounded-full ${activeTag === tag.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                      {tag.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {!hasNoPublishedArticles && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Results</h3>
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{Math.min((safePage - 1) * ARTICLES_PER_PAGE + 1, filtered.length)}–{Math.min(safePage * ARTICLES_PER_PAGE, filtered.length)}</span> of <span className="font-semibold">{filtered.length}</span>
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PublicArticles;