import { useState, useEffect, useRef } from "react";
import Education, { EducationData } from "@/components/Education";
import { defaultEducation } from "@/lib/educationData";

interface EducationSectionProps {
  education?: EducationData[];
  className?: string;
  onEducationClick?: (educationId: string) => void;
}

export default function EducationSection({
  education = defaultEducation,
  className = "",
  onEducationClick,
}: EducationSectionProps) {
  const [expandedEducation, setExpandedEducation] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const educationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleEducationExpand = (educationId: string) => {
    if (onEducationClick) {
      onEducationClick(educationId);
    } else {
      // Default behavior
      if (expandedEducation === educationId) {
        setExpandedEducation(null);
      } else {
        setExpandedEducation(educationId);
      }
    }
  };

  // Auto-scroll when education expands
  useEffect(() => {
    if (expandedEducation && educationRefs.current[expandedEducation]) {
      // Wait for the expansion animation to complete
      const timer = setTimeout(() => {
        const expandedElement = educationRefs.current[expandedEducation];
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
  }, [expandedEducation]);

  // Close expandable education when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Always close expandable education when clicking outside the main container
      if (containerRef.current && !containerRef.current.contains(target)) {
        setExpandedEducation(null);
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
      {education.map((educationItem) => (
        <div
          key={educationItem.id}
          ref={(el) => (educationRefs.current[educationItem.id] = el)}
        >
          <Education
            education={educationItem}
            isOpen={expandedEducation === educationItem.id}
            onClose={() => setExpandedEducation(null)}
            onExpand={() => handleEducationExpand(educationItem.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Export types for easy use
export type { EducationData };
