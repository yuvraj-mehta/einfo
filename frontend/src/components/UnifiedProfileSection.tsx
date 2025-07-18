import { useState, useEffect, useRef } from "react";
import UnifiedDigitalCard from "@/components/UnifiedDigitalCard";
import { PersonProfile, defaultProfile } from "@/lib/profileData";

interface UnifiedProfileSectionProps {
  profile?: Partial<PersonProfile>;
  className?: string;
  canEdit?: boolean; // Controls whether edit button shows
  onProfileUpdate?: (profile: PersonProfile) => void;
}

export default function UnifiedProfileSection({
  profile = {},
  className = "",
  canEdit = false,
  onProfileUpdate,
}: UnifiedProfileSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const digitalCardRef = useRef<{ handleOutsideClick: () => void }>(null);

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] =
    useState<PersonProfile>(defaultProfile);

  // Merge provided profile with defaults
  const finalProfile = { ...defaultProfile, ...profile };

  // Initialize editing profile when profile changes
  useEffect(() => {
    setEditingProfile(finalProfile);
  }, [profile]);

  const handleStartEdit = () => {
    setEditingProfile(finalProfile);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onProfileUpdate) {
      onProfileUpdate(editingProfile);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingProfile(finalProfile);
    setIsEditing(false);
  };

  const handleProfileChange = (updatedProfile: PersonProfile) => {
    setEditingProfile(updatedProfile);
  };

  // Close digital card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Close digital card when clicking outside the main container
      if (containerRef.current && !containerRef.current.contains(target)) {
        if (digitalCardRef.current) {
          digitalCardRef.current.handleOutsideClick();
        }
        return;
      }

      // If clicking inside the container, check if it's on links or empty space (not the digital card)
      if (containerRef.current && containerRef.current.contains(target)) {
        const digitalCardElement = target.closest(".digital-card-container");

        // If not clicking on the digital card itself, flip it back
        if (!digitalCardElement && digitalCardRef.current) {
          digitalCardRef.current.handleOutsideClick();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`w-full max-w-lg mx-auto ${className}`}>
      {/* Digital Card */}
      <div className="digital-card-container">
        <UnifiedDigitalCard
          ref={digitalCardRef}
          profile={isEditing ? editingProfile : finalProfile}
          isEditing={isEditing}
          canEdit={canEdit}
          onEdit={handleStartEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onProfileChange={handleProfileChange}
        />
      </div>
    </div>
  );
}

// Export types for easy use
export type { PersonProfile };
