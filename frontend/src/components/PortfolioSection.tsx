import { useState, useEffect, useRef } from "react";
import ProjectShowcase, {
  PortfolioProject,
} from "@/components/ProjectShowcase";
import { defaultPortfolioProjects } from "@/lib/portfolioData";

interface PortfolioSectionProps {
  projects?: PortfolioProject[];
  className?: string;
  onProjectClick?: (projectId: string, href?: string) => void;
  onDirectLink?: (href: string) => void;
}

export default function PortfolioSection({
  projects = defaultPortfolioProjects,
  className = "",
  onProjectClick,
  onDirectLink,
}: PortfolioSectionProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleProjectExpand = (projectId: string, href?: string) => {
    if (onProjectClick) {
      onProjectClick(projectId, href);
    } else {
      // Default behavior
      if (expandedProject === projectId) {
        setExpandedProject(null);
      } else {
        setExpandedProject(projectId);
      }
    }
  };

  // Auto-scroll when project expands
  useEffect(() => {
    if (expandedProject && projectRefs.current[expandedProject]) {
      // Wait for the expansion animation to complete
      const timer = setTimeout(() => {
        const expandedElement = projectRefs.current[expandedProject];
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
  }, [expandedProject]);

  const handleDirectLink = (href: string) => {
    if (onDirectLink) {
      onDirectLink(href);
    } else {
      // Default behavior
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  // Close expandable projects when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Always close expandable projects when clicking outside the main container
      if (containerRef.current && !containerRef.current.contains(target)) {
        setExpandedProject(null);
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
      {projects.map((project) => (
        <div
          key={project.id}
          ref={(el) => (projectRefs.current[project.id] = el)}
        >
          <ProjectShowcase
            project={project}
            isOpen={expandedProject === project.id}
            onClose={() => setExpandedProject(null)}
            onExpand={() => handleProjectExpand(project.id, project.href)}
            onDirectLink={() => project.href && handleDirectLink(project.href)}
          />
        </div>
      ))}
    </div>
  );
}

// Export types for easy use
export type { PortfolioProject };
