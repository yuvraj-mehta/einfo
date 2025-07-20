// Types for profile and links
export interface PersonProfile {
  name: string;
  jobTitle: string;
  bio: string;
  email: string;
  website: string;
  location: string;
  profileImage: string;
  resumeUrl?: string;
  skills?: string[];
}

export interface ProjectLink {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: string; // Changed from React.ReactNode to string for icon name
  imageUrl?: string;
  projectDetails: string;
}

// Default profile
export const defaultProfile: PersonProfile = {
  name: "Pranav",
  jobTitle: "Developer & Consultant",
  bio: "Creating digital experiences that matter. Clean, functional, human-centered design.",
  email: "alex@example.com",
  website: "alexjohnson.design",
  location: "San Francisco",
  profileImage: "/placeholder.svg",
  resumeUrl: "https://drive.google.com/file/d/example/view",
  skills: ["UI Design", "Prototyping", "User Research", "Figma", "React"],
};

// Icon components
export const DribbbleIcon = () => (
  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm7.568 5.302c1.4 1.5 2.252 3.5 2.252 5.7-.3-.1-3.3-.6-6.07-.3-.3-.7-.6-1.5-1-2.2 3-1.2 4.518-2.9 4.818-3.2zm-1.6-1.3c-.3.3-1.7 1.9-4.6 3-.9-1.7-1.9-3.1-2.1-3.3 2.3-.3 4.6 0 6.7.3zM7.818 1.802c.2.2 1.2 1.6 2.1 3.2-2.6.7-4.9.7-5.2.7.4-1.8 1.5-3.3 3.1-3.9zm-3.1 5.8s.1 0 .1 0c.3 0 3.1 0 5.9-.8.2.4.4.8.5 1.2l-.2.1c-2.9 1-4.4 3.6-4.6 3.8-.1-.8-.1-1.6 0-2.4.2-1.1.6-2 1.3-2.9zm1.4 6.7c.2-.3 1.4-2.4 4-3.3l.1-.1c.8 2.1 1.1 3.8 1.2 4.3-1.3.5-2.5.5-3.5.3-.8-.2-1.5-.7-1.8-1.2zm6.7 1.2c-.1-.6-.4-2.3-1.2-4.4 2.6-.4 4.9.2 5.2.3-.4 2-1.7 3.6-3.4 4.2-.2 0-.4-.1-.6-.1z" />
  </svg>
);

export const BehanceIcon = () => (
  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 2-5.101 2-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
);

export const LinkedInIcon = () => (
  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const FigmaIcon = () => (
  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.015-4.49-4.491S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117v-6.038H8.148zm7.704 0c2.476 0 4.49 2.015 4.49 4.491s-2.014 4.49-4.49 4.49c-2.476 0-4.491-2.014-4.491-4.49s2.015-4.491 4.491-4.491zm0 7.51c1.665 0 3.019-1.355 3.019-3.019s-1.354-3.019-3.019-3.019-3.019 1.355-3.019 3.019 1.354 3.019 3.019 3.019zM8.148 24c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49 4.491 2.014 4.491 4.49S10.624 24 8.148 24zm0-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019 3.019-1.354 3.019-3.019-1.355-3.019-3.019-3.019z" />
  </svg>
);

export const EmailIcon = () => (
  <svg
    className="w-4 h-4 text-black"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// Default project links
export const defaultProjects: ProjectLink[] = [
  {
    id: "dribbble",
    title: "Dribbble",
    description: "Design Portfolio",
    imageUrl:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=240&fit=crop",
    projectDetails:
      "Featured UI/UX design shots including mobile app interfaces, web designs, and branding projects. Check out my latest work and creative explorations.",
    href: "https://dribbble.com",
    icon: "Palette",
  },
  {
    id: "behance",
    title: "Behance",
    description: "Case Studies",
    imageUrl:
      "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=240&fit=crop",
    projectDetails:
      "In-depth case studies showcasing my design process from research to final implementation. Detailed breakdowns of user experience challenges and solutions.",
    href: "https://behance.net",
    icon: "Folder",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Professional Network",
    projectDetails:
      "Connect with me professionally to see my work experience, recommendations, and industry insights. Let's grow our professional network together.",
    href: "https://linkedin.com",
    icon: "Linkedin",
  },
  {
    id: "figma",
    title: "Figma",
    description: "Design Files",
    imageUrl:
      "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=240&fit=crop",
    projectDetails:
      "Access to design systems, wireframes, and interactive prototypes. See how I organize design files and collaborate with development teams.",
    href: "https://figma.com",
    icon: "Pen",
  },
  {
    id: "email",
    title: "Email",
    description: "Direct Contact",
    projectDetails:
      "Get in touch directly for project inquiries, collaborations, or just to say hello. I typically respond within 24 hours.",
    href: "mailto:contact@example.com",
    icon: "Mail",
  },
];

// Utility function to create custom profile
export const createProfile = (
  overrides: Partial<PersonProfile>,
): PersonProfile => ({
  ...defaultProfile,
  ...overrides,
});

// Utility function to create custom project links
export const createProjectLinks = (
  customProjects: Partial<Record<string, Partial<ProjectLink>>>,
): ProjectLink[] => {
  return defaultProjects.map((project) => {
    const custom = customProjects[project.id];
    if (custom) {
      return { ...project, ...custom };
    }
    return project;
  });
};
