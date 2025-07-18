import { useState, useRef, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  GraduationCap,
  Calendar,
  MapPin,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPicker } from "@/components/ui/icon-picker";
import { getIconFromName, getIconNameFromNode } from "@/lib/iconUtils";
import Education, { EducationData } from "@/components/Education";
import { defaultEducation } from "@/lib/educationData";

interface EditableEducationSectionProps {
  education?: EducationData[];
  onEducationUpdate: (education: EducationData[]) => void;
  className?: string;
}

interface EditableEducationItemProps {
  education: EducationData;
  isEditing: boolean;
  index: number;
  onUpdate: (education: EducationData) => void;
  onDelete: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}

const EditableEducationItem = ({
  education,
  isEditing,
  index,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex,
}: EditableEducationItemProps) => {
  const [editingEducation, setEditingEducation] =
    useState<EducationData>(education);

  const handleFieldChange = (field: keyof EducationData, value: string) => {
    const updated = { ...editingEducation, [field]: value };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleTypeChange = (value: string) => {
    const updated = {
      ...editingEducation,
      type: value as EducationData["type"],
    };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleAchievementChange = (achievementIndex: number, value: string) => {
    const updatedAchievements = [...editingEducation.achievements];
    updatedAchievements[achievementIndex] = value;
    const updated = { ...editingEducation, achievements: updatedAchievements };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleAddAchievement = () => {
    const updated = {
      ...editingEducation,
      achievements: [...editingEducation.achievements, "New achievement..."],
    };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleRemoveAchievement = (achievementIndex: number) => {
    const updatedAchievements = editingEducation.achievements.filter(
      (_, i) => i !== achievementIndex,
    );
    const updated = { ...editingEducation, achievements: updatedAchievements };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleCourseChange = (courseIndex: number, value: string) => {
    const updatedCourses = [...editingEducation.courses];
    updatedCourses[courseIndex] = value;
    const updated = { ...editingEducation, courses: updatedCourses };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleAddCourse = () => {
    const updated = {
      ...editingEducation,
      courses: [...editingEducation.courses, "New course..."],
    };
    setEditingEducation(updated);
    onUpdate(updated);
  };

  const handleRemoveCourse = (courseIndex: number) => {
    const updatedCourses = editingEducation.courses.filter(
      (_, i) => i !== courseIndex,
    );
    const updated = { ...editingEducation, courses: updatedCourses };
    setEditingEducation(updated);
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
                Degree/Certificate
              </label>
              <Input
                value={editingEducation.degree}
                onChange={(e) => handleFieldChange("degree", e.target.value)}
                placeholder="e.g., Bachelor of Science in Computer Science"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Institution
              </label>
              <Input
                value={editingEducation.institution}
                onChange={(e) =>
                  handleFieldChange("institution", e.target.value)
                }
                placeholder="e.g., University of California"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Duration
              </label>
              <Input
                value={editingEducation.duration}
                onChange={(e) => handleFieldChange("duration", e.target.value)}
                placeholder="e.g., 2016 - 2020"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Location
              </label>
              <Input
                value={editingEducation.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="e.g., Berkeley, CA"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Type
              </label>
              <Select
                value={editingEducation.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="text-sm bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="degree">Degree</SelectItem>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                GPA (Optional)
              </label>
              <Input
                value={editingEducation.gpa || ""}
                onChange={(e) => handleFieldChange("gpa", e.target.value)}
                placeholder="e.g., 3.8/4.0"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Website URL (Optional)
              </label>
              <Input
                value={editingEducation.websiteUrl || ""}
                onChange={(e) =>
                  handleFieldChange("websiteUrl", e.target.value)
                }
                placeholder="e.g., https://university.edu"
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
              value={editingEducation.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Brief description of your education and key learnings..."
              className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium min-h-20 resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">
              Image URL (Optional)
            </label>
            <Input
              value={editingEducation.imageUrl || ""}
              onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
              placeholder="https://images.unsplash.com/photo-example.jpg"
              className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Icon</label>
            <IconPicker
              selectedIcon={editingEducation.icon}
              onIconSelect={(icon, iconName) => {
                const updated = { ...editingEducation, icon };
                setEditingEducation(updated);
                onUpdate(updated);
              }}
              placeholder="Choose an icon for this education"
            />
          </div>

          {/* Courses Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Key Courses
              </label>
              <Button
                onClick={handleAddCourse}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 h-7 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Course
              </Button>
            </div>

            <div className="space-y-2">
              {editingEducation.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="flex items-center gap-2">
                  <Input
                    value={course}
                    onChange={(e) =>
                      handleCourseChange(courseIndex, e.target.value)
                    }
                    placeholder="Course name"
                    className="text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 h-8 flex-1"
                  />
                  <Button
                    onClick={() => handleRemoveCourse(courseIndex)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 h-8 w-8 p-1"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
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
              {editingEducation.achievements.map(
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

        {/* View indicator */}
        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </div>
    </button>
  );
};

export default function EditableEducationSection({
  education = defaultEducation,
  onEducationUpdate,
  className = "",
}: EditableEducationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEducation, setEditingEducation] =
    useState<EducationData[]>(education);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedEducation, setExpandedEducation] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const educationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleStartEdit = () => {
    setEditingEducation([...education]);
    setIsEditing(true);
  };

  const handleSave = () => {
    onEducationUpdate(editingEducation);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingEducation([...education]);
    setIsEditing(false);
  };

  const handleEducationUpdate = (
    index: number,
    updatedEducation: EducationData,
  ) => {
    const updated = [...editingEducation];
    updated[index] = updatedEducation;
    setEditingEducation(updated);
  };

  const handleEducationDelete = (index: number) => {
    const updated = editingEducation.filter((_, i) => i !== index);
    setEditingEducation(updated);
  };

  const handleAddEducation = () => {
    const newEducation: EducationData = {
      id: `custom-${Date.now()}`,
      institution: "Institution Name",
      degree: "Degree/Certificate Title",
      duration: "2024 - Present",
      location: "City, State",
      description: "Add your education description here...",
      icon: getIconFromName("GraduationCap"),
      type: "degree",
      achievements: ["New achievement..."],
      courses: ["New course..."],
    };
    setEditingEducation([...editingEducation, newEducation]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null) return;

    if (index !== draggedIndex) {
      setDragOverIndex(index);

      // Reorder the array
      const newEducation = [...editingEducation];
      const draggedItem = newEducation[draggedIndex];
      newEducation.splice(draggedIndex, 1);
      newEducation.splice(index, 0, draggedItem);

      setEditingEducation(newEducation);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleEducationExpand = (educationId: string) => {
    if (expandedEducation === educationId) {
      setExpandedEducation(null);
    } else {
      setExpandedEducation(educationId);
    }
  };

  // Auto-scroll when education expands
  useEffect(() => {
    if (expandedEducation && educationRefs.current[expandedEducation]) {
      const timer = setTimeout(() => {
        const expandedElement = educationRefs.current[expandedEducation];
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
  }, [expandedEducation]);

  // Close expandable education when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

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

  const currentEducation = isEditing ? editingEducation : education;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Education & Certifications
          </h2>
          <p className="text-gray-600 text-sm">
            {isEditing
              ? "Edit your education background and certifications"
              : "My educational journey and professional certifications"}
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

      {/* Education List */}
      <div ref={containerRef} className="space-y-2">
        {isEditing ? (
          <>
            {/* Editing Mode - Show editable items */}
            {currentEducation.map((educationItem, index) => (
              <EditableEducationItem
                key={educationItem.id}
                education={educationItem}
                isEditing={isEditing}
                index={index}
                onUpdate={(updated) => handleEducationUpdate(index, updated)}
                onDelete={() => handleEducationDelete(index)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                dragOverIndex={dragOverIndex}
              />
            ))}

            {/* Add New Education Button */}
            <button
              onClick={handleAddEducation}
              className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-gray-600 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New Education</span>
            </button>
          </>
        ) : (
          <>
            {/* View Mode - Show expandable education like in demo */}
            {currentEducation.map((educationItem) => (
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
          </>
        )}
      </div>
    </div>
  );
}
