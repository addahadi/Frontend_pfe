import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

// ============================================================
// ProtectedRoute.jsx — مكوّنات حماية المسارات
// ============================================================
// لدينا نوعان:
//
//  1. ProtectedRoute: يحمي صفحات تحتاج تسجيل دخول
//     مثال: /dashboard, /profile, /projects
//     → إذا لم يكن مسجّلاً: يُحوّله لـ /auth/login
//
//  2. GuestRoute: يحمي صفحات المصادقة (login/register)
//     مثال: /auth/login, /auth/register
//     → إذا كان مسجّلاً بالفعل: يُحوّله لـ /dashboard
// ============================================================

// ------------------------------------------------------------
// ProtectedRoute — للصفحات التي تحتاج مستخدم مسجّل
// ------------------------------------------------------------
export const ProtectedRoute = ({ redirectTo = "/auth/login", roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // أثناء التحقق من الجلسة عند تحميل التطبيق → لا نعيد توجيه بعد
  // نعرض شاشة تحميل بسيطة
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // غير مسجّل → أعد التوجيه لصفحة تسجيل الدخول
  if (!isAuthenticated) {
    // replace=true تمنع الرجوع بزر Back للصفحة المحمية
    return <Navigate to={redirectTo} replace />;
  }

  // إذا حُدِّدت أدوار مسموح بها وليس دور المستخدم فيها
  // مثال: <ProtectedRoute roles={["admin"]} />
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // كل شيء تمام → اعرض الصفحة المطلوبة
  // Outlet هو المكان الذي ترسم فيه React الصفحة الفرعية
  return <Outlet />;
};

// ------------------------------------------------------------
// GuestRoute — لصفحات المصادقة فقط (login/register)
// ------------------------------------------------------------
export const GuestRoute = ({ redirectTo = "/dashboard" }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // مسجّل بالفعل → لا حاجة لصفحة login → حوّله للـ dashboard
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
