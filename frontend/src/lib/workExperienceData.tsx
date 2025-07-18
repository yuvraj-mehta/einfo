import { WorkExperienceData, WorkProject } from "@/components/WorkExperience";
import { Building2, Zap, Rocket, Users, Globe, Shield } from "lucide-react";

// Example work experiences with projects and achievements
export const defaultWorkExperiences: WorkExperienceData[] = [
  {
    id: "senior-designer",
    company: "TechCorp Inc.",
    position: "Senior UI/UX Designer",
    duration: "2022 - Present",
    location: "San Francisco, CA",
    description:
      "Leading design initiatives for enterprise software products, managing a team of 3 designers, and establishing design systems across multiple product lines. Collaborating closely with product managers and engineering teams to deliver user-centered solutions.",
    icon: null,
    projects: [
      {
        id: "dashboard-redesign",
        title: "Analytics Dashboard Redesign",
        description:
          "Complete overhaul of the main analytics dashboard used by 10K+ users daily. Improved user engagement by 40% and reduced support tickets by 60%.",
        technologies: ["Figma", "React", "TypeScript", "Tailwind CSS"],
      },
      {
        id: "mobile-app",
        title: "Mobile App Design System",
        description:
          "Created comprehensive design system for iOS and Android apps, ensuring consistency across 5 different product teams and reducing design debt by 70%.",
        technologies: ["Sketch", "Abstract", "Principle", "Zeplin"],
      },
      {
        id: "user-research",
        title: "Customer Journey Optimization",
        description:
          "Conducted extensive user research and A/B testing that led to a 25% increase in conversion rates and improved onboarding completion by 50%.",
        technologies: ["Hotjar", "Google Analytics", "Maze", "Miro"],
      },
    ],
    achievements: [
      "Increased user satisfaction score from 3.2 to 4.7 out of 5",
      "Reduced average task completion time by 35%",
      "Led design team to win 'Innovation Award' for Q3 2023",
      "Established company-wide design system adopted by 8 teams",
      "Mentored 2 junior designers who received promotions",
    ],
  },
  {
    id: "product-designer",
    company: "StartupXYZ",
    position: "Product Designer",
    duration: "2020 - 2022",
    location: "New York, NY",
    description:
      "First design hire at a fast-growing fintech startup. Built the entire design foundation from scratch, including brand identity, user experience flows, and design processes. Worked directly with founders and engineering team.",
    icon: null,
    projects: [
      {
        id: "payment-flow",
        title: "Payment Processing Interface",
        description:
          "Designed secure and intuitive payment flows that processed $2M+ in transactions monthly. Focused on building trust and reducing abandonment rates.",
        technologies: ["Adobe XD", "InVision", "Framer", "Lottie"],
      },
      {
        id: "onboarding",
        title: "User Onboarding Experience",
        description:
          "Created seamless onboarding flow that reduced drop-off rates by 45% and helped acquire 50K+ new users in the first year.",
        technologies: ["Figma", "Principle", "After Effects"],
      },
    ],
    achievements: [
      "Designed product used by 50,000+ active users",
      "Helped raise $5M Series A funding with design prototypes",
      "Reduced customer support tickets by 40% through better UX",
      "Built design system that scaled from 2 to 15 engineers",
    ],
  },
  {
    id: "ux-designer",
    company: "Design Agency Pro",
    position: "UX Designer",
    duration: "2018 - 2020",
    location: "Los Angeles, CA",
    description:
      "Worked with diverse clients ranging from e-commerce to healthcare, delivering user-centered design solutions. Specialized in user research, wireframing, and prototyping for web and mobile applications.",
    icon: null,
    projects: [
      {
        id: "ecommerce-redesign",
        title: "E-commerce Platform Redesign",
        description:
          "Led complete redesign of fashion e-commerce site, resulting in 60% increase in conversion rates and 30% boost in average order value.",
        technologies: ["Sketch", "InVision", "Hotjar", "Google Analytics"],
      },
      {
        id: "healthcare-app",
        title: "Healthcare Patient Portal",
        description:
          "Designed HIPAA-compliant patient portal that improved appointment booking efficiency by 75% and patient satisfaction scores significantly.",
        technologies: ["Adobe XD", "Marvel", "UsabilityHub"],
      },
    ],
    achievements: [
      "Delivered 15+ successful client projects",
      "Improved average client conversion rates by 45%",
      "Received 'Designer of the Year' award in 2019",
      "Built long-term relationships with 8 recurring clients",
    ],
  },
  {
    id: "junior-designer",
    company: "Creative Studio",
    position: "Junior UI Designer",
    duration: "2017 - 2018",
    location: "Austin, TX",
    description:
      "Started my design career working on various web and mobile projects. Focused on learning industry best practices, design tools, and collaborating with senior designers and developers.",
    icon: null,
    projects: [
      {
        id: "restaurant-website",
        title: "Restaurant Chain Website",
        description:
          "Contributed to responsive website design for regional restaurant chain, focusing on menu displays and location finder functionality.",
        technologies: ["Photoshop", "Illustrator", "HTML/CSS"],
      },
      {
        id: "mobile-ui",
        title: "Fitness App UI Components",
        description:
          "Designed UI components and icon sets for fitness tracking mobile app, focusing on clean and motivational design language.",
        technologies: ["Sketch", "Zeplin", "Principle"],
      },
    ],
    achievements: [
      "Completed design foundation bootcamp with honors",
      "Contributed to 8 client projects in first year",
      "Received mentorship from award-winning senior designers",
      "Built strong foundation in design principles and tools",
    ],
  },
];

// Utility function to create custom work experiences
export const createWorkExperiences = (
  customExperiences: Partial<Record<string, Partial<WorkExperienceData>>>,
): WorkExperienceData[] => {
  return defaultWorkExperiences.map((experience) => {
    const custom = customExperiences[experience.id];
    if (custom) {
      return { ...experience, ...custom };
    }
    return experience;
  });
};

// Utility to get experiences by company type
export const getExperiencesByType = (type: string): WorkExperienceData[] => {
  // You can filter by company type, position level, etc.
  return defaultWorkExperiences.filter((exp) =>
    exp.company.toLowerCase().includes(type.toLowerCase()),
  );
};

// Utility to get experiences by duration/years
export const getRecentExperiences = (years: number): WorkExperienceData[] => {
  // This is a simple implementation - you'd want to parse dates properly
  return defaultWorkExperiences.slice(0, years);
};
