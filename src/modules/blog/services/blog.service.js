// blog.service.js
import { 
  articles, 
  tags, 
  likes, 
  saves, 
  syncToStorage 
} from "../mocks/mock";
 
// Use the exported arrays directly - no copies!
// This ensures all modifications affect the same references

// ─── Helper Functions ───────────────────────────────────────────────────────

const incrementTagCount = (tagId) => {
  const tag = tags.find((t) => t.id === tagId);
  if (tag) tag.count += 1;
};

const decrementTagCount = (tagId) => {
  const tag = tags.find((t) => t.id === tagId);
  if (tag && tag.count > 0) tag.count -= 1;
}; 

export const isLexicalJson = (content) => {
  try {
    const parsed = JSON.parse(content);
    return parsed?.root !== undefined;
  } catch {
    return false;
  }
};

// Auto-sync helper
const persist = () => {
  syncToStorage();
};

// ─── Article Services ─────────────────────────────────────────────────────────

export const createArticle = (data) => {
  const newArticle = {
    article_id: `a${Date.now()}`,
    title: data.title,
    slug: data.slug,
    type: data.type,
    excerpt: data.excerpt,
    cover_img: data.cover_img || "",
    content: data.content || "",
    status: data.status || "DRAFT",
    author_id: "u1",
    tags: data.tags || [],
    created_at: new Date().toISOString().split("T")[0],
  };

  // Modify the exported array directly
  articles.unshift(newArticle);
  
  data.tags?.forEach((tagId) => incrementTagCount(tagId));
  
  persist();
  
  return newArticle;
};

export const getArticles = () => {
  return articles;
};

export const getPublishedArticles = () => {
  return articles.filter((a) => a.status === "PUBLISHED");
};

export const deleteArticle = (id) => {
  const article = articles.find((a) => a.article_id === id);
  
  article?.tags?.forEach((tagId) => decrementTagCount(tagId));
  
  // Modify array in place
  const index = articles.findIndex((a) => a.article_id === id);
  if (index > -1) articles.splice(index, 1);
  
  persist();
  
  return articles;
};

export const updateArticle = (id, data) => {
  const index = articles.findIndex((a) => a.article_id === id);
  if (index === -1) return null;

  const oldArticle = articles[index];
  const oldTags = oldArticle.tags || [];
  const newTags = data.tags || [];

  oldTags.forEach((tagId) => {
    if (!newTags.includes(tagId)) decrementTagCount(tagId);
  });

  newTags.forEach((tagId) => {
    if (!oldTags.includes(tagId)) incrementTagCount(tagId);
  });

  articles[index] = {
    ...oldArticle,
    ...data,
    updated_at: new Date().toISOString().split("T")[0],
  };

  persist();

  return articles[index];
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

  persist();
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

  persist();
};

export const getArticlesWithDetails = () => {
  return articles.map((article) => {
    const tagNames = article.tags.map((tagId) => {
      const found = tags.find((t) => t.id === tagId);
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
  return tags;
};

export const getTagName = (tagId) => {
  return tags.find((t) => t.id === tagId)?.name || tagId;
};

export const addTag = (name) => {
  const newTag = {
    id: `t${Date.now()}`,
    name,
    count: 0,
  };

  tags.unshift(newTag);
  
  persist();
  
  return newTag;
};

export const deleteTag = (id) => {
  // Update articles in place
  articles.forEach((article, idx) => {
    articles[idx] = {
      ...article,
      tags: article.tags?.filter((tagId) => tagId !== id) || [],
    };
  });

  const tagIndex = tags.findIndex((t) => t.id === id);
  if (tagIndex > -1) tags.splice(tagIndex, 1);
  
  persist();
  
  return tags;
};

// ─── Like/Save Services ─────────────────────────────────────────────────────

export const getLikesCount = (articleId) => {
  return likes.filter((l) => l.article_id === articleId).length;
};

export const getSavesCount = (articleId) => {
  return saves.filter((s) => s.article_id === articleId).length;
};