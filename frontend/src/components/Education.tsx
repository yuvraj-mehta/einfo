import { X, GraduationCap, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EducationData {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  location: string;
  description: string;
  icon?: React.ReactNode;
  type: "degree" | "certification" | "certificate" | "course";
  gpa?: string;
  achievements: string[];
  courses: string[];
  imageUrl?: string;
  websiteUrl?: string;
}

interface EducationProps {
  education: EducationData;
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export default function Education({
  education,
  isOpen,
  onClose,
  onExpand,
}: EducationProps) {
  const handleMainClick = () => {
    onExpand();
  };

  const handleVisitWebsite = () => {
    if (education.websiteUrl) {
      window.open(education.websiteUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      {/* Compact Education Button */}
      <div className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group shadow-sm overflow-hidden">
        <button
          onClick={handleMainClick}
          className="w-full p-4 flex items-center gap-4 text-left"
        >
          {/* Institution Icon */}
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-200">
            {education.icon || (
              <GraduationCap className="w-4 h-4 text-gray-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 font-medium text-sm">
              {education.degree}
            </div>
            <div className="text-gray-500 text-xs mt-0.5 truncate">
              {education.institution} • {education.duration}
            </div>
          </div>
        </button>
      </div>

      {/* Expandable Education Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[800px] opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
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
                {education.degree}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm font-medium text-gray-700">
                  {education.institution}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {education.duration}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {education.location}
                </div>
              </div>
              {education.gpa && (
                <div className="text-xs text-gray-600 mt-1">
                  GPA: {education.gpa}
                </div>
              )}
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

          {/* Education Image */}
          {education.imageUrl && (
            <div className="mb-4">
              <img
                src={education.imageUrl}
                alt={education.institution}
                className="w-full h-48 object-cover rounded-lg bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
          )}

          {/* Education Description */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {education.description}
            </p>
          </div>

          {/* Key Courses */}
          {education.courses.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Key Courses
              </h4>
              <div className="flex flex-wrap gap-2">
                {education.courses.map((course, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Achievements */}
          {education.achievements.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Key Achievements
              </h4>
              <ul className="space-y-1">
                {education.achievements.map((achievement, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-start gap-2"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Visit Website Button */}
          {education.websiteUrl && (
            <div className="flex">
              <Button
                onClick={handleVisitWebsite}
                variant="outline"
                className="flex-1 h-10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Institution
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Export types for easy use
export type { EducationData };
