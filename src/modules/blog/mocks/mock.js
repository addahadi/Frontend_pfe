// ─────────────────────────────────────────────────────────
//  MOCK DATABASE (Blog Module) with localStorage persistence
// ─────────────────────────────────────────────────────────

// Helper to get initial data from localStorage or use defaults
const getInitialData = (key, defaultData) => {
  if (typeof window === 'undefined') return defaultData;
  const stored = localStorage.getItem(`quantconstruct_${key}`);
  return stored ? JSON.parse(stored) : defaultData;
};

// Helper to save to localStorage
const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`quantconstruct_${key}`, JSON.stringify(data));
};
//  Articles
export const defaultArticles = [
  {
    article_id: "a1",
    title: "test", 
    slug: "test",
    excerpt: "AI is transforming the world...",
    cover_img: "https://picsum.photos/400/200?1",
    content: "test test test test",
    status: "PUBLISHED",
    type: "BLOG", // ← ADD THIS
    author_id: "u1",
    tags: ["t1", "t2", "t9"],
    created_at: "2026-04-01",
  },
  {
    article_id: "a2",
    title: "React Best Practices",
    slug: "react-best-practices", 
    type: "BLOG", // ← ADD THIS
    excerpt: "Improve your React apps...",
    cover_img: "https://picsum.photos/400/200?2",
    content: "Full content of React article...",
    status: "PUBLISHED",
    author_id: "u2",
    tags: ["t3"],
    created_at: "2026-04-02",
  },
  {
    article_id: "a3",
    title: "UI Design Trends 2026",
    slug: "ui-trends-2026", 
    excerpt: "Modern UI trends...",
    cover_img: "https://picsum.photos/400/200?3",
    content: "Full content of design article...",
    status: "PUBLISHED", 
       type: "BLOG", // ← ADD THIS
    author_id: "u1",
    tags: ["t4"],
    created_at: "2026-04-03",
  },

  //  MORE ARTICLES

  {
    article_id: "a4",
    title: "Sustainable Construction Methods",
    slug: "sustainable-construction",
    excerpt: "Eco-friendly building techniques...",
    cover_img: "https://picsum.photos/400/200?4",
    content: "Full content...",
    status: "PUBLISHED", 
       type: "BLOG", // ← ADD THIS
    author_id: "u3",
    tags: ["t8", "t5"],
    created_at: "2026-04-04",
  },
  {
    article_id: "a5",
    title: "Concrete Strength Guide",
    slug: "concrete-strength",
    excerpt: "Understanding concrete resistance...",
    cover_img: "https://picsum.photos/400/200?5",
    content: "Full content...",
    status: "PUBLISHED", 
       type: "BLOG", // ← ADD THIS
    author_id: "u2",
    tags: ["t1", "t4"],
    created_at: "2026-04-05",
  },
  {
    article_id: "a6",
    title: "Foundation Types Explained",
    slug: "foundation-types",
    excerpt: "Different foundations in construction...",
    cover_img: "https://picsum.photos/400/200?6",
    content: "Full content...",
    status: "PUBLISHED", 
       type: "BLOG", // ← ADD THIS
    author_id: "u1",
    tags: ["t2"],
    created_at: "2026-04-06",
  },
  {
    article_id: "a7",
    title: "Thermal Insulation Guide",
    slug: "thermal-insulation",
    excerpt: "Energy efficiency in buildings...",
    cover_img: "https://picsum.photos/400/200?7",
    content: "Full content...",
    status: "PUBLISHED", 
       type: "BLOG", // ← ADD THIS
    author_id: "u2",
    tags: ["t3"],
    created_at: "2026-04-07",
  },
  {
    article_id: "a8",
    title: "test article ",
    slug: "test-test",
    excerpt: "Advanced masonry work...",
    cover_img: "https://picsum.photos/400/200?8",
    content: "Full content...",
    status: "PUBLISHED", 
       type: "BLOG", // ← ADD THIS
    author_id: "u3",
    tags: ["t5"],
    created_at: "2026-04-08",
  },
 
];

const defaultTags = [
  { id: "t1", name: "Béton armé", count: 4 },
  { id: "t2", name: "Fondations", count: 3 },
  { id: "t3", name: "Isolation", count: 4 },
  { id: "t4", name: "Calcul de charge", count: 4 },
  { id: "t5", name: "Maçonnerie", count: 3 },
  { id: "t6", name: "Enduit", count: 2 },
  { id: "t7", name: "Carrelage", count: 2 },
  { id: "t8", name: "Actualité BTP", count: 5 },
  { id: "t9", name: "Youcef", count: 2 },
];

const defaultLikes = [
  { like_id: "l1", user_id: "u1", article_id: "a2" },
  { like_id: "l2", user_id: "u2", article_id: "a1" },
  { like_id: "l3", user_id: "u3", article_id: "a1" },
  { like_id: "l4", user_id: "u1", article_id: "a4" },
  { like_id: "l5", user_id: "u2", article_id: "a5" },
  { like_id: "l6", user_id: "u3", article_id: "a6" },
  { like_id: "l7", user_id: "u1", article_id: "a7" },
  { like_id: "l8", user_id: "u2", article_id: "a8" },
  { like_id: "l9", user_id: "u3", article_id: "a9" },
  { like_id: "l10", user_id: "u1", article_id: "a10" },
];

const defaultSaves = [
  { save_id: "s1", user_id: "u1", article_id: "a1" },
  { save_id: "s2", user_id: "u2", article_id: "a2" },
  { save_id: "s3", user_id: "u3", article_id: "a3" },
  { save_id: "s4", user_id: "u1", article_id: "a4" },
  { save_id: "s5", user_id: "u2", article_id: "a5" },
  { save_id: "s6", user_id: "u3", article_id: "a6" },
];

// Initialize from localStorage or defaults
// These are the SINGLE SOURCE OF TRUTH - mutable arrays
export let articles = getInitialData('articles', defaultArticles);
export let tags = getInitialData('tags', defaultTags);
export let likes = getInitialData('likes', defaultLikes);
export let saves = getInitialData('saves', defaultSaves);

// Sync function to persist changes to localStorage
export const syncToStorage = () => {
  saveToStorage('articles', articles);
  // احفظ التاغات بدون count لأنه دائماً يُحسب من المقالات  
  
  // eslint-disable-next-line no-unused-vars
  saveToStorage('tags', tags.map(({ count, ...rest }) => rest));
  saveToStorage('likes', likes);
  saveToStorage('saves', saves);

}; 

// Reset to defaults
export const resetMockData = () => {
  localStorage.removeItem('quantconstruct_articles');
  localStorage.removeItem('quantconstruct_tags');
  localStorage.removeItem('quantconstruct_likes');
  localStorage.removeItem('quantconstruct_saves');
  window.location.reload();
};

// ─────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────

export const getLikesCount = (articleId) => {
  return likes.filter((l) => l.article_id === articleId).length;
};

export const isLiked = (userId, articleId) => {
  return likes.some((l) => l.user_id === userId && l.article_id === articleId);
};

export const isSaved = (userId, articleId) => {
  return saves.some((s) => s.user_id === userId && s.article_id === articleId);
};