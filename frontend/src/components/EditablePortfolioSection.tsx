import { useState, useRef, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Eye,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconPicker } from "@/components/ui/icon-picker";
import { getIconFromName, getIconNameFromNode } from "@/lib/iconUtils";
import ProjectShowcase from "@/components/ProjectShowcase";
import {
  PortfolioProject,
  defaultPortfolioProjects,
} from "@/lib/portfolioData";

interface EditablePortfolioSectionProps {
  projects?: PortfolioProject[];
  onProjectsUpdate: (projects: PortfolioProject[]) => void;
  className?: string;
}

interface EditablePortfolioItemProps {
  project: PortfolioProject;
  isEditing: boolean;
  index: number;
  onUpdate: (project: PortfolioProject) => void;
  onDelete: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dragOverIndex: number | null;
}

const EditablePortfolioItem = ({
  project,
  isEditing,
  index,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex,
}: EditablePortfolioItemProps) => {
  const [editingProject, setEditingProject] =
    useState<PortfolioProject>(project);

  const handleFieldChange = (field: keyof PortfolioProject, value: string) => {
    const updated = { ...editingProject, [field]: value };
    setEditingProject(updated);
    onUpdate(updated);
  };

  const handleImageFieldChange = (
    imageIndex: number,
    field: keyof (typeof project.images)[0],
    value: string,
  ) => {
    const updatedImages = [...editingProject.images];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      [field]: value,
    };
    const updated = { ...editingProject, images: updatedImages };
    setEditingProject(updated);
    onUpdate(updated);
  };

  const handleAddImage = () => {
    const newImage = {
      id: `image-${Date.now()}`,
      url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center",
      title: "New Image",
      description: "Add image description...",
    };
    const updated = {
      ...editingProject,
      images: [...editingProject.images, newImage],
    };
    setEditingProject(updated);
    onUpdate(updated);
  };

  const handleRemoveImage = (imageIndex: number) => {
    const updatedImages = editingProject.images.filter(
      (_, i) => i !== imageIndex,
    );
    const updated = { ...editingProject, images: updatedImages };
    setEditingProject(updated);
    onUpdate(updated);
  };

  const handleClick = () => {
    if (!isEditing && project.href) {
      window.open(project.href, "_blank", "noopener,noreferrer");
    }
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
                Project Title
              </label>
              <Input
                value={editingProject.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g., Mobile App Design"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Category
              </label>
              <Input
                value={editingProject.category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                placeholder="e.g., UI/UX Design"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">
              Description
            </label>
            <Input
              value={editingProject.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Brief project description"
              className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
            />
          </div>

          {/* Project URL */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">
              Project URL (Optional)
            </label>
            <Input
              value={editingProject.href || ""}
              onChange={(e) => handleFieldChange("href", e.target.value)}
              placeholder="https://github.com/username/project"
              className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
            />
          </div>

          {/* Icon Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Icon</label>
            <IconPicker
              selectedIcon={editingProject.icon}
              onIconSelect={(icon, iconName) => {
                const updated = { ...editingProject, icon };
                setEditingProject(updated);
                onUpdate(updated);
              }}
              placeholder="Choose an icon for this project"
            />
          </div>

          {/* Images Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Project Images
              </label>
              <Button
                onClick={handleAddImage}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 h-7 px-2 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Image
              </Button>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto">
              {editingProject.images.map((image, imageIndex) => (
                <div
                  key={image.id}
                  className="bg-gray-50 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      Image {imageIndex + 1}
                    </span>
                    <Button
                      onClick={() => handleRemoveImage(imageIndex)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-1"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-600">Image URL</label>
                      <Input
                        value={image.url}
                        onChange={(e) =>
                          handleImageFieldChange(
                            imageIndex,
                            "url",
                            e.target.value,
                          )
                        }
                        placeholder="Image URL"
                        className="text-xs bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-7"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-600">Title</label>
                      <Input
                        value={image.title}
                        onChange={(e) =>
                          handleImageFieldChange(
                            imageIndex,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Image title"
                        className="text-xs bg-white border-gray-300 text-gray-900 placeholder-gray-400 h-7"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-600">Description</label>
                    <Textarea
                      value={image.description}
                      onChange={(e) =>
                        handleImageFieldChange(
                          imageIndex,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Image description"
                      className="text-xs bg-white border-gray-300 text-gray-900 placeholder-gray-400 min-h-16 resize-none"
                    />
                  </div>
                </div>
              ))}
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
    <button
      onClick={handleClick}
      className="w-full bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all duration-200 group shadow-sm overflow-hidden"
    >
      <div className="p-4 flex items-center gap-4 text-left">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors duration-200">
          {project.icon || <Folder className="w-4 h-4 text-gray-600" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium text-sm">
            {project.title}
          </div>
          <div className="text-gray-500 text-xs mt-0.5 truncate">
            {project.description}
          </div>
          {project.category && (
            <div className="text-gray-400 text-xs mt-0.5">
              {project.category}
            </div>
          )}
        </div>

        {/* Arrow indicator or preview icon */}
        {project.href ? (
          <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
        ) : (
          <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
        )}
      </div>
    </button>
  );
};

export default function EditablePortfolioSection({
  projects = defaultPortfolioProjects,
  onProjectsUpdate,
  className = "",
}: EditablePortfolioSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjects, setEditingProjects] =
    useState<PortfolioProject[]>(projects);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleStartEdit = () => {
    setEditingProjects([...projects]);
    setIsEditing(true);
  };

  const handleSave = () => {
    onProjectsUpdate(editingProjects);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingProjects([...projects]);
    setIsEditing(false);
  };

  const handleProjectUpdate = (
    index: number,
    updatedProject: PortfolioProject,
  ) => {
    const updated = [...editingProjects];
    updated[index] = updatedProject;
    setEditingProjects(updated);
  };

  const handleProjectDelete = (index: number) => {
    const updated = editingProjects.filter((_, i) => i !== index);
    setEditingProjects(updated);
  };

  const handleAddProject = () => {
    const newProject: PortfolioProject = {
      id: `custom-${Date.now()}`,
      title: "New Project",
      description: "Brief project description",
      category: "Design",
      href: "",
      icon: getIconFromName("Folder"),
      images: [
        {
          id: `image-${Date.now()}`,
          url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center",
          title: "Project Preview",
          description: "Add your project description here...",
        },
      ],
    };
    setEditingProjects([...editingProjects, newProject]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null) return;

    if (index !== draggedIndex) {
      setDragOverIndex(index);

      // Reorder the array
      const newProjects = [...editingProjects];
      const draggedItem = newProjects[draggedIndex];
      newProjects.splice(draggedIndex, 1);
      newProjects.splice(index, 0, draggedItem);

      setEditingProjects(newProjects);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleProjectExpand = (projectId: string, href?: string) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  const handleDirectLink = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  // Auto-scroll when project expands
  useEffect(() => {
    if (expandedProject && projectRefs.current[expandedProject]) {
      const timer = setTimeout(() => {
        const expandedElement = projectRefs.current[expandedProject];
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
  }, [expandedProject]);

  // Close expandable projects when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

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

  const currentProjects = isEditing ? editingProjects : projects;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Portfolio
          </h2>
          <p className="text-gray-600 text-sm">
            {isEditing
              ? "Edit your portfolio projects and showcases"
              : "Explore my latest projects and creative work"}
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

      {/* Portfolio List */}
      <div ref={containerRef} className="space-y-2">
        {isEditing ? (
          <>
            {/* Editing Mode - Show editable items */}
            {currentProjects.map((project, index) => (
              <EditablePortfolioItem
                key={project.id}
                project={project}
                isEditing={isEditing}
                index={index}
                onUpdate={(updated) => handleProjectUpdate(index, updated)}
                onDelete={() => handleProjectDelete(index)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                dragOverIndex={dragOverIndex}
              />
            ))}

            {/* Add New Project Button */}
            <button
              onClick={handleAddProject}
              className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:text-gray-600 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add New Project</span>
            </button>
          </>
        ) : (
          <>
            {/* View Mode - Show expandable showcases like in demo */}
            {currentProjects.map((project) => (
              <div
                key={project.id}
                ref={(el) => (projectRefs.current[project.id] = el)}
              >
                <ProjectShowcase
                  project={project}
                  isOpen={expandedProject === project.id}
                  onClose={() => setExpandedProject(null)}
                  onExpand={() => handleProjectExpand(project.id, project.href)}
                  onDirectLink={() =>
                    project.href && handleDirectLink(project.href)
                  }
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
