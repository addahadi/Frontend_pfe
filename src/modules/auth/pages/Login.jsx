import { useState } from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../schemas/auth.schema";
import {useAuth} from "../hooks/useAuth.js"
import { validateRequest } from "../../../utils/ValidateResponce";
import { useErrors } from "../../../shared/hooks/useErrors";
 
// ============================================================
// Login.jsx — صفحة تسجيل الدخول (مع Validation + Context)
// ============================================================
 
const Login = () => {
  // ----------------------------------------------------------
  // Hooks
  // ----------------------------------------------------------
  const navigate = useNavigate();         // للتنقل بعد تسجيل الدخول
  const { login } = useAuth();            // دالة login من الـ Context
 
  // useErrors: hook جاهز لإدارة أخطاء الـ validation
  const { errors, setValidationErrors, clearFieldError } = useErrors();
 
  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة تحميل الزر
  const [serverError, setServerError] = useState("");      // أخطاء الـ API
 
  // ----------------------------------------------------------
  // handleSubmit — إرسال النموذج
  // ----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // مسح الخطأ القديم
 
    // الخطوة 1: التحقق من البيانات بـ Zod
    const { validData, validationErrors } = validateRequest(
      { email, password },
      loginSchema
    );
 
    // إذا كانت هناك أخطاء → اعرضها وأوقف الإرسال
    if (validationErrors) {
      setValidationErrors(validationErrors);
      return;
    }
 
    // الخطوة 2: إرسال البيانات للـ API
    setIsSubmitting(true);
    try {
      await login(validData);
      // نجح تسجيل الدخول → انتقل للـ dashboard
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // خطأ من الـ server (بيانات غلط، مشكلة شبكة...)
      const message =
        err?.response?.data?.message || "فشل تسجيل الدخول، حاول مجدداً";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };
 
  // ----------------------------------------------------------
  // مساعد: مسح خطأ الحقل عند الكتابة فيه
  // ----------------------------------------------------------
  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
    clearFieldError(field); // مسح الخطأ فور بدء الكتابة
  };
 
  // ----------------------------------------------------------
  // JSX
  // ----------------------------------------------------------
  return (
    <div className="w-full max-w-sm">
 
      {/* شعار الموبايل */}
      <div className="mb-10 flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <span className="text-sm font-bold text-white">B</span>
        </div>
        <span className="text-lg font-bold text-slate-900">BuildEst</span>
      </div>
 
      {/* العنوان */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500">
          Log in to manage your construction estimates and projects efficiently.
        </p>
      </div>
 
      {/* خطأ الـ Server العام */}
      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}
 
      {/* النموذج */}
      <form onSubmit={handleSubmit} className="space-y-5">
 
        {/* حقل البريد */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleChange("email", setEmail)}
              placeholder="engineer@example.com"
              // نضيف border أحمر عند وجود خطأ
              className={`w-full rounded-lg border bg-slate-50 py-3 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
            />
            <Mail className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {/* رسالة الخطأ - تظهر فقط إذا كان errors.email موجوداً */}
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>
 
        {/* حقل كلمة المرور */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <Link to="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange("password", setPassword)}
              placeholder="••••••••"
              className={`w-full rounded-lg border bg-slate-50 py-3 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password}</p>
          )}
        </div>
 
        {/* تذكرني */}
        <div className="flex items-center gap-2.5">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-primary"
          />
          <label htmlFor="remember" className="text-sm text-slate-600">
            Remember for 30 days
          </label>
        </div>
 
        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* نبدّل النص لـ Loading أثناء الإرسال */}
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Logging in...
            </>
          ) : (
            <>Log In <span>→</span></>
          )}
        </button>
 
        {/* فاصل */}
        <div className="relative flex items-center py-1">
          <div className="flex-1 border-t border-slate-200" />
          <span className="mx-4 text-xs text-slate-400">or</span>
          <div className="flex-1 border-t border-slate-200" />
        </div>
 
        {/* رابط إنشاء حساب */}
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/auth/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
 
      {/* روابط السياسة */}
      <div className="mt-10 flex items-center justify-center gap-4">
        <Link to="#" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</Link>
        <span className="text-slate-300">•</span>
        <Link to="#" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</Link>
      </div>
    </div>
  );
};
 
export default Login;
 