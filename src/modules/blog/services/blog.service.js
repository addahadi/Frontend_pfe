// src/services/blog.service.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

// ── خطأ API مخصص ────────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * publicFetch — بدون توثيق، يعمل مع CORS wildcard (*)
 * مستخدم في: المقالات، الوسوم، القراءة العامة
 */
const publicFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    let data = {};
    try { data = await res.json(); } catch { /* non-JSON */ }

    if (!res.ok) {
      throw new ApiError(
        data?.error?.message || `Request failed: ${res.status}`,
        res.status
      );
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw err;
  }
};

/**
 * apiFetch — مع Bearer token
 * مستخدم في: كل نقاط /admin/*
 * ⚠️ يتطلب أن يضبط الـ backend Access-Control-Allow-Origin للأصل الحقيقي
 *    وليس (*) وأن يضع Access-Control-Allow-Credentials: true
 */
const apiFetch = async (endpoint, options = {}) => {
  const url   = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });

    let data = {};
    try { data = await res.json(); } catch { /* non-JSON */ }

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("token");
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("auth:unauthorized", {
              detail: { message: data?.error?.message || "Unauthorized" },
            })
          );
        }
        throw new Error(data?.error?.message || "Unauthorized - Please login again");
      }
      throw new ApiError(
        data?.error?.message || `Request failed: ${res.status}`,
        res.status
      );
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Network error: Unable to connect to server");
    }
    throw err;
  }
};

// ── مساعدات ───────────────────────────────────────────────────────────────────
const extractData       = (res) => res.data?.data   || res.data   || [];
const extractPagination = (res) => res.data?.pagination || res.pagination || null;
const extractItem       = (res) => res.data?.data   || res.data   || null;

// ── كاش الوسوم ────────────────────────────────────────────────────────────────
let tagsCache = [];

const mapTag = (t) => ({
  id:      t.tag_id  || t.id,
  name:    t.name_en || t.name,
  name_en: t.name_en,
  name_ar: t.name_ar,
  count:   Number(t.count) || 0,
});

const mapArticle = (article, lang = "en") => {
  const isAr = lang === "ar";
  return {
    ...article,
    article_id:   article.article_id || article.id,
    title:        isAr ? (article.title_ar   || article.title)   : (article.title_en   || article.title),
    excerpt:      isAr ? (article.excerpt_ar  || article.excerpt) : (article.excerpt_en  || article.excerpt),
    content:      isAr ? (article.content_ar  || article.content) : (article.content_en  || article.content),
type:
  article.type ||
  article.type_name_en ||
  "BLOG",
    tags:         article.tags?.map((t) => t.tag_id || t.id || t) || [],
    tagObjects:   article.tags || [],
    likesCount:   Number(article.likesCount  ?? article.likes_count  ?? 0),
    savesCount:   Number(article.savesCount  ?? article.saves_count  ?? 0),
    created_at:   article.created_at,
    updated_at:   article.updated_at,
    published_at: article.published_at,
    cover_img:    article.cover_img,
    slug:         article.slug,
    status:       article.status,
  };
};

// ─── APIs العامة (لا تحتاج توثيق) ────────────────────────────────────────────

export const fetchArticles = async (params = {}) => {
  const query        = new URLSearchParams({ status: "PUBLISHED", ...params }).toString();
  const res          = await publicFetch(`/articles?${query}`);
  const articlesData = extractData(res);
  const pagination   = extractPagination(res) || {
    page: 1, limit: 9, total: articlesData.length, totalPages: 1,
  };
  const articles = Array.isArray(articlesData)
    ? articlesData.map((a) => mapArticle(a))
    : [];
  return { data: articles, pagination };
};

export const fetchArticleBySlug = async (slug) => {
  const res         = await publicFetch(`/articles/slug/${slug}`);
  const articleData = extractItem(res);
  return articleData ? mapArticle(articleData) : null;
};

export const fetchArticleById = async (id) => {
  const res         = await publicFetch(`/articles/${id}`);
  const articleData = extractItem(res);
  return articleData ? mapArticle(articleData) : null;
};

export const fetchTags = async () => {
  const res      = await apiFetch("/tags");
  const tagsData = extractData(res);
  tagsCache = Array.isArray(tagsData) ? tagsData.map(mapTag) : [];
  return tagsCache;
};

export const fetchRelatedArticles = async (articleId, limit = 3) => {
  const res          = await publicFetch(`/articles/${articleId}/related?limit=${limit}`);
  const articlesData = extractData(res);
  const meta         = res.data?.meta || res.meta || { is_fallback: false, total_matches: 0 };
  const articles     = Array.isArray(articlesData)
    ? articlesData.map((a) => ({
        ...mapArticle(a),
        readingTime:     a.reading_time,
        sharedTags:      a.shared_tags       || [],
        sharedTagsCount: a.shared_tags_count || 0,
        relevanceScore:  a.relevance_score   || 0,
      }))
    : [];
  return { data: articles, meta };
};

export const toggleLike = async (articleId) => {
  const token = getToken();
  const res = await publicFetch(`/articles/${articleId}/likes`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return extractItem(res) || res.data;
};

export const toggleSave = async (articleId) => {
  const token = getToken();
  const res = await publicFetch(`/articles/${articleId}/saves`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return extractItem(res) || res.data;
};

// ─── مساعدات للتصدير ──────────────────────────────────────────────────────────

export const getTags = () => tagsCache;

export const getTagName = (tagId) => {
  const tag = tagsCache.find((t) => t.id === tagId);
  return tag?.name || tagId;
};

export const getPublishedArticles = async (params) => {
  const res = await fetchArticles(params);
  return res.data;
};

export const getLikesCount = (articleOrId) => {
  if (typeof articleOrId === "object" && articleOrId !== null) {
    return articleOrId.likesCount ?? 0;
  }
  return 0;
};

export const getRelatedArticles = async (currentArticleId, _currentTags, limit) => {
  const res = await fetchRelatedArticles(currentArticleId, limit);
  return res.data;
};

export const getRecentArticles = async (excludeId, limit = 3) => {
  const res = await fetchArticles({ limit: limit + 1, page: 1 });
  return res.data
    .filter((a) => a.article_id !== excludeId)
    .slice(0, limit)
    .map((a) => ({
      ...a,
      readingTime:     Math.max(1, Math.round(JSON.stringify(a.content || {}).length / 1000)),
      relevanceScore:  0,
      sharedTagsCount: 0,
      sharedTags:      [],
    }));
};

export const isLexicalJson = (content) => {
  if (!content) return false;
  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    return (
      parsed?.root !== undefined &&
      typeof parsed.root === "object" &&
      (Array.isArray(parsed.root.children) || parsed.root.children === undefined)
    );
  } catch {
    return false;
  }
};

// ─── APIs الإدارة (تحتاج توثيق) ──────────────────────────────────────────────

export const fetchAdminArticles = async (status = "ALL") => {
  const res          = await apiFetch(`/admin/articles?status=${encodeURIComponent(status)}`);
  const articlesData = extractData(res);
  const pagination   = extractPagination(res) || {
    page: 1, limit: 9, total: articlesData.length, totalPages: 1,
  };
  const articles = Array.isArray(articlesData)
    ? articlesData.map((a) => mapArticle(a))
    : [];
  return { data: articles, pagination };
};

export const createArticleApi = async (payload) => {
  const res = await apiFetch("/articles", {
    method: "POST",
    body: JSON.stringify({
      title_en:        payload.title_en   || payload.title,
      title_ar:        payload.title_ar   || payload.title,
      excerpt_en:      payload.excerpt_en || payload.excerpt,
      excerpt_ar:      payload.excerpt_ar || payload.excerpt,
      content_en:      payload.content_en || payload.content,
      content_ar:      payload.content_ar || payload.content,
      cover_img:       payload.cover_img,
      status:          payload.status, 
            type:            payload.type,           // ← جديد

      article_type_id: payload.article_type_id || undefined,
      tags:            payload.tags,
    }),
  });
  return extractItem(res) || res.data;
};

export const updateArticleApi = async (id, payload) => {
  const allowedFields = [
    "title_en", "title_ar",
    "excerpt_en", "excerpt_ar",
    "content_en", "content_ar",
    "status", "cover_img",
    "article_type_id", "tags","type",
  ];

  const body = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.includes(key))
  );

  const res = await apiFetch(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return extractItem(res) || res.data;
};

export const deleteArticleApi = async (id) => {
  await apiFetch(`/articles/${id}`, { method: "DELETE" });
};

export const saveDraftApi = async (id, payload) => {
  const res = await apiFetch(`/articles/${id}/draft`, {
    method: "PATCH",
    body: JSON.stringify({
      title_en:   payload.title_en   || payload.title,
      title_ar:   payload.title_ar   || payload.title,
      excerpt_en: payload.excerpt_en || payload.excerpt,
      excerpt_ar: payload.excerpt_ar || payload.excerpt,
      content_en: payload.content_en || payload.content,
      content_ar: payload.content_ar || payload.content,
      cover_img:  payload.cover_img,
      status:     payload.status,
      tags:       payload.tags,
    }),
  });
  return extractItem(res) || res.data;
};

export const uploadCoverApi = async (file) => {
  const formData = new FormData();
  formData.append("cover", file);

  const token   = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res  = await fetch(`${API_BASE}/admin/upload/cover`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
  return extractItem(data) || data.data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const adminLogin = async (credentials) => {
  const url = `${API_BASE}/admin/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Login failed");
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem("token");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:logout"));
  }
};

// ─── إدارة الوسوم ─────────────────────────────────────────────────────────────

export const createTagApi = (name_en, name_ar) =>
  apiFetch("/tags", {
    method: "POST",
    body: JSON.stringify({ name_en, name_ar }),
  });

export const deleteTagApi = async (id) => {
  await apiFetch(`/tags/${id}`, { method: "DELETE" });
};