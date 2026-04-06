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
    tags: ["t1", "t2","t9"],
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
    status: "DRAFT",
    author_id: "u1",
    tags: ["t4"],
    created_at: "2026-04-03",
  },
];

export const tags = [
 { id: 't1', name: 'Béton armé', count: 1 },
  { id: 't2', name: 'Fondations', count: 2 },
  { id: 't3', name: 'Isolation', count: 1 },
  { id: 't4', name: 'Calcul de charge', count: 1 },
  { id: 't5', name: 'Maçonnerie', count: 1 },
  { id: 't6', name: 'Enduit', count: 0 },
  { id: 't7', name: 'Carrelage', count: 0 },
  { id: 't8', name: 'Actualité BTP', count: 2 }, 
    { id: 't9', name: 'Youcef', count: 2 },
]; 


export const likes = [
  {
    like_id: "l1",
    user_id: "u1",
    article_id: "a2",
  },
  {
    like_id: "l2",
    user_id: "u2",
    article_id: "a1",
  },
  {
    like_id: "l3",
    user_id: "u3",
    article_id: "a1",
  },
];  
export const saves = [
  {
    save_id: "s1",
    user_id: "u1",
    article_id: "a1",
  },
  {
    save_id: "s2",
    user_id: "u2",
    article_id: "a2",
  },
];

// get article likes count
export const getLikesCount = (articleId) => {
  return likes.filter((l) => l.article_id === articleId).length;
};

// check if user liked
export const isLiked = (userId, articleId) => {
  return likes.some(
    (l) => l.user_id === userId && l.article_id === articleId
  );
};

// check if saved
export const isSaved = (userId, articleId) => {
  return saves.some(
    (s) => s.user_id === userId && s.article_id === articleId
  );
};