import Achievement from "@/components/Achievement";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PROFILE_LIMITS, getLimit, hasReachedLimit } from "@/constants/profileLimits";
import { defaultAchievements } from "@/lib/achievementsData";
import { getIconFromName, getIconNameFromNode } from "@/lib/iconUtils";
import type { AchievementData } from "@/types/newSections";

import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  GripVertical,
  Trophy,
  Calendar,
  MapPin,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableAchievementSectionProps {
  achievements?: AchievementData[];
  onAchievementsUpdate: (achievements: AchievementData[]) => void;
  className?: string;
}

interface EditableAchievementItemProps {
  achievement: AchievementData;
  isEditing: boolean;
  index: number;
  onUpdate: (achievement: AchievementData) => void;
  onDelete: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  dragOverIndex: number | null;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const EditableAchievementItem = ({
  achievement,
  isEditing,
  index,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  dragOverIndex,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: EditableAchievementItemProps) => {
  const [editingAchievement, setEditingAchievement] =
    useState<AchievementData>(achievement);

  const handleFieldChange = (field: keyof AchievementData, value: string) => {
    // Apply character limits
    if (field === "title" && value.length > 120) {
      return; // Don't allow input beyond 120 characters
    }
    if (field === "organization" && value.length > 80) {
      return; // Don't allow input beyond 80 characters
    }
    if (field === "duration" && value.length > 25) {
      return; // Don't allow input beyond 25 characters
    }
    if (field === "location" && value.length > 40) {
      return; // Don't allow input beyond 40 characters
    }
    if (field === "description" && value.length > 300) {
      return; // Don't allow input beyond 300 characters
    }
    if (field === "websiteUrl" && value.length > 200) {
      return; // Don't allow input beyond 200 characters
    }

    const updated = { ...editingAchievement, [field]: value };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleTypeChange = (value: string) => {
    const updated = { ...editingAchievement, type: value as AchievementData["type"] };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleSkillChange = (skillIndex: number, value: string) => {
    // Apply character limit for skills
    if (value.length > 40) {
      return; // Don't allow input beyond 40 characters
    }
    
    const updatedSkills = [...editingAchievement.skillsInvolved];
    updatedSkills[skillIndex] = value;
    const updated = { ...editingAchievement, skillsInvolved: updatedSkills };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleAddSkill = () => {
    // Limit to maximum 15 skills
    if (editingAchievement.skillsInvolved.length >= 15) {
      return; // Don't allow more than 15 skills
    }
    
    const updated = {
      ...editingAchievement,
      skillsInvolved: [...editingAchievement.skillsInvolved, ""],
    };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleRemoveSkill = (skillIndex: number) => {
    const updatedSkills = editingAchievement.skillsInvolved.filter(
      (_, i) => i !== skillIndex,
    );
    const updated = { ...editingAchievement, skillsInvolved: updatedSkills };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleMoveSkillUp = (skillIndex: number) => {
    if (skillIndex > 0) {
      const updatedSkills = [...editingAchievement.skillsInvolved];
      const item = updatedSkills[skillIndex];
      updatedSkills[skillIndex] = updatedSkills[skillIndex - 1];
      updatedSkills[skillIndex - 1] = item;
      const updated = { ...editingAchievement, skillsInvolved: updatedSkills };
      setEditingAchievement(updated);
      onUpdate(updated);
    }
  };

  const handleMoveSkillDown = (skillIndex: number) => {
    if (skillIndex < editingAchievement.skillsInvolved.length - 1) {
      const updatedSkills = [...editingAchievement.skillsInvolved];
      const item = updatedSkills[skillIndex];
      updatedSkills[skillIndex] = updatedSkills[skillIndex + 1];
      updatedSkills[skillIndex + 1] = item;
      const updated = { ...editingAchievement, skillsInvolved: updatedSkills };
      setEditingAchievement(updated);
      onUpdate(updated);
    }
  };

  const handleKeyPointChange = (pointIndex: number, value: string) => {
    // Apply character limit for key points
    if (value.length > 200) {
      return; // Don't allow input beyond 200 characters
    }
    
    const updatedPoints = [...editingAchievement.keyPoints];
    updatedPoints[pointIndex] = value;
    const updated = { ...editingAchievement, keyPoints: updatedPoints };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleAddKeyPoint = () => {
    // Limit to maximum 10 key points
    if (editingAchievement.keyPoints.length >= 10) {
      return; // Don't allow more than 10 key points
    }
    
    const updated = {
      ...editingAchievement,
      keyPoints: [...editingAchievement.keyPoints, ""],
    };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleRemoveKeyPoint = (pointIndex: number) => {
    const updatedPoints = editingAchievement.keyPoints.filter(
      (_, i) => i !== pointIndex,
    );
    const updated = { ...editingAchievement, keyPoints: updatedPoints };
    setEditingAchievement(updated);
    onUpdate(updated);
  };

  const handleMoveKeyPointUp = (pointIndex: number) => {
    if (pointIndex > 0) {
      const updatedPoints = [...editingAchievement.keyPoints];
      const item = updatedPoints[pointIndex];
      updatedPoints[pointIndex] = updatedPoints[pointIndex - 1];
      updatedPoints[pointIndex - 1] = item;
      const updated = { ...editingAchievement, keyPoints: updatedPoints };
      setEditingAchievement(updated);
      onUpdate(updated);
    }
  };

  const handleMoveKeyPointDown = (pointIndex: number) => {
    if (pointIndex < editingAchievement.keyPoints.length - 1) {
      const updatedPoints = [...editingAchievement.keyPoints];
      const item = updatedPoints[pointIndex];
      updatedPoints[pointIndex] = updatedPoints[pointIndex + 1];
      updatedPoints[pointIndex + 1] = item;
      const updated = { ...editingAchievement, keyPoints: updatedPoints };
      setEditingAchievement(updated);
      onUpdate(updated);
    }
  };

  const handleDragStart = () => {
    onDragStart(index);
  };

  const handleDragOver = () => {
    onDragOver(index);
  };

  if (isEditing) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-xl p-4 space-y-4 transition-all duration-200 ${
          isDragging ? "opacity-50" : ""
        } ${dragOverIndex === index ? "border-blue-300 bg-blue-50" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          handleDragOver();
        }}
        onDrop={(e) => {
          e.preventDefault();
          onDragEnd();
        }}
      >
        <div className="space-y-4">
          {/* Drag Handle and Move Buttons */}
          <div className="flex items-center justify-between -mt-1 mb-2">
            <div 
              className="flex items-center gap-2 text-gray-500 cursor-grab active:cursor-grabbing select-none"
              draggable
              onDragStart={handleDragStart}
            >
              <GripVertical className="w-4 h-4" />
              <span className="text-xs font-medium">Drag to reorder</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  canMoveUp 
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Move up"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                  canMoveDown 
                    ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
                title="Move down"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Achievement Title
              </label>
              <Input
                value={editingAchievement.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="e.g., 1st Place - Tech Innovation Hackathon"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
                maxLength={120}
              />
              <div className="text-right">
                <p className={`text-xs ${
                  editingAchievement.title.length > 108 
                    ? editingAchievement.title.length >= 120 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                    : 'text-gray-500'
                }`}>
                  {editingAchievement.title.length}/120 characters
                </p>
                {editingAchievement.title.length >= 120 && (
                  <p className="text-xs text-red-500 mt-1">
                    Character limit reached
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Organization
              </label>
              <Input
                value={editingAchievement.organization}
                onChange={(e) =>
                  handleFieldChange("organization", e.target.value)
                }
                placeholder="e.g., Silicon Valley Tech Hub"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
                maxLength={80}
              />
              <div className="text-right">
                <p className={`text-xs ${
                  editingAchievement.organization.length > 72 
                    ? editingAchievement.organization.length >= 80 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                    : 'text-gray-500'
                }`}>
                  {editingAchievement.organization.length}/80 characters
                </p>
                {editingAchievement.organization.length >= 80 && (
                  <p className="text-xs text-red-500 mt-1">
                    Character limit reached
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Duration
              </label>
              <Input
                value={editingAchievement.duration}
                onChange={(e) => handleFieldChange("duration", e.target.value)}
                placeholder="e.g., March 2023"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
                maxLength={25}
              />
              <div className="text-right">
                <p className={`text-xs ${
                  editingAchievement.duration.length > 22 
                    ? editingAchievement.duration.length >= 25 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                    : 'text-gray-500'
                }`}>
                  {editingAchievement.duration.length}/25 characters
                </p>
                {editingAchievement.duration.length >= 25 && (
                  <p className="text-xs text-red-500 mt-1">
                    Character limit reached
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Location
              </label>
              <Input
                value={editingAchievement.location}
                onChange={(e) => handleFieldChange("location", e.target.value)}
                placeholder="e.g., San Jose, CA"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
                maxLength={40}
              />
              <div className="text-right">
                <p className={`text-xs ${
                  editingAchievement.location.length > 36 
                    ? editingAchievement.location.length >= 40 
                      ? 'text-red-500' 
                      : 'text-orange-500'
                    : 'text-gray-500'
                }`}>
                  {editingAchievement.location.length}/40 characters
                </p>
                {editingAchievement.location.length >= 40 && (
                  <p className="text-xs text-red-500 mt-1">
                    Character limit reached
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Type
              </label>
              <Select
                value={editingAchievement.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="text-sm bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="competition">Competition</SelectItem>
                  <SelectItem value="recognition">Recognition</SelectItem>
                  <SelectItem value="contribution">Contribution</SelectItem>
                  <SelectItem value="award">Award</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Image URL (Optional)
              </label>
              <Input
                value={editingAchievement.imageUrl || ""}
                onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                placeholder="https://images.unsplash.com/photo-example.jpg"
                className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-800">
                Website URL (Optional)
              </label>
              <Input
                value={editingAchievement.websiteUrl || ""}
                onChange={(e) =>
                  handleFieldChange("websiteUrl", e.target.value)
                }
                placeholder="e.g., https://techcrunch.com/article"
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
              value={editingAchievement.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Brief description of your achievement and its impact..."
              className="text-sm bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 font-medium min-h-20 resize-none"
              maxLength={300}
            />
            <div className="text-right">
              <p className={`text-xs ${
                editingAchievement.description.length > 270 
                  ? editingAchievement.description.length >= 300 
                    ? 'text-red-500' 
                    : 'text-orange-500'
                  : 'text-gray-500'
              }`}>
                {editingAchievement.description.length}/300 characters
              </p>
              {editingAchievement.description.length >= 300 && (
                <p className="text-xs text-red-500 mt-1">
                  Character limit reached
                </p>
              )}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-800">Icon</label>
            <IconPicker
              selectedIcon={editingAchievement.iconName ? getIconFromName(editingAchievement.iconName) : null}
              onIconSelect={(icon, iconName) => {
                const updated = { ...editingAchievement, iconName }; // Store iconName string instead of React component
                setEditingAchievement(updated);
                onUpdate(updated);
              }}
              placeholder="Choose an icon for this achievement"
            />
          </div>

          {/* Skills Involved Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Skills Involved ({editingAchievement.skillsInvolved.length}/15)
              </label>
              <Button
                onClick={handleAddSkill}
                variant="ghost"
                size="sm"
                disabled={editingAchievement.skillsInvolved.length >= 15}
                className={`h-7 px-2 text-xs ${
                  editingAchievement.skillsInvolved.length >= 15
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Plus className="w-3 h-3 mr-1" />
                {editingAchievement.skillsInvolved.length >= 15 ? 'Max Reached' : 'Add Skill'}
              </Button>
            </div>

            <div className="space-y-2">
              {editingAchievement.skillsInvolved.map((skill, skillIndex) => (
                <div key={skillIndex} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-1">
                      <Input
                        value={skill}
                        onChange={(e) =>
                          handleSkillChange(skillIndex, e.target.value)
                        }
                        placeholder="Skill name"
                        className="text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 h-8"
                        maxLength={40}
                      />
                      <div className="text-right">
                        <span className={`text-xs ${
                          skill.length > 36 
                            ? skill.length >= 40 
                              ? 'text-red-500' 
                              : 'text-orange-500'
                            : 'text-gray-500'
                        }`}>
                          {skill.length}/40
                        </span>
                        {skill.length >= 40 && (
                          <span className="text-xs text-red-500 ml-1">• Limit reached</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <button
                        onClick={() => handleMoveSkillUp(skillIndex)}
                        disabled={skillIndex === 0}
                        className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
                          skillIndex === 0
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        title="Move up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveSkillDown(skillIndex)}
                        disabled={skillIndex === editingAchievement.skillsInvolved.length - 1}
                        className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
                          skillIndex === editingAchievement.skillsInvolved.length - 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        }`}
                        title="Move down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <Button
                        onClick={() => handleRemoveSkill(skillIndex)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 h-5 w-5 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Points Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-800">
                Key Points ({editingAchievement.keyPoints.length}/10)
              </label>
              <Button
                onClick={handleAddKeyPoint}
                variant="ghost"
                size="sm"
                disabled={editingAchievement.keyPoints.length >= 10}
                className={`h-7 px-2 text-xs ${
                  editingAchievement.keyPoints.length >= 10
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Plus className="w-3 h-3 mr-1" />
                {editingAchievement.keyPoints.length >= 10 ? 'Max Reached' : 'Add Key Point'}
              </Button>
            </div>

            <div className="space-y-2">
              {editingAchievement.keyPoints.map(
                (point, pointIndex) => (
                  <div
                    key={pointIndex}
                    className="space-y-1"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 space-y-1">
                        <Input
                          value={point}
                          onChange={(e) =>
                            handleKeyPointChange(
                              pointIndex,
                              e.target.value,
                            )
                          }
                          placeholder="Key point description"
                          className="text-xs bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 h-8"
                          maxLength={200}
                        />
                        <div className="text-right">
                          <span className={`text-xs ${
                            point.length > 180 
                              ? point.length >= 200 
                                ? 'text-red-500' 
                                : 'text-orange-500'
                              : 'text-gray-500'
                          }`}>
                            {point.length}/200
                          </span>
                          {point.length >= 200 && (
                            <span className="text-xs text-red-500 ml-1">• Limit reached</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          onClick={() => handleMoveKeyPointUp(pointIndex)}
                          disabled={pointIndex === 0}
                          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
                            pointIndex === 0
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                          title="Move up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveKeyPointDown(pointIndex)}
                          disabled={pointIndex === editingAchievement.keyPoints.length - 1}
                          className={`w-5 h-5 flex items-center justify-center rounded transition-colors ${
                            pointIndex === editingAchievement.keyPoints.length - 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                          }`}
                          title="Move down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <Button
                          onClick={() => handleRemoveKeyPoint(pointIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 h-5 w-5 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
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
          {achievement.iconName ? getIconFromName(achievement.iconName) : (
            <Trophy className="w-4 h-4 text-gray-600" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium text-sm">
            {achievement.title}
          </div>
          <div className="text-gray-500 text-xs mt-0.5 truncate">
            {achievement.organization} • {achievement.duration}
          </div>
        </div>

        {/* View indicator */}
        <Eye className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </div>
    </button>
  );
};

export default function EditableAchievementSection({
  achievements = defaultAchievements,
  onAchievementsUpdate,
  className = "",
}: EditableAchievementSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAchievements, setEditingAchievements] =
    useState<AchievementData[]>(achievements);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [expandedAchievement, setExpandedAchievement] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const achievementRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleStartEdit = () => {
    setEditingAchievements([...achievements]);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Show immediate feedback
    toast.success("Update Queued");
    
    onAchievementsUpdate(editingAchievements);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingAchievements([...achievements]);
    setIsEditing(false);
  };

  const handleAchievementUpdate = (
    index: number,
    updatedAchievement: AchievementData,
  ) => {
    const updated = [...editingAchievements];
    updated[index] = updatedAchievement;
    setEditingAchievements(updated);
  };

  const handleAchievementDelete = (index: number) => {
    const updated = editingAchievements.filter((_, i) => i !== index);
    setEditingAchievements(updated);
  };

  const handleAddAchievement = () => {
    // Check if limit is reached
    if (hasReachedLimit(editingAchievements.length, 'ACHIEVEMENTS')) {
      toast.error(`Maximum ${getLimit('ACHIEVEMENTS')} achievement entries allowed.`);
      return;
    }

    const newAchievement: AchievementData = {
      id: `custom-${Date.now()}`,
      title: "Achievement Title",
      organization: "Organization Name",
      duration: "",
      location: "",
      description: "",
      iconName: "Trophy", // Store iconName as string
      type: "competition",
      skillsInvolved: [""],
      keyPoints: [""],
    };
    setEditingAchievements([...editingAchievements, newAchievement]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null) return;

    if (index !== draggedIndex) {
      setDragOverIndex(index);

      // Reorder the array
      const newAchievements = [...editingAchievements];
      const draggedItem = newAchievements[draggedIndex];
      newAchievements.splice(draggedIndex, 1);
      newAchievements.splice(index, 0, draggedItem);

      setEditingAchievements(newAchievements);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newAchievements = [...editingAchievements];
      const item = newAchievements[index];
      newAchievements[index] = newAchievements[index - 1];
      newAchievements[index - 1] = item;
      setEditingAchievements(newAchievements);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < editingAchievements.length - 1) {
      const newAchievements = [...editingAchievements];
      const item = newAchievements[index];
      newAchievements[index] = newAchievements[index + 1];
      newAchievements[index + 1] = item;
      setEditingAchievements(newAchievements);
    }
  };

  const handleAchievementExpand = (achievementId: string) => {
    if (expandedAchievement === achievementId) {
      setExpandedAchievement(null);
    } else {
      setExpandedAchievement(achievementId);
    }
  };

  // Auto-scroll when achievement expands
  useEffect(() => {
    if (expandedAchievement && achievementRefs.current[expandedAchievement]) {
      const timer = setTimeout(() => {
        const expandedElement = achievementRefs.current[expandedAchievement];
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
  }, [expandedAchievement]);

  // Close expandable achievement when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

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

  const currentAchievements = isEditing ? editingAchievements : achievements;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Achievements
          </h2>
          <p className="text-gray-600 text-sm">
            {isEditing
              ? "Edit your notable accomplishments and recognitions"
              : "Notable accomplishments and recognitions"}
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

      {/* Achievements List */}
      <div ref={containerRef} className="space-y-2">
        {isEditing ? (
          <>
            {/* Editing Mode - Show editable items */}
            {currentAchievements.map((achievementItem, index) => (
              <EditableAchievementItem
                key={achievementItem.id}
                achievement={achievementItem}
                isEditing={isEditing}
                index={index}
                onUpdate={(updated) => handleAchievementUpdate(index, updated)}
                onDelete={() => handleAchievementDelete(index)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                dragOverIndex={dragOverIndex}
                onMoveUp={() => handleMoveUp(index)}
                onMoveDown={() => handleMoveDown(index)}
                canMoveUp={index > 0}
                canMoveDown={index < currentAchievements.length - 1}
              />
            ))}

            {/* Add New Achievement Button */}
            <button
              onClick={handleAddAchievement}
              disabled={hasReachedLimit(editingAchievements.length, 'ACHIEVEMENTS')}
              className={`w-full p-4 border-2 border-dashed rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 ${
                hasReachedLimit(editingAchievements.length, 'ACHIEVEMENTS')
                  ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-gray-200 text-gray-500 hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">
                {hasReachedLimit(editingAchievements.length, 'ACHIEVEMENTS')
                  ? `Maximum ${getLimit('ACHIEVEMENTS')} achievement entries reached`
                  : 'Add New Achievement'
                }
              </span>
            </button>
          </>
        ) : (
          <>
            {/* View Mode - Show expandable achievements like in demo */}
            {currentAchievements.map((achievementItem) => (
              <div
                key={achievementItem.id}
                ref={(el) => (achievementRefs.current[achievementItem.id] = el)}
              >
                <Achievement
                  achievement={achievementItem}
                  isOpen={expandedAchievement === achievementItem.id}
                  onClose={() => setExpandedAchievement(null)}
                  onExpand={() => handleAchievementExpand(achievementItem.id)}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
