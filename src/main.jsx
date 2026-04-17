import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./modules/auth/context/auth.context";

// ============================================================
// main.jsx — نقطة الدخول للتطبيق
// ============================================================
// الترتيب مهم جداً:
//   BrowserRouter  → يوفر نظام التوجيه (Routing)
//     AuthProvider → يوفر بيانات المصادقة لكل التطبيق
//       App        → مسارات التطبيق
// ============================================================

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider يُغلّف App بالكامل حتى يصل useAuth() لكل مكوّن */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);