import { useState, useRef, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  Briefcase,
  Calendar,
  MapPin,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconPicker } from "@/components/ui/icon-picker";
import { getIconFromName, getIconNameFromNode } from "@/lib/iconUtils";
import WorkExperience, {
  WorkExperienceData,
  WorkProject,
} from "@/components/WorkExperience";
import { defaultWorkExperiences } from "@/lib/workExperienceData";

interface EditableExperienceSectionProps {
  experiences?: WorkExperienceData[];
  onExperiencesUpdate: (experiences: WorkExperienceData[]) => void;
  className?: string;
}

interface EditableExperienceItemProps {
  experience: WorkExperienceData;
  isEditing: boolean;
  index: number;
  onUpdate: (experience: WorkExperienceData) => void;
  onDelete: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}

const EditableExperienceItem = ({
  experience,
  isEditing,
  index,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex,
}: EditableExperienceItemProps) => {
  const [editingExperience, setEditingExperience] =
    useState<WorkExperienceData>(experience);

  const handleFieldChange = (
    field: keyof WorkExperienceData,
    value: string,
  ) => {
    const updated = { ...editingExperience, [field]: value };
    setEditingExperience(updated);
    onUpdate(updated);
  };

  const handleAchievementChange = (achievementIndex: number, value: string) => {
    const updatedAchievements = [...editingExperience.achievements];
    updatedAchievements[achievementIndex] = value;
    const updated = { ...editingExperience, achievements: updatedAchievements };
    setEditingExperience(updated);
    onUpdate(updated);
  };

  const handleAddAchievement = () => {
    const updated = {
      ...editingExperience,
      achievements: [...editingExperience.achievements, "New achievement..."],
    };
    setEditingExperience(updated);
    onUpdate(updated);
  };

  const handleRemoveAchievement = (achievementIndex: number) => {
    const updatedAchievements = editingExperience.achievements.filter(
      (_, i) => i !== achievementIndex,
    );
    const updated = { ...editingExperience, achievements: updatedAchievements };
    setEditingExperience(updated);
    onUpdate(updated);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver(index);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  const isDraggedOver = dragOverIndex === index;
  const isBeingDragged = isDragging;

  if (isEditing) {
    return (
      <div
        className={`bg-white border border-gray-100 rounded-xl transition-all duration-200 overflow-hidden shadow-sm ${
          isBeingDragged ? "opacity-50 scale-95" : ""
        } ${isDraggedOver ? "border-gray-300 shadow-lg" : ""}`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="p-4 space-y-4">
          {/* Drag Handle */}
          <div className="flex items-center gap-2 text-gray-500 -mt-1 mb-2">
            <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" />
            <span className="text-xs font-medium">Drag to reorder</span>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Position
              </label>
              <Input
                value={editingExperience.position}
                onChange={(e) => handleFieldChange("position", e.target.value)}
                placeholder="e.g., Senior UI/UX Designer"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Company
              </label>
              <Input
                value={editingExperience.company}
                onChange={(e) => handleFieldChange("company", e.target.value)}
                placeholder="e.g., TechCorp Inc."
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Duration
              </label>
              <Input
                value={editingExperience.duration}
                onChange={(e) => handleFieldChange("duration", e.target.value)}
                placeholder="e.g., 2022 - Present"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Location
              </label>
              <Input
                value={editingExperience.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">
              Description
            </label>
            <Textarea
              value={editingExperience.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Brief description of your role and responsibilities..."
              className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium min-h-20 resize-none"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Icon</label>
            <IconPicker
              selectedIcon={editingExperience.icon}
              onIconSelect={(icon, iconName) => {
                const updated = { ...editingExperience, icon };
                setEditingExperience(updated);
                onUpdate(updated);
              }}
              placeholder="Choose an icon for this experience"
            />
          </div>

          {/* Achievements Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Key Achievements
              </label>
              <Button
                onClick={handleAddAchievement}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 h-7 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Achievement
              </Button>
            </div>

            <div className="space-y-2">
              {editingExperience.achievements.map(
                (achievement, achievementIndex) => (
                  <div
                    key={achievementIndex}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={achievement}
                      onChange={(e) =>
                        handleAchievementChange(
                          achievementIndex,
                          e.target.value,
                        )
                      }
                      placeholder="Achievement description"
                      className="text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 h-8 flex-1"
                    />
                    <Button
                      onClick={() => handleRemoveAchievement(achievementIndex)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center pt-2 border-t border-gray-100">
            <Button
              onClick={onDelete}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-white hover:bg-red-600 h-8 px-3 font-medium border border-red-200 hover:border-red-600 transition-all"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button className="w-full bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group shadow-sm overflow-hidden">
      <div className="p-4 flex items-center gap-4 text-left">
        {/* Icon */}
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

        {/* View indicator */}
        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </div>
    </button>
  );
};

export default function EditableExperienceSection({
  experiences = defaultWorkExperiences,
  onExperiencesUpdate,
  className = "",
}: EditableExperienceSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExperiences, setEditingExperiences] =
    useState<WorkExperienceData[]>(experiences);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedExperience, setExpandedExperience] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const experienceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleStartEdit = () => {
    setEditingExperiences([...experiences]);
    setIsEditing(true);
  };

  const handleSave = () => {
    onExperiencesUpdate(editingExperiences);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingExperiences([...experiences]);
    setIsEditing(false);
  };

  const handleExperienceUpdate = (
    index: number,
    updatedExperience: WorkExperienceData,
  ) => {
    const updated = [...editingExperiences];
    updated[index] = updatedExperience;
    setEditingExperiences(updated);
  };

  const handleExperienceDelete = (index: number) => {
    const updated = editingExperiences.filter((_, i) => i !== index);
    setEditingExperiences(updated);
  };

  const handleAddExperience = () => {
    const newExperience: WorkExperienceData = {
      id: `custom-${Date.now()}`,
      company: "Company Name",
      position: "Job Title",
      duration: "2024 - Present",
      location: "City, State",
      description: "Add your role description here...",
      projects: [],
      achievements: ["New achievement..."],
      icon: getIconFromName("Briefcase"),
    };
    setEditingExperiences([...editingExperiences, newExperience]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null) return;

    if (index !== draggedIndex) {
      setDragOverIndex(index);

      // Reorder the array
      const newExperiences = [...editingExperiences];
      const draggedItem = newExperiences[draggedIndex];
      newExperiences.splice(draggedIndex, 1);
      newExperiences.splice(index, 0, draggedItem);

      setEditingExperiences(newExperiences);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleExperienceExpand = (experienceId: string) => {
    if (expandedExperience === experienceId) {
      setExpandedExperience(null);
    } else {
      setExpandedExperience(experienceId);
    }
  };

  // Auto-scroll when experience expands
  useEffect(() => {
    if (expandedExperience && experienceRefs.current[expandedExperience]) {
      const timer = setTimeout(() => {
        const expandedElement = experienceRefs.current[expandedExperience];
        if (expandedElement) {
          expandedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [expandedExperience]);

  // Close expandable experiences when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setExpandedExperience(null);
        return;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const currentExperiences = isEditing ? editingExperiences : experiences;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Experience
          </h2>
          <p className="text-gray-600 text-sm">
            {isEditing
              ? "Edit your professional experience and achievements"
              : "My professional journey and key achievements"}
          </p>
        </div>

        <div className="ml-4">
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
              >
                <X className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                onClick={handleSave}
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleStartEdit}
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
            >
              <Edit3 className="w-4 h-4 text-gray-600" />
            </Button>
          )}
        </div>
      </div>

      {/* Experience List */}
      <div ref={containerRef} className="space-y-2">
        {isEditing ? (
          <>
            {/* Editing Mode - Show editable items */}
            {currentExperiences.map((experience, index) => (
              <EditableExperienceItem
                key={experience.id}
                experience={experience}
                isEditing={isEditing}
                index={index}
                onUpdate={(updated) => handleExperienceUpdate(index, updated)}
                onDelete={() => handleExperienceDelete(index)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                dragOverIndex={dragOverIndex}
              />
            ))}

            {/* Add New Experience Button */}
            <button
              onClick={handleAddExperience}
              className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-gray-600 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New Experience</span>
            </button>
          </>
        ) : (
          <>
            {/* View Mode - Show expandable experiences like in demo */}
            {currentExperiences.map((experience) => (
              <div
                key={experience.id}
                ref={(el) => (experienceRefs.current[experience.id] = el)}
              >
                <WorkExperience
                  experience={experience}
                  isOpen={expandedExperience === experience.id}
                  onClose={() => setExpandedExperience(null)}
                  onExpand={() => handleExperienceExpand(experience.id)}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
