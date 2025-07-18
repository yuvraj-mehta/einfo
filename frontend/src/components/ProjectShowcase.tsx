import { useState } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
  images: ProjectImage[];
  category: string;
}

interface ProjectShowcaseProps {
  project: PortfolioProject;
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
  onDirectLink?: () => void;
}

export default function ProjectShowcase({
  project,
  isOpen,
  onClose,
  onExpand,
  onDirectLink,
}: ProjectShowcaseProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = project.images[currentImageIndex] || project.images[0];

  const handleMainClick = () => {
    onExpand();
  };

  const handleDirectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDirectLink) {
      onDirectLink();
    } else if (project.href) {
      window.open(project.href, "_blank", "noopener,noreferrer");
    }
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1,
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleVisitProject = () => {
    if (project.href) {
      window.open(project.href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      {/* Compact Link Button */}
      <div className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group shadow-sm overflow-hidden">
        <div className="flex">
          {/* Main clickable area - for expanding */}
          <button
            onClick={handleMainClick}
            className="flex-1 p-4 flex items-center gap-4 text-left"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-200">
              {project.icon || <Eye className="w-4 h-4 text-gray-600" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 font-medium text-sm">
                {project.title}
              </div>
              <div className="text-gray-500 text-xs mt-0.5 truncate">
                {project.description}
              </div>
            </div>
          </button>

          {/* Direct link button */}
          {project.href && (
            <button
              onClick={handleDirectClick}
              className="p-4 border-l border-gray-100 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Gallery Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[600px] opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <div
          className="bg-white rounded-b-xl shadow-sm border-l border-r border-b border-gray-100 p-4 transform transition-transform duration-500 ease-out -mt-1"
          style={{
            transform: isOpen ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {project.title}
              </h3>
              <p className="text-sm text-gray-500">{project.category}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 h-8 w-8 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Image with Navigation */}
          {project.images.length > 0 && (
            <div className="mb-4">
              <div className="relative">
                <img
                  src={currentImage.url}
                  alt={currentImage.title}
                  className="w-full h-64 object-cover rounded-lg bg-gray-100"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.svg";
                  }}
                />

                {/* Navigation arrows */}
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-2 transition-all duration-200"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md rounded-full p-2 transition-all duration-200"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </>
                )}

                {/* Image counter */}
                {project.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {currentImageIndex + 1} / {project.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail navigation */}
              {project.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {project.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => handleThumbnailClick(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? "border-gray-400 opacity-100"
                          : "border-gray-200 opacity-70 hover:opacity-90"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current Image Description */}
          {currentImage && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {currentImage.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {currentImage.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {project.href && (
              <Button
                onClick={handleVisitProject}
                variant="outline"
                className="flex-1 h-10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export types for easy use
export type { PortfolioProject, ProjectImage };
