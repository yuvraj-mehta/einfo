import { useState, useCallback } from "react";

type ValidationRule = (value: any) => string | null;

interface ValidationRules {
  [field: string]: ValidationRule[];
}

interface ValidationErrors {
  [field: string]: string;
}

interface UseFormValidationReturn {
  errors: ValidationErrors;
  validate: (field?: string) => boolean;
  validateField: (field: string, value: any) => string | null;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
  isValid: boolean;
}

/**
 * Hook for form validation with field-level and form-level validation
 */
export function useFormValidation(
  data: Record<string, any>,
  rules: ValidationRules,
): UseFormValidationReturn {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback(
    (field: string, value: any): string | null => {
      const fieldRules = rules[field];
      if (!fieldRules) return null;

      for (const rule of fieldRules) {
        const error = rule(value);
        if (error) return error;
      }

      return null;
    },
    [rules],
  );

  const validate = useCallback(
    (field?: string): boolean => {
      if (field) {
        // Validate single field
        const error = validateField(field, data[field]);
        setErrors((prev) => ({
          ...prev,
          [field]: error || undefined,
        }));
        return !error;
      }

      // Validate all fields
      const newErrors: ValidationErrors = {};
      let isValid = true;

      for (const key in data) {
        const error = validateField(key, data[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }

      setErrors(newErrors);
      return isValid;
    },
    [data, validateField],
  );

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const isValid = !hasErrors;

  return {
    errors,
    validate,
    validateField,
    clearError,
    clearAllErrors,
    hasErrors,
    isValid,
  };
}

// Common validation rules
export const validationRules = {
  required: (value: any): string | null => {
    if (value === null || value === undefined || value === "") {
      return "This field is required";
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : "Please enter a valid email address";
  },

  minLength:
    (min: number) =>
    (value: string): string | null => {
      if (!value) return null;
      return value.length >= min ? null : `Must be at least ${min} characters`;
    },

  maxLength:
    (max: number) =>
    (value: string): string | null => {
      if (!value) return null;
      return value.length <= max
        ? null
        : `Must be no more than ${max} characters`;
    },

  url: (value: string): string | null => {
    if (!value) return null;
    try {
      new URL(value.startsWith("http") ? value : `https://${value}`);
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  },
};

export default useFormValidation;
