import React from "react";
import { cn } from "@/lib/utils";
import type { WithChildren, WithClassName } from "@/types";

interface CardProps extends WithChildren, WithClassName {
  /**
   * Card padding variant
   */
  padding?: "none" | "sm" | "md" | "lg";
  /**
   * Card shadow variant
   */
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  /**
   * Border variant
   */
  border?: boolean;
  /**
   * Hover effects
   */
  hover?: boolean;
  /**
   * Clickable card
   */
  clickable?: boolean;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Background variant
   */
  background?: "white" | "gray" | "gradient";
  /**
   * Border radius variant
   */
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

const shadowClasses = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
};

const backgroundClasses = {
  white: "bg-white",
  gray: "bg-gray-50",
  gradient: "bg-gradient-to-br from-white to-gray-50",
};

const roundedClasses = {
  none: "",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const Card: React.FC<CardProps> = ({
  children,
  padding = "md",
  shadow = "sm",
  border = true,
  hover = false,
  clickable = false,
  onClick,
  background = "white",
  rounded = "lg",
  className,
}) => {
  const Component = clickable || onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={cn(
        backgroundClasses[background],
        paddingClasses[padding],
        shadowClasses[shadow],
        roundedClasses[rounded],
        border && "border border-gray-200",
        hover &&
          "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        clickable &&
          "cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20",
        onClick && "cursor-pointer",
        "relative overflow-hidden",
        className,
      )}
      {...(clickable && {
        role: "button",
        tabIndex: 0,
        onKeyDown: (e) => {
          if ((e.key === "Enter" || e.key === " ") && onClick) {
            e.preventDefault();
            onClick();
          }
        },
      })}
    >
      {children}
    </Component>
  );
};

interface CardHeaderProps extends WithChildren, WithClassName {
  /**
   * Header padding
   */
  padding?: "none" | "sm" | "md" | "lg";
  /**
   * Whether to show border at bottom
   */
  bordered?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  padding = "md",
  bordered = false,
  className,
}) => {
  return (
    <div
      className={cn(
        paddingClasses[padding],
        bordered && "border-b border-gray-200",
        className,
      )}
    >
      {children}
    </div>
  );
};

interface CardContentProps extends WithChildren, WithClassName {
  /**
   * Content padding
   */
  padding?: "none" | "sm" | "md" | "lg";
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  padding = "md",
  className,
}) => {
  return (
    <div className={cn(paddingClasses[padding], className)}>{children}</div>
  );
};

interface CardFooterProps extends WithChildren, WithClassName {
  /**
   * Footer padding
   */
  padding?: "none" | "sm" | "md" | "lg";
  /**
   * Whether to show border at top
   */
  bordered?: boolean;
  /**
   * Background variant
   */
  background?: "transparent" | "gray";
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  padding = "md",
  bordered = false,
  background = "transparent",
  className,
}) => {
  return (
    <div
      className={cn(
        paddingClasses[padding],
        bordered && "border-t border-gray-200",
        background === "gray" && "bg-gray-50",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Card;
