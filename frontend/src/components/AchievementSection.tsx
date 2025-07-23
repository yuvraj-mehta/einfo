import Achievement from "@/components/Achievement";
import { useEffect, useRef, useState } from "react";
import { defaultAchievements } from "@/lib/achievementsData";
import type { AchievementData } from "@/types/newSections";

interface AchievementSectionProps {
  achievements?: AchievementData[];
  className?: string;
  onAchievementClick?: (achievementId: string) => void;
}

export default function AchievementSection({
  achievements = defaultAchievements,
  className = "",
  onAchievementClick,
}: AchievementSectionProps) {
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const achievementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleAchievementExpand = (achievementId: string) => {
    if (onAchievementClick) {
      onAchievementClick(achievementId);
    } else {
      // Default behavior
      if (expandedAchievement === achievementId) {
        setExpandedAchievement(null);
      } else {
        setExpandedAchievement(achievementId);
      }
    }
  };

  // Auto-scroll when achievement expands
  useEffect(() => {
    if (expandedAchievement && achievementRefs.current[expandedAchievement]) {
      // Wait for the expansion animation to complete
      const timer = setTimeout(() => {
        const expandedElement = achievementRefs.current[expandedAchievement];
        if (expandedElement) {
          expandedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 300); // Wait 300ms for the expansion animation

      return () => clearTimeout(timer);
    }
  }, [expandedAchievement]);

  // Close expandable achievement when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Always close expandable achievement when clicking outside the main container
      if (containerRef.current && !containerRef.current.contains(target)) {
        setExpandedAchievement(null);
        return;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-lg mx-auto space-y-2 ${className}`}
    >
      {achievements.map((achievement) => (
        <div
          key={achievement.id}
          ref={(el) => (achievementRefs.current[achievement.id] = el)}
        >
          <Achievement
            achievement={achievement}
            isOpen={expandedAchievement === achievement.id}
            onClose={() => setExpandedAchievement(null)}
            onExpand={() => handleAchievementExpand(achievement.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Export types for easy use
export type { AchievementData };
