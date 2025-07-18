import { PortfolioProject, ProjectImage } from "@/components/ProjectShowcase";
import {
  Palette,
  Smartphone,
  Globe,
  Camera,
  Code,
  Briefcase,
} from "lucide-react";

// Re-export types for easy import
export type { PortfolioProject, ProjectImage };

// Example portfolio projects with image galleries
export const defaultPortfolioProjects: PortfolioProject[] = [
  {
    id: "mobile-app-design",
    title: "Mobile App Design",
    description: "E-commerce iOS App",
    category: "UI/UX Design",
    href: "https://dribbble.com/shots/mobile-app",
    icon: null,
    images: [
      {
        id: "mobile-1",
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&crop=center",
        title: "App Home Screen",
        description:
          "Clean and modern home screen design featuring product discovery and personalized recommendations with intuitive navigation patterns.",
      },
      {
        id: "mobile-2",
        url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center",
        title: "Product Details",
        description:
          "Detailed product view with high-quality imagery, specifications, and seamless add-to-cart functionality designed for conversion.",
      },
      {
        id: "mobile-3",
        url: "https://images.unsplash.com/photo-1555421689-491a97ff2040?w=800&h=600&fit=crop&crop=center",
        title: "Checkout Flow",
        description:
          "Streamlined checkout process with multiple payment options, address management, and order confirmation designed for minimal friction.",
      },
    ],
  },
  {
    id: "web-platform",
    title: "SaaS Dashboard",
    description: "Analytics Platform",
    category: "Web Design",
    href: "https://behance.net/gallery/saas-dashboard",
    icon: null,
    images: [
      {
        id: "web-1",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center",
        title: "Dashboard Overview",
        description:
          "Comprehensive analytics dashboard with real-time data visualization, customizable widgets, and intuitive data filtering options.",
      },
      {
        id: "web-2",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center",
        title: "Data Visualization",
        description:
          "Advanced charting and reporting interface with interactive elements, drill-down capabilities, and export functionality.",
      },
      {
        id: "web-3",
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop&crop=center",
        title: "User Management",
        description:
          "Team collaboration features with role-based permissions, user onboarding flows, and activity monitoring dashboard.",
      },
    ],
  },
  {
    id: "brand-identity",
    title: "Brand Identity",
    description: "Tech Startup Branding",
    category: "Branding",
    icon: null,
    images: [
      {
        id: "brand-1",
        url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop&crop=center",
        title: "Logo Design",
        description:
          "Modern, scalable logo design that reflects the company's innovative technology focus with clean typography and memorable iconography.",
      },
      {
        id: "brand-2",
        url: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop&crop=center",
        title: "Brand Guidelines",
        description:
          "Comprehensive brand guidelines including color palette, typography system, logo usage, and application examples across various media.",
      },
      {
        id: "brand-3",
        url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=600&fit=crop&crop=center",
        title: "Marketing Materials",
        description:
          "Complete suite of marketing collateral including business cards, letterheads, presentations, and digital assets maintaining brand consistency.",
      },
    ],
  },
  {
    id: "photography",
    title: "Photography",
    description: "Product & Lifestyle",
    category: "Photography",
    icon: null,
    images: [
      {
        id: "photo-1",
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop&crop=center",
        title: "Product Photography",
        description:
          "High-quality product shots with professional lighting and composition, perfect for e-commerce and marketing campaigns.",
      },
      {
        id: "photo-2",
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center",
        title: "Lifestyle Shots",
        description:
          "Authentic lifestyle photography capturing products in real-world contexts, creating emotional connections with target audiences.",
      },
      {
        id: "photo-3",
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center",
        title: "Editorial Style",
        description:
          "Creative editorial photography with artistic direction, perfect for brand storytelling and premium marketing materials.",
      },
    ],
  },
  {
    id: "web-development",
    title: "Web Development",
    description: "Full-Stack Projects",
    category: "Development",
    href: "https://github.com/username/projects",
    icon: null,
    images: [
      {
        id: "dev-1",
        url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&crop=center",
        title: "Frontend Development",
        description:
          "Modern React applications with responsive design, optimized performance, and excellent user experience across all devices.",
      },
      {
        id: "dev-2",
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&crop=center",
        title: "Backend Architecture",
        description:
          "Scalable backend systems with RESTful APIs, database optimization, and cloud deployment for high-performance applications.",
      },
      {
        id: "dev-3",
        url: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=600&fit=crop&crop=center",
        title: "DevOps & Deployment",
        description:
          "CI/CD pipelines, containerization with Docker, cloud infrastructure management, and automated testing workflows.",
      },
    ],
  },
  {
    id: "consulting",
    title: "Design Consulting",
    description: "Strategic Design",
    category: "Consulting",
    icon: null,
    images: [
      {
        id: "consult-1",
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center",
        title: "Strategy Workshops",
        description:
          "Collaborative design thinking sessions with stakeholders to align business goals with user needs and technical requirements.",
      },
      {
        id: "consult-2",
        url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop&crop=center",
        title: "UX Audits",
        description:
          "Comprehensive user experience audits identifying pain points, optimization opportunities, and actionable improvement recommendations.",
      },
      {
        id: "consult-3",
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop&crop=center",
        title: "Team Training",
        description:
          "Design system workshops and team training sessions to establish consistent design practices and improve cross-functional collaboration.",
      },
    ],
  },
];

// Utility function to create custom portfolio projects
export const createPortfolioProjects = (
  customProjects: Partial<Record<string, Partial<PortfolioProject>>>,
): PortfolioProject[] => {
  return defaultPortfolioProjects.map((project) => {
    const custom = customProjects[project.id];
    if (custom) {
      return { ...project, ...custom };
    }
    return project;
  });
};

// Utility to get projects by category
export const getProjectsByCategory = (category: string): PortfolioProject[] => {
  return defaultPortfolioProjects.filter((project) =>
    project.category.toLowerCase().includes(category.toLowerCase()),
  );
};

// Utility to get all categories
export const getAllCategories = (): string[] => {
  const categories = defaultPortfolioProjects.map(
    (project) => project.category,
  );
  return [...new Set(categories)];
};
