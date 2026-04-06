// blog.service.js
import { articles, tags, likes, saves } from "../mocks/mock";

let tagsS = [...tags];

// get all tags
export const getTags = () => {
  return tagsS;
};

// add new tag
export const addTag = (name) => {
  const newTag = {
    id: `t${Date.now()}`, // ✅ dynamic
    name,
    count: 0,
  };

  tagsS = [newTag, ...tagsS]; // ✅ FIXED (NOT tags)
  return newTag;
};

// delete tag
export const deleteTag = (id) => {
  tagsS = tagsS.filter((tag) => tag.id !== id);
  return tagsS;
};

let articlesS = [...articles];

// get all
export const getArticles = () => {
  return articlesS;
};

// delete
export const deleteArticle = (id) => {
  articlesS = articlesS.filter(
    (a) => a.article_id !== id   // ✅ FIXED
  );
  return articlesS;
};
export const getArticlesWithDetails = () => {
  return articles.map((article) => {
    // ✅ convert tag IDs → tag names
    const tagNames = article.tags.map((tagId) => {
      const found = tags.find((t) => t.id === tagId);
      return found ? found.name : tagId;
    });

    // ✅ count likes
    const likesCount = likes.filter((l) => l.article_id === article.article_id).length;

    // ✅ count saves
    const savesCount = saves.filter((s) => s.article_id === article.article_id).length;

    return {
      ...article,
      tags: tagNames, // 👈 replaced
      likes: likesCount,
      saves: savesCount,
    };
  });
};
