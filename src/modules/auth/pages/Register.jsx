import { useState } from "react";
import { Eye, EyeOff, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/useAuth";
import { validateRequest } from "../../../utils/ValidateResponce";
import { useErrors } from "../../../shared/hooks/useErrors";

// ============================================================
// Register.jsx — صفحة إنشاء الحساب (مع Validation + Context)
// ============================================================

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { errors, setValidationErrors, clearFieldError } = useErrors();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // ----------------------------------------------------------
  // handleSubmit
  // ----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // الخطوة 1: Zod Validation
    const { validData, validationErrors } = validateRequest(
      { fullName, email, password, confirmPassword },
      registerSchema
    );

    if (validationErrors) {
      setValidationErrors(validationErrors);
      return;
    }

    // الخطوة 2: إرسال للـ API
    setIsSubmitting(true);
    try {
      await register(validData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "فشل إنشاء الحساب، حاول مجدداً";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
    clearFieldError(field);
  };

  // كلاس الـ input المشترك - يتغير لون الـ border حسب وجود خطأ
  const inputClass = (field) =>
    `w-full rounded-lg border bg-slate-50 py-3 pl-4 pr-11 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:border-red-400 focus:ring-red-200"
        : "border-slate-200 focus:border-primary focus:ring-primary/20"
    }`;

  return (
    <div className="w-full max-w-md">

      {/* العنوان */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="text-sm text-slate-500">
          Start managing your construction projects today.
        </p>
      </div>

      {/* خطأ الـ Server */}
      {serverError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* الاسم الكامل */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={handleChange("fullName", setFullName)}
              placeholder="John Doe"
              className={inputClass("fullName")}
            />
            <User className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
        </div>

        {/* البريد الإلكتروني */}
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
              placeholder="john@example.com"
              className={inputClass("email")}
            />
            <Mail className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* كلمتا المرور - جنباً إلى جنب */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* كلمة المرور */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleChange("password", setPassword)}
                placeholder="••••••••"
                className={inputClass("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleChange("confirmPassword", setConfirmPassword)}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-slate-50 py-3 pl-4 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                    : "border-slate-200 focus:border-primary focus:ring-primary/20"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* الموافقة على الشروط */}
        <div className="flex items-start gap-2.5">
          <input
            id="terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            required
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary"
          />
          <label htmlFor="terms" className="text-sm leading-relaxed text-slate-600">
            I agree to the{" "}
            <Link to="#" className="font-medium text-primary hover:underline">Terms and Conditions</Link>
            {" "}and{" "}
            <Link to="#" className="font-medium text-primary hover:underline">Privacy Policy</Link>.
          </label>
        </div>

        {/* زر إنشاء الحساب */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </>
          ) : (
            <>Create Account <span>→</span></>
          )}
        </button>

        {/* رابط تسجيل الدخول */}
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;