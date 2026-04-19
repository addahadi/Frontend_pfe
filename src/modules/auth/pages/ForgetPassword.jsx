import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPasswordSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { validateRequest } from "../../../utils/ValidateResponce";
import { useErrors } from "../../../shared/hooks/useErrors";

const ForgetPassword = () => {
  const { errors, setValidationErrors, clearFieldError } = useErrors();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerMessage("");

    const { validData, validationErrors } = validateRequest({ email }, forgotPasswordSchema);

    if (validationErrors) {
      setValidationErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(validData);
      setServerMessage(
        "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. تحقق من صندوق الوارد أو البريد العشوائي.",
      );
    } catch (err) {
      const message = err?.response?.data?.message || "فشل إرسال الرابط، حاول مرة أخرى لاحقاً.";
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, setter) => (e) => {
    setter(e.target.value);
    clearFieldError(field);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 flex items-center gap-3 text-slate-600">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900">Forgot Password?</h1>
        <p className="max-w-md text-sm leading-6 text-slate-500">
          Don&apos;t worry, it happens. Enter the email address associated with your account and
          we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {serverMessage && (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {serverMessage}
        </div>
      )}

      {serverError && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleChange("email", setEmail)}
              placeholder="name@company.com"
              className={`w-full rounded-2xl border bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                  : "border-slate-200 focus:border-primary focus:ring-primary/20"
              }`}
            />
            <Mail className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Sending...
            </>
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link to="/auth/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default ForgetPassword;
