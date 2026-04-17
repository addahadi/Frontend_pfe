import api from "../../../api/api";

// ============================================================
// auth.service.js — دوال الاتصال بالـ API
// ============================================================
// كل دالة هنا تتواصل مع endpoint محدد في الـ backend.
// نستخدم api (axios instance) الذي عنده interceptors
// تضيف الـ token تلقائياً لكل طلب.
// ============================================================

export const authService = {
  // ----------------------------------------------------------
  // تسجيل الدخول — POST /auth/login
  // ----------------------------------------------------------
  // ترجع: { accessToken, refreshToken, user }
  login: async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // ----------------------------------------------------------
  // استعادة كلمة المرور — POST /auth/forgot-password
  // ----------------------------------------------------------
  forgotPassword: async ({ email }) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // ----------------------------------------------------------
  // إنشاء حساب جديد — POST /auth/register
  // ----------------------------------------------------------
  // ترجع: { accessToken, refreshToken, user }
  register: async ({ fullName, email, password }) => {
    const response = await api.post("/auth/register", {
      fullName,
      email,
      password,
    });
    return response.data;
  },

  // ----------------------------------------------------------
  // تسجيل الخروج — POST /auth/logout
  // ----------------------------------------------------------
  logout: async () => {
    await api.post("/auth/logout");
  },

  // ----------------------------------------------------------
  // جلب بيانات المستخدم الحالي — GET /auth/me
  // ----------------------------------------------------------
  // يُستخدم عند تحميل التطبيق للتحقق إن كان المستخدم لا يزال مسجلاً
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
