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
 
export const getTagsWithCount = () => {
  return tags.map((tag) => ({
    ...tag,
    count: articles.filter(
      (a) => Array.isArray(a.tags) && a.tags.includes(tag.id)
    ).length,
  }));
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
  return tags.map((tag) => ({
    ...tag,
    count: articles.filter(
      (a) => Array.isArray(a.tags) && a.tags.includes(tag.id)
    ).length,
  }));
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

// ─── Related Articles Service ────────────────────────────────────────────────

/**
 * Find related articles based on shared tags with relevance scoring
 * @param {string} currentArticleId - Article to exclude from results
 * @param {string[]} currentTags - Array of tag IDs to match against
 * @param {number} limit - Max results to return
 * @returns {Array} Articles sorted by relevance (shared tags + recency)
 */
export const getRelatedArticles = (currentArticleId, currentTags = [], limit = 3) => {
  if (!currentTags.length) return [];
  
  const published = getPublishedArticles().filter(
    (a) => a.article_id !== currentArticleId
  );
  
  // Score each article by shared tags and recency
  const scored = published.map((article) => {
    const articleTags = article.tags || [];
    
    // Count matching tags
    const sharedTags = articleTags.filter((tagId) => 
      currentTags.includes(tagId)
    );
    
    const sharedCount = sharedTags.length;
    
    // Recency bonus (0.5 points if within last 30 days)
    const daysOld = Math.floor(
      (Date.now() - new Date(article.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    const recencyBonus = daysOld < 30 ? 0.5 : 0;
    
    // Calculate reading time
    const contentLength = typeof article.content === 'string' 
      ? article.content.length 
      : JSON.stringify(article.content).length;
    const readingTime = Math.max(1, Math.round(contentLength / 1000));
    
    // Get tag names for display
    const sharedTagNames = sharedTags.slice(0, 2).map(getTagName);
    
    return {
      ...article,
      relevanceScore: sharedCount + recencyBonus,
      sharedTagsCount: sharedCount,
      sharedTags: sharedTagNames,
      readingTime,
    };
  });
  
  // Sort by score descending, then by date
  return scored
    .filter((a) => a.relevanceScore > 0)
    .sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, limit);
};

/**
 * Fallback: Get recent articles when no tag matches found
 */
export const getRecentArticles = (excludeId, limit = 3) => {
  return getPublishedArticles()
    .filter((a) => a.article_id !== excludeId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
    .map((article) => ({
      ...article,
      readingTime: Math.max(1, Math.round(JSON.stringify(article.content).length / 1000)),
      relevanceScore: 0,
      sharedTagsCount: 0,
      sharedTags: [],
    }));
};