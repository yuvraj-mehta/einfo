import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "./LoadingSpinner";
import type { WithClassName } from "@/types";

interface ActionButtonProps extends WithClassName {
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void | Promise<void>;
  /**
   * Button variant
   */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /**
   * Button size
   */
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Icon to display before text
   */
  icon?: React.ReactNode;
  /**
   * Icon to display after text
   */
  iconRight?: React.ReactNode;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Button type for forms
   */
  type?: "button" | "submit" | "reset";
  /**
   * Accessibility label
   */
  "aria-label"?: string;
  /**
   * Accessibility description
   */
  "aria-describedby"?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  type = "button",
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}) => {
  const handleClick = async () => {
    if (loading || disabled || !onClick) return;

    try {
      await onClick();
    } catch (error) {
      console.error("ActionButton error:", error);
    }
  };

  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        fullWidth && "w-full",
        "inline-flex items-center gap-2",
        className,
      )}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
    >
      {loading ? <LoadingSpinner size="sm" variant="white" /> : icon}
      {children}
      {!loading && iconRight}
    </Button>
  );
};

export default ActionButton;
