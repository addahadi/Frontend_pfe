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
import PlanFeatures from "./modules/admin/pages/PlanFeatures.jsx";
import Subscribers from "./modules/admin/pages/Subscribers.jsx";
import PublicArticles from "./modules/blog/pages/PublicArticles.jsx";
import AdminArticles from "./modules/blog/pages/AdminArticles.jsx";
import ArticleEditor from "./modules/blog/pages/ArticleEditor.jsx";
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

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<PublicArticles />} />
        <Route path="/articles/:id" element={<ArticleView />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="/choose-plan" element={<Subscription />} />

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        
        <Route path="/projects/:projectId" element={<ProjectOverview />} />
        
      </Route>

      <Route path="/projects/:projectId/explorer" element={<ProjectExplorerLayout treeData={CONSTRUCTION_TREE} />}>
        <Route index element={<CategoryDetail />} />
        <Route path=":categoryId" element={<CategoryDetail />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="subscriptions" element={<SubscriptionLayout />}>
          <Route index element={<PlanFeatures />} />
          <Route path="subscribers" element={<Subscribers />} />
        </Route>
        <Route path="articles" element={<AdminArticles />} />
        <Route path="articles/new" element={<ArticleEditor />} />
        <Route path="articles/:id/edit" element={<ArticleEditor />} />
        <Route path="articles/tags" element={<Tags />} />
        
        <Route path="modules" element={<CategoryTree tree={ADMIN_CATEGORY_TREE} />}>
          <Route index element={<Modules />} />
          <Route path=":id" element={<Modules />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;