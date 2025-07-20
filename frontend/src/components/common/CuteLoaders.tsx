import React from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "scale-75",
  md: "scale-100", 
  lg: "scale-125",
};

// Main Unified Cute Loader - Floating Hearts with Gentle Bounce
export const UnifiedCuteLoader: React.FC<LoaderProps> = ({ 
  className, 
  message = "Loading...", 
  size = "md" 
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        {/* Main container with gentle breathing animation */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 animate-spin-slow opacity-30"></div>
          
          {/* Inner pulsing circle */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 animate-pulse-gentle"></div>
          
          {/* Central heart */}
          <div className="relative z-10 animate-bounce-gentle">
            <svg
              className="w-8 h-8 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-pink-300 rounded-full animate-float-sparkle opacity-60"
              style={{
                left: `${20 + Math.cos((i * Math.PI) / 3) * 35}px`,
                top: `${20 + Math.sin((i * Math.PI) / 3) * 35}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {message && (
        <div className="text-center space-y-1">
          <p className="text-gray-700 font-medium text-sm animate-fade-in">
            {message}
          </p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1.4s",
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Inline version for smaller spaces
export const InlineCuteLoader: React.FC<LoaderProps> = ({ 
  className, 
  size = "sm" 
}) => {
  return (
    <div className={cn("inline-flex items-center justify-center", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className="relative w-6 h-6 flex items-center justify-center">
          {/* Simplified version for inline use */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 animate-spin-slow opacity-40"></div>
          <svg
            className="w-3 h-3 text-pink-500 animate-bounce-gentle relative z-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Legacy exports for backward compatibility (now all use the unified loader)
export const BouncingDotsLoader = UnifiedCuteLoader;
export const HeartLoader = UnifiedCuteLoader;
export const CatLoader = UnifiedCuteLoader;
export const TypewriterLoader = UnifiedCuteLoader;
export const DancingSquaresLoader = UnifiedCuteLoader;
export const BubblesLoader = UnifiedCuteLoader;
export const RainbowWaveLoader = UnifiedCuteLoader;
export const RobotLoader = UnifiedCuteLoader;
