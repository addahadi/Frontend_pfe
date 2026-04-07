// blog.service.js
import { articles, tags, likes, saves } from "../mocks/mock";

let tagsS = [...tags];
let articlesS = [...articles];
 
let listeners = [];

const notify = () => {
  listeners.forEach((cb) => cb());
};

export const subscribe = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};
// ─── Helper Functions ───────────────────────────────────────────────────────

const incrementTagCount = (tagId) => {
  const tag = tagsS.find((t) => t.id === tagId);
  if (tag) tag.count += 1;
};

const decrementTagCount = (tagId) => {
  const tag = tagsS.find((t) => t.id === tagId);
  if (tag && tag.count > 0) tag.count -= 1;
};

// ─── Article Services ─────────────────────────────────────────────────────────

export const createArticle = (data) => {
  const newArticle = {
    article_id: `a${Date.now()}`,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    cover_img: data.cover_img || "",
    content: data.content || "",
    status: data.status || "DRAFT",
    author_id: "u1",
    tags: data.tags || [],
    created_at: new Date().toISOString().split("T")[0],
  };

  articlesS.unshift(newArticle);
  
  // Update tag counts
  data.tags?.forEach((tagId) => incrementTagCount(tagId));
  notify();
  return newArticle;
};

export const getArticles = () => {
  return articlesS;
};

export const getPublishedArticles = () => {
  return articlesS.filter((a) => a.status === "PUBLISHED");
};

export const deleteArticle = (id) => {
  const article = articlesS.find((a) => a.article_id === id);
  
  // Decrement tag counts before deletion
  article?.tags?.forEach((tagId) => decrementTagCount(tagId));
  
  articlesS = articlesS.filter((a) => a.article_id !== id); 
  notify();
  return articlesS;
};

export const updateArticle = (id, data) => {
  const index = articlesS.findIndex((a) => a.article_id === id);
  if (index === -1) return null;

  const oldArticle = articlesS[index];
  const oldTags = oldArticle.tags || [];
  const newTags = data.tags || [];

  // Decrement counts for removed tags
  oldTags.forEach((tagId) => {
    if (!newTags.includes(tagId)) decrementTagCount(tagId);
  });

  // Increment counts for added tags
  newTags.forEach((tagId) => {
    if (!oldTags.includes(tagId)) incrementTagCount(tagId);
  });

  articlesS[index] = {
    ...oldArticle,
    ...data,
    updated_at: new Date().toISOString().split("T")[0],
  };
notify();
  return articlesS[index];
}; 

export const toggleLike = (userId, articleId) => {
  const index = likes.findIndex(
    (l) => l.user_id === userId && l.article_id === articleId
  );

  if (index !== -1) {
    likes.splice(index, 1);
  } else {
    likes.push({
      like_id: `l${Date.now()}`,
      user_id: userId,
      article_id: articleId,
    });
  }

  notify();
}; 

export const toggleSave = (userId, articleId) => {
  const index = saves.findIndex(
    (s) => s.user_id === userId && s.article_id === articleId
  );

  if (index !== -1) {
    saves.splice(index, 1);
  } else {
    saves.push({
      save_id: `s${Date.now()}`,
      user_id: userId,
      article_id: articleId,
    });
  }

  notify();
};

export const getArticlesWithDetails = () => {
  return articlesS.map((article) => {
    const tagNames = article.tags.map((tagId) => {
      const found = tagsS.find((t) => t.id === tagId);
      return found ? found.name : tagId;
    });

    const likesCount = likes.filter((l) => l.article_id === article.article_id).length;
    const savesCount = saves.filter((s) => s.article_id === article.article_id).length;

    return {
      ...article,
      tags: tagNames,
      likes: likesCount,
      saves: savesCount,
    };
  });
};

// ─── Tag Services ───────────────────────────────────────────────────────────

export const getTags = () => {
  return tagsS;
};

export const getTagName = (tagId) => {
  return tagsS.find((t) => t.id === tagId)?.name || tagId;
};

export const addTag = (name) => {
  const newTag = {
    id: `t${Date.now()}`,
    name,
    count: 0,
  };

  tagsS = [newTag, ...tagsS];
  return newTag;
};

export const deleteTag = (id) => {
  // Remove tag from all articles first
  articlesS = articlesS.map((article) => ({
    ...article,
    tags: article.tags?.filter((tagId) => tagId !== id) || [],
  }));

  tagsS = tagsS.filter((tag) => tag.id !== id);
  return tagsS;
};

// ─── Like Services ────────────────────────────────────────────────────────────

export const getLikesCount = (articleId) => {
  return likes.filter((l) => l.article_id === articleId).length;
};

// ─── Save Services ──────────────────────────────────────────────────────────

export const getSavesCount = (articleId) => {
  return saves.filter((s) => s.article_id === articleId).length;
};