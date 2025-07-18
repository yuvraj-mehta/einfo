import React from "react";
import { cn } from "@/lib/utils";
import type { WithClassName } from "@/types";

interface LoadingSpinnerProps extends WithClassName {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "white";
  label?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const variantClasses = {
  primary: "text-blue-600",
  secondary: "text-gray-600",
  white: "text-white",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "primary",
  label = "Loading...",
  className,
}) => {
  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      role="status"
      aria-label={label}
    >
      <svg
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant],
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
};

interface LoadingOverlayProps extends WithClassName {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  loadingText = "Loading...",
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-inherit">
          <div className="text-center space-y-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-600 font-medium">{loadingText}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
