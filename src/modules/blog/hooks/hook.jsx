import { useState } from "react";
import {
  getArticlesWithDetails,
  deleteArticle,
  updateArticle
} from "../services/blog.service"; 

export const useAdminArticles = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [articles, setArticles] = useState(getArticlesWithDetails());
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);

  const filtered = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || a.type === typeFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleDeleteConfirmed = () => {
    deleteArticle(confirmTarget.article_id);
    setArticles(getArticlesWithDetails());
    setConfirmTarget(null);
  };

  const handleToggleStatus = (article) => {
    const newStatus =
      article.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    updateArticle(article.article_id, { status: newStatus });
    setArticles(getArticlesWithDetails());
  };

  const handleEditorClose = () => {
    setEditingArticle(null);
    setArticles(getArticlesWithDetails());
  };

  return {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    filtered,
    confirmTarget,
    setConfirmTarget,
    editingArticle,
    setEditingArticle,
    handleDeleteConfirmed,
    handleToggleStatus,
    handleEditorClose,
  };
};