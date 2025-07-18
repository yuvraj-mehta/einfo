import { X, Briefcase, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkProject {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
}

interface WorkExperienceData {
  id: string;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  icon?: React.ReactNode;
  projects: WorkProject[];
  achievements: string[];
}

interface WorkExperienceProps {
  experience: WorkExperienceData;
  isOpen: boolean;
  onClose: () => void;
  onExpand: () => void;
}

export default function WorkExperience({
  experience,
  isOpen,
  onClose,
  onExpand,
}: WorkExperienceProps) {
  const handleMainClick = () => {
    onExpand();
  };

  return (
    <div>
      {/* Compact Experience Button */}
      <div className="bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group shadow-sm overflow-hidden">
        <button
          onClick={handleMainClick}
          className="w-full p-4 flex items-center gap-4 text-left"
        >
          {/* Company Icon */}
          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-200">
            {experience.icon || <Briefcase className="w-4 h-4 text-gray-600" />}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 font-medium text-sm">
              {experience.position}
            </div>
            <div className="text-gray-500 text-xs mt-0.5 truncate">
              {experience.company} • {experience.duration}
            </div>
          </div>
        </button>
      </div>

      {/* Expandable Experience Section */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[700px] opacity-100 mb-2" : "max-h-0 opacity-0 mb-0"
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
                {experience.position}
              </h3>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-sm font-medium text-gray-700">
                  {experience.company}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {experience.duration}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {experience.location}
                </div>
              </div>
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

          {/* Experience Description */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              {experience.description}
            </p>
          </div>

          {/* Key Achievements */}
          {experience.achievements.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Key Achievements
              </h4>
              <ul className="space-y-1">
                {experience.achievements.map((achievement, index) => (
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
        </div>
      </div>
    </div>
  );
}

// Export types for easy use
export type { WorkExperienceData, WorkProject };
