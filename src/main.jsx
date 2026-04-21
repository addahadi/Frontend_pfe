import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./modules/auth/context/auth.context";

// ============================================================
// main.jsx — نقطة الدخول للتطبيق (تم الدمج بنجاح)
// ============================================================

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* AuthProvider ضروري باش يخدم الـ Login في قاع التطبيق */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);