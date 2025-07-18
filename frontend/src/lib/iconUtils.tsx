import {
  // Common icons
  ExternalLink,
  Briefcase,
  Folder,
  Home,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Eye,
  Search,
  Settings,
  // Social & Platform icons
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  // Design & Creative
  Palette,
  Paintbrush,
  Camera,
  Film,
  Image,
  Pen,
  PenTool,
  // Tech & Development
  Code,
  Database,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  // Business & Work
  Building,
  Building2,
  Users,
  UserCheck,
  Trophy,
  Award,
  Target,
  TrendingUp,
  BarChart,
  PieChart,
  // Tools & Objects
  Wrench,
  Hammer,
  Scissors,
  Ruler,
  Calculator,
  Book,
  BookOpen,
  FileText,
  // Education
  GraduationCap,
  // Actions & Arrows
  Play,
  Pause,
  Download,
  Upload,
  Share,
  Send,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  // Misc
  Zap,
  Rocket,
  Shield,
  Lock,
  Unlock,
  Check,
  X,
  Plus,
  Minus,
} from "lucide-react";

// Map of icon names to components
export const iconMap: Record<string, React.ComponentType<any>> = {
  // Common
  ExternalLink,
  Briefcase,
  Folder,
  Home,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Eye,
  Search,
  Settings,
  // Social & Platform
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  // Design & Creative
  Palette,
  Paintbrush,
  Camera,
  Film,
  Image,
  Pen,
  PenTool,
  // Tech & Development
  Code,
  Database,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Server,
  Cloud,
  // Business & Work
  Building,
  Building2,
  Users,
  UserCheck,
  Trophy,
  Award,
  Target,
  TrendingUp,
  BarChart,
  PieChart,
  // Tools & Objects
  Wrench,
  Hammer,
  Scissors,
  Ruler,
  Calculator,
  Book,
  BookOpen,
  FileText,
  // Education
  GraduationCap,
  // Actions & Arrows
  Play,
  Pause,
  Download,
  Upload,
  Share,
  Send,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  // Misc
  Zap,
  Rocket,
  Shield,
  Lock,
  Unlock,
  Check,
  X,
  Plus,
  Minus,
};

/**
 * Convert an icon name to a React node
 */
export function getIconFromName(
  iconName: string,
  className = "w-4 h-4 text-gray-600",
): React.ReactNode {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    // Return default icon if not found
    return <ExternalLink className={className} />;
  }
  return <IconComponent className={className} />;
}

/**
 * Extract icon name from React node (best effort)
 */
export function getIconNameFromNode(iconNode: React.ReactNode): string | null {
  if (!iconNode || typeof iconNode !== "object") {
    return null;
  }

  // Check if it's a React element
  if ("type" in iconNode && typeof iconNode.type === "function") {
    const iconName = iconNode.type.name;
    if (iconName && iconMap[iconName]) {
      return iconName;
    }
  }

  return null;
}

/**
 * Check if an icon name exists in our icon map
 */
export function isValidIconName(iconName: string): boolean {
  return iconName in iconMap;
}

/**
 * Get all available icon names
 */
export function getAllIconNames(): string[] {
  return Object.keys(iconMap);
}
