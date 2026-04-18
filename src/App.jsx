import { Route, Routes } from "react-router-dom";
import Home from "./public/pages/Home.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import Login from "./modules/auth/pages/Login.jsx";
import Register from "./modules/auth/pages/Register.jsx";
import ForgotPassword from "./modules/auth/pages/ForgetPassword.jsx";
import "./App.css";
import Subscription from "./modules/auth/pages/Subscription.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Dashboard from "./modules/admin/pages/Dashboard.jsx";
import Users from "./modules/admin/pages/Users.jsx";
import SubscriptionLayout from "./layouts/SubscriptionLayout.jsx";
import PublicArticles from "./modules/blog/pages/PublicArticles.jsx";
import AdminArticles from "./modules/blog/pages/AdminArticles.jsx";
import ArticleEditor from "./modules/blog/pages/ArticleEditor.jsx";
import ArticleLayout from "./modules/blog/pages/ArticleLayout.jsx";
import ArticleView from "./modules/blog/pages/ArticleView.jsx";
import Tags from "./modules/blog/pages/Tags.jsx";
import Modules from "./modules/admin/pages/Modules.jsx";
import CategoryTree from "./layouts/CategoryTree.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import UserDashboard from "./modules/user/pages/UserDashboard.jsx";
import ProjectOverview from "./modules/user/pages/ProjectOverview.jsx";
import UserProfile from "./modules/user/pages/UserProfile.jsx";
import ProjectExplorerLayout from "./layouts/ProjectExplorerLayout.jsx";
import CategoryDetail from "./modules/user/pages/CategoryDetail.jsx";
import { CONSTRUCTION_TREE, ADMIN_CATEGORY_TREE } from "./shared/lib/constants.js";
import PlanFeatures from "./modules/admin/pages/PlanFeatures.jsx";
import Subscribers from "./modules/admin/pages/Subscribers.jsx";
import ModuleLayout from "./layouts/ModuleLayout.jsx";
import { GuestRoute, ProtectedRoute } from "./shared/components/ui/ProtectedRoutes.jsx";

// ============================================================
// استيراد مكوّنات حماية المسارات
// ============================================================

function App() {
  return (
    <Routes>
      {/* ===================================================
          المسارات العامة — متاحة للجميع
      =================================================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<PublicArticles />} />
        <Route path="/articles/:id" element={<ArticleView />} />
      </Route>

      {/* ===================================================
          GuestRoute — لصفحات المصادقة فقط
          إذا كان المستخدم مسجّلاً → يُحوَّل لـ /dashboard
      =================================================== */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Route>

      {/* اختيار الخطة — متاح بعد التسجيل */}
      <Route path="/choose-plan" element={<Subscription />} />

      {/* ===================================================
          ProtectedRoute — لصفحات المستخدم العادي
          إذا لم يكن مسجّلاً → يُحوَّل لـ /auth/login
      =================================================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/projects/:projectId" element={<ProjectOverview />} />
        </Route>

        <Route
          path="/projects/:projectId/explorer"
          element={<ProjectExplorerLayout treeData={CONSTRUCTION_TREE} />}
        >
          <Route index element={<CategoryDetail />} />
          <Route path=":categoryId" element={<CategoryDetail />} />
        </Route>
      </Route>

      {/* ===================================================
          ProtectedRoute — لصفحات الـ Admin فقط
          roles={["admin"]} يمنع المستخدمين العاديين
      =================================================== */}
      <Route element={<ProtectedRoute roles={["admin"]} redirectTo="/dashboard" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<SubscriptionLayout />}>
            <Route index element={<PlanFeatures />} />
            <Route path="subscribers" element={<Subscribers />} />
          </Route>
          <Route path="articles" element={<ArticleLayout />}>
            <Route index element={<AdminArticles />} />
            <Route path="tags" element={<Tags />} />
            <Route path="new" element={<ArticleEditor />} />
            <Route path=":id/edit" element={<ArticleEditor />} />
          </Route>
          <Route path="modules" element={<CategoryTree tree={ADMIN_CATEGORY_TREE} />}>
            <Route index element={<Modules />} />
            <Route path=":id" element={<Modules />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
