// hooks/useErrors.js
import { useState, useCallback } from "react";

export function useErrors() {
  const [errors, setErrors] = useState({});

  const setValidationErrors = useCallback((errorMap) => {
    setErrors(errorMap ?? {});
  }, []);


  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => setErrors({}), []);

  const getFieldError = useCallback((field) => errors[field], [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    hasErrors,
    setValidationErrors,
    clearFieldError,
    clearErrors,
    getFieldError,
  };
}
