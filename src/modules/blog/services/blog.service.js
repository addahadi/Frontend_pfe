// src/services/blog.service.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
};

// ── Custom API Error ──────────────────────────────────────────────────────────
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/**
 * publicFetch — no auth, used for public article reads
 */
const publicFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const headers = { "Content-Type": "application/json", ...options.headers };

  const res = await fetch(url, { ...options, headers });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }

  if (!res.ok) {
    throw new ApiError(data?.error?.message || `Request failed: ${res.status}`, res.status);
  }
  return data;
};

/**
 * apiFetch — with Bearer token, used for admin endpoints
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-JSON */
  }

  if (!res.ok) {
    if (res.status === 401) {
      try {
        localStorage.removeItem("token");
      } catch {}
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("auth:unauthorized", {
            detail: { message: data?.error?.message || "Unauthorized" },
          }),
        );
      }
      throw new ApiError(data?.error?.message || "Unauthorized - Please login again", 401);
    }
    throw new ApiError(data?.error?.message || `Request failed: ${res.status}`, res.status);
  }
  return data;
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const extractData = (res) => res.data?.data || res.data || [];
const extractPagination = (res) => res.data?.pagination || res.pagination || null;
const extractItem = (res) => res.data?.data || res.data || null;

// ── Tags cache ────────────────────────────────────────────────────────────────
let tagsCache = [];

const mapTag = (t) => ({
  id: t.tag_id || t.id,
  name: t.name_en || t.name,
  name_en: t.name_en,
  name_ar: t.name_ar,
  count: Number(t.count) || 0,
});

/**
 * mapArticle — normalises a raw article from the API.
 *
 * type / type_name_en always comes from the DB JOIN (name_en column from article_types).
 * Never hardcodes UUIDs or fake type IDs.
 */
const mapArticle = (article, lang = "en") => {
  if (!article) return null;
  const isAr = lang === "ar";

  // type_name_en comes from the server's LEFT JOIN on article_types.
  // The field may be called type_name_en (list) or type (single fetch).
  const typeName =
    article.type_name_en ||
    (typeof article.type === "string" && !/^[0-9a-f-]{36}$/i.test(article.type)
      ? article.type
      : null) ||
    null;

  return {
    ...article,
    article_id: article.article_id || article.id,

    title: isAr
      ? article.title_ar || article.title_en || article.title
      : article.title_en || article.title,
    title_en: article.title_en || article.title || "",
    title_ar: article.title_ar || "",

    excerpt: isAr
      ? article.excerpt_ar || article.excerpt_en || article.excerpt
      : article.excerpt_en || article.excerpt || "",
    excerpt_en: article.excerpt_en || article.excerpt || "",
    excerpt_ar: article.excerpt_ar || "",

    content: isAr
      ? article.content_ar || article.content_en || article.content
      : article.content_en || article.content,
    content_en: article.content_en || article.content || null,
    content_ar: article.content_ar || null,

    // Type: always the human-readable name from DB (e.g. "BLOG", "ACTUALITE")
    type: typeName,
    type_name_en: typeName,
    type_name_ar: article.type_name_ar || null,

    // article_type_id: the real UUID from DB
    article_type_id: article.article_type_id || null,

    // Tags
    tags: Array.isArray(article.tags)
      ? article.tags.map((t) => (typeof t === "object" ? t.tag_id || t.id || t : t))
      : [],
    tagObjects: Array.isArray(article.tags)
      ? article.tags.filter((t) => typeof t === "object")
      : [],

    // Counts
    likesCount: Number(article.likesCount ?? article.likes_count ?? 0),
    savesCount: Number(article.savesCount ?? article.saves_count ?? 0),

    // Dates
    created_at: article.created_at,
    updated_at: article.updated_at,
    published_at: article.published_at,
    cover_img: article.cover_img,
    slug: article.slug,
    status: article.status,
  };
};

// ─── Public APIs (no auth) ────────────────────────────────────────────────────

export const fetchArticles = async (params = {}) => {
  // Always request server-side pagination — never fetch 999 at once
  const { limit = 9, page = 1, ...rest } = params;
  const query = new URLSearchParams({
    status: "PUBLISHED",
    limit: String(limit),
    page: String(page),
    ...rest,
  }).toString();
  const res = await publicFetch(`/articles?${query}`);
  const articlesData = extractData(res);
  const pagination = extractPagination(res) || {
    page: Number(page),
    limit: Number(limit),
    total: articlesData.length,
    totalPages: 1,
  };
  const articles = Array.isArray(articlesData) ? articlesData.map((a) => mapArticle(a)) : [];
  return { data: articles, pagination };
};

export const fetchArticleBySlug = async (slug) => {
  // Basic slug validation to prevent path traversal
  if (!/^[a-z0-9-]+$/.test(slug)) throw new ApiError("Invalid article slug", 400);
  const res = await publicFetch(`/articles/slug/${slug}`);
  const articleData = extractItem(res);
  return articleData ? mapArticle(articleData) : null;
};

export const fetchArticleById = async (id) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("Invalid article ID", 400);
  const res = await publicFetch(`/articles/${id}`);
  const articleData = extractItem(res);
  return articleData ? mapArticle(articleData) : null;
};

export const fetchTags = async () => {
  const res = await publicFetch("/tags");
  const tagsData = extractData(res);
  tagsCache = Array.isArray(tagsData) ? tagsData.map(mapTag) : [];
  return tagsCache;
};

export const fetchRelatedArticles = async (articleId, limit = 3) => {
  if (!/^[0-9a-f-]{36}$/i.test(articleId))
    return { data: [], meta: { is_fallback: true, total_matches: 0 } };
  const res = await publicFetch(`/articles/${articleId}/related?limit=${limit}`);
  const articlesData = extractData(res);
  const meta = res.data?.meta || res.meta || { is_fallback: false, total_matches: 0 };
  const articles = Array.isArray(articlesData)
    ? articlesData.map((a) => ({
        ...mapArticle(a),
        readingTime: a.reading_time,
        sharedTags: a.shared_tags || [],
        sharedTagsCount: a.shared_tags_count || 0,
        relevanceScore: a.relevance_score || 0,
      }))
    : [];
  return { data: articles, meta };
};

export const toggleLike = async (articleId) => {
  if (!/^[0-9a-f-]{36}$/i.test(articleId)) throw new ApiError("Invalid article ID", 400);
  const res = await apiFetch(`/articles/${articleId}/likes`, { method: "POST" });
  return extractItem(res) || res.data;
};

export const toggleSave = async (articleId) => {
  if (!/^[0-9a-f-]{36}$/i.test(articleId)) throw new ApiError("Invalid article ID", 400);
  const res = await apiFetch(`/articles/${articleId}/saves`, { method: "POST" });
  return extractItem(res) || res.data;
};

// ─── Tag helpers ──────────────────────────────────────────────────────────────

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
      readingTime: Math.max(1, Math.round(JSON.stringify(a.content || {}).length / 1000)),
      relevanceScore: 0,
      sharedTagsCount: 0,
      sharedTags: [],
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

// ─── Admin APIs (require auth) ────────────────────────────────────────────────

export const fetchAdminArticles = async (status = "ALL", params = {}) => {
  const query = new URLSearchParams({
    status: encodeURIComponent(status),
    limit: "20",
    ...params,
  }).toString();
  const res = await apiFetch(`/admin/articles?${query}`);
  const articlesData = extractData(res);
  const pagination = extractPagination(res) || {
    page: 1,
    limit: 100,
    total: articlesData.length,
    totalPages: 1,
  };
  const articles = Array.isArray(articlesData) ? articlesData.map((a) => mapArticle(a)) : [];
  return { data: articles, pagination };
};

export const createArticleApi = async (payload) => {
  // Ensure article_type_id is included and is a valid UUID
  const body = {
    title_en: payload.title_en || payload.title,
    title_ar: payload.title_ar || payload.title,
    excerpt_en: payload.excerpt_en || payload.excerpt,
    excerpt_ar: payload.excerpt_ar || payload.excerpt,
    content_en: payload.content_en || payload.content,
    content_ar: payload.content_ar || payload.content,
    cover_img: payload.cover_img,
    status: payload.status,
    tags: payload.tags,
  };

  body.article_type_id = payload.article_type_id;

  const res = await apiFetch("/articles", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return extractItem(res) || res.data;
};

export const updateArticleApi = async (id, payload) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("Invalid article ID", 400);

  const allowedFields = [
    "title_en",
    "title_ar",
    "excerpt_en",
    "excerpt_ar",
    "content_en",
    "content_ar",
    "status",
    "cover_img",
    "article_type_id",
    "tags",
  ];

  const body = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.includes(key)),
  );

  // Only send article_type_id if it's a valid UUID
  if (body.article_type_id && !/^[0-9a-f-]{36}$/i.test(body.article_type_id)) {
    delete body.article_type_id;
  }

  const res = await apiFetch(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return extractItem(res) || res.data;
};

export const deleteArticleApi = async (id) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("Invalid article ID", 400);
  await apiFetch(`/articles/${id}`, { method: "DELETE" });
};

export const saveDraftApi = async (id, payload) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("Invalid article ID", 400);
  const res = await apiFetch(`/articles/${id}/draft`, {
    method: "PATCH",
    body: JSON.stringify({
      title_en: payload.title_en || payload.title,
      title_ar: payload.title_ar || payload.title,
      excerpt_en: payload.excerpt_en || payload.excerpt,
      excerpt_ar: payload.excerpt_ar || payload.excerpt,
      content_en: payload.content_en || payload.content,
      content_ar: payload.content_ar || payload.content,
      cover_img: payload.cover_img,
      status: payload.status,
      tags: payload.tags,
    }),
  });
  return extractItem(res) || res.data;
};

export const uploadCoverApi = async (file) => {
  const formData = new FormData();
  formData.append("cover", file);

  const token = getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/admin/upload/cover`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(data?.error?.message || "Upload failed", res.status);
  return extractItem(data) || data.data;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const adminLogin = async (credentials) => {
  // Sanitize inputs before sending
  const safeCredentials = {
    email: String(credentials.email || "")
      .trim()
      .toLowerCase(),
    password: String(credentials.password || ""),
  };

  const url = `${API_BASE}/admin/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(safeCredentials),
  });
  const data = await res.json();
  if (!res.ok) throw new ApiError(data?.error?.message || "Login failed", res.status);
  return data;
};

export const adminLogout = () => {
  try {
    localStorage.removeItem("token");
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:logout"));
  }
};

// ─── Tag management ───────────────────────────────────────────────────────────

export const createTagApi = (name_en, name_ar) =>
  apiFetch("/tags", {
    method: "POST",
    body: JSON.stringify({ name_en: String(name_en).trim(), name_ar: String(name_ar).trim() }),
  });

export const deleteTagApi = async (id) => {
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("Invalid tag ID", 400);
  await apiFetch(`/tags/${id}`, { method: "DELETE" });
};

export const fetchArticleTypes = async () => {
  const res = await publicFetch("/article-types");
  const data = extractData(res);
  // Normalize: ensure both id and article_type_id fields exist
  return Array.isArray(data)
    ? data.map((t) => ({
        ...t,
        id: t.article_type_id || t.id,
        article_type_id: t.article_type_id || t.id,
        name_en: t.name_en || "",
        name_ar: t.name_ar || "",
      }))
    : [];
};
