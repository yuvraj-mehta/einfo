import Extracurricular from "@/components/Extracurricular";
import { useEffect, useRef, useState } from "react";
import { defaultExtracurriculars } from "@/lib/extracurricularsData";
import type { ExtracurricularData } from "@/types/newSections";

interface ExtracurricularSectionProps {
  extracurriculars?: ExtracurricularData[];
  className?: string;
  onExtracurricularClick?: (extracurricularId: string) => void;
}

export default function ExtracurricularSection({
  extracurriculars = defaultExtracurriculars,
  className = "",
  onExtracurricularClick,
}: ExtracurricularSectionProps) {
  const [expandedExtracurricular, setExpandedExtracurricular] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const extracurricularRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleExtracurricularExpand = (extracurricularId: string) => {
    if (onExtracurricularClick) {
      onExtracurricularClick(extracurricularId);
    } else {
      // Default behavior
      if (expandedExtracurricular === extracurricularId) {
        setExpandedExtracurricular(null);
      } else {
        setExpandedExtracurricular(extracurricularId);
      }
    }
  };

  // Auto-scroll when extracurricular expands
  useEffect(() => {
    if (expandedExtracurricular && extracurricularRefs.current[expandedExtracurricular]) {
      // Wait for the expansion animation to complete
      const timer = setTimeout(() => {
        const expandedElement = extracurricularRefs.current[expandedExtracurricular];
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
  }, [expandedExtracurricular]);

  // Close expandable extracurricular when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Always close expandable extracurricular when clicking outside the main container
      if (containerRef.current && !containerRef.current.contains(target)) {
        setExpandedExtracurricular(null);
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
      {extracurriculars.map((extracurricular) => (
        <div
          key={extracurricular.id}
          ref={(el) => (extracurricularRefs.current[extracurricular.id] = el)}
        >
          <Extracurricular
            extracurricular={extracurricular}
            isOpen={expandedExtracurricular === extracurricular.id}
            onClose={() => setExpandedExtracurricular(null)}
            onExpand={() => handleExtracurricularExpand(extracurricular.id)}
          />
        </div>
      ))}
    </div>
  );
}

// Export types for easy use
export type { ExtracurricularData };
