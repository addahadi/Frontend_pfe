// ─────────────────────────────────────────────────────────
//  MOCK DATABASE (Blog Module)
// ─────────────────────────────────────────────────────────

//  Articles
export const articles = [
  {
    article_id: "a1",
    title: "Introduction to Artificial Intelligence",
    slug: "intro-to-ai",
    excerpt: "AI is transforming the world...",
    cover_img: "https://picsum.photos/400/200?1",
    content: "Full content of AI article...",
    status: "PUBLISHED",
    author_id: "u1",
    tags: ["t1", "t2", "t9"],
    created_at: "2026-04-01",
  },
  {
    article_id: "a2",
    title: "React Best Practices",
    slug: "react-best-practices",
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
    author_id: "u2",
    tags: ["t3"],
    created_at: "2026-04-07",
  },
  {
    article_id: "a8",
    title: "Modern Masonry Techniques",
    slug: "modern-masonry",
    excerpt: "Advanced masonry work...",
    cover_img: "https://picsum.photos/400/200?8",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u3",
    tags: ["t5"],
    created_at: "2026-04-08",
  },
  {
    article_id: "a9",
    title: "Wall Finishing with Enduit",
    slug: "wall-enduit",
    excerpt: "Smooth wall finishes...",
    cover_img: "https://picsum.photos/400/200?9",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u1",
    tags: ["t6"],
    created_at: "2026-04-09",
  },
  {
    article_id: "a10",
    title: "Carrelage Installation Tips",
    slug: "carrelage-installation",
    excerpt: "Tile installation tips...",
    cover_img: "https://picsum.photos/400/200?10",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u2",
    tags: ["t7"],
    created_at: "2026-04-10",
  },
  {
    article_id: "a11",
    title: "BTP Industry News",
    slug: "btp-news",
    excerpt: "Latest construction updates...",
    cover_img: "https://picsum.photos/400/200?11",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u3",
    tags: ["t8"],
    created_at: "2026-04-11",
  },
  {
    article_id: "a12",
    title: "Load Calculation Basics",
    slug: "load-calculation",
    excerpt: "Structural load basics...",
    cover_img: "https://picsum.photos/400/200?12",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u1",
    tags: ["t4"],
    created_at: "2026-04-12",
  },
  {
    article_id: "a13",
    title: "Personal Blog by Youcef",
    slug: "youcef-blog",
    excerpt: "Personal thoughts...",
    cover_img: "https://picsum.photos/400/200?13",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u1",
    tags: ["t9"],
    created_at: "2026-04-13",
  },
  {
    article_id: "a14",
    title: "Advanced React Patterns",
    slug: "advanced-react",
    excerpt: "Level up your React skills...",
    cover_img: "https://picsum.photos/400/200?14",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u2",
    tags: ["t3"],
    created_at: "2026-04-14",
  },
  {
    article_id: "a15",
    title: "Future of Smart Buildings",
    slug: "smart-buildings",
    excerpt: "IoT in construction...",
    cover_img: "https://picsum.photos/400/200?15",
    content: "Full content...",
    status: "PUBLISHED",
    author_id: "u3",
    tags: ["t8", "t4"],
    created_at: "2026-04-15",
  },
];

//  Tags
export const tags = [
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

//  Likes
export const likes = [
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

//  Saves
export const saves = [
  { save_id: "s1", user_id: "u1", article_id: "a1" },
  { save_id: "s2", user_id: "u2", article_id: "a2" },
  { save_id: "s3", user_id: "u3", article_id: "a3" },
  { save_id: "s4", user_id: "u1", article_id: "a4" },
  { save_id: "s5", user_id: "u2", article_id: "a5" },
  { save_id: "s6", user_id: "u3", article_id: "a6" },
];

// ─────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────

// Count likes
export const getLikesCount = (articleId) => {
  return likes.filter((l) => l.article_id === articleId).length;
};

//  Check if liked
export const isLiked = (userId, articleId) => {
  return likes.some(
    (l) => l.user_id === userId && l.article_id === articleId
  );
};

//  Check if saved
export const isSaved = (userId, articleId) => {
  return saves.some(
    (s) => s.user_id === userId && s.article_id === articleId
  );
};