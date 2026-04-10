// src/modules/user/services/user.service.js
import {
  MOCK_PROJECTS,
  MOCK_CATEGORIES,
  MOCK_RECENT_CALCS,
  MOCK_ARTICLES,
  MOCK_USER,
} from "../mocks/user.mock";

export const userService = {
  getProjects: () => {
    return Promise.resolve(MOCK_PROJECTS);
  },
  getProjectById: (id) => {
    const project = MOCK_PROJECTS.find(p => p.id === id);
    return Promise.resolve(project);
  },
  getCategoriesByProject: (projectId) => {
    return Promise.resolve(MOCK_CATEGORIES[projectId] || []);
  },
  getRecentCalculations: (projectId) => {
    return Promise.resolve(MOCK_RECENT_CALCS[projectId] || []);
  },
  getSavedArticles: () => {
    return Promise.resolve(MOCK_ARTICLES.saved);
  },
  getLikedArticles: () => {
    return Promise.resolve(MOCK_ARTICLES.liked);
  },
  getUserProfile: () => {
    return Promise.resolve({ ...MOCK_USER });
  },
  updateUserProfile: (data) => {
    // محاكاة التحديث
    const updated = { ...MOCK_USER, ...data };
    // في الواقع، قد نريد تحديث الـ mock، لكن للأغراض الحالية نرجع البيانات المحدثة
    return Promise.resolve(updated);
  },
};