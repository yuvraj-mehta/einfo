import type { ExtracurricularData } from "@/types/newSections";

// Example extracurricular activities data
export const defaultExtracurriculars: ExtracurricularData[] = [
  {
    id: "debate-team",
    activityName: "University Debate Team Captain",
    organization: "UC Berkeley Debate Society",
    duration: "2018 - 2020",
    location: "Berkeley, CA",
    description:
      "Led the university debate team to regional championships while developing public speaking and critical thinking skills. Organized training sessions and mentored new members.",
    iconName: "Users",
    type: "leadership",
    role: "Team Captain",
    responsibilities: [
      "Led weekly training sessions for 25+ team members",
      "Organized inter-university debate competitions",
      "Mentored freshman debaters in argumentation techniques",
      "Managed team budget and logistics for tournaments",
      "Represented university at national championships",
    ],
    achievements: [
      "Won Regional Debate Championship 2019",
      "Placed 3rd at National Collegiate Debate Tournament",
      "Increased team membership by 40% during tenure",
      "Established scholarship fund for underprivileged students",
    ],
    skillsDeveloped: [
      "Public Speaking",
      "Critical Thinking",
      "Research Skills",
      "Team Leadership",
      "Time Management",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://berkeley.edu/debate-society",
  },
  {
    id: "volunteering-coding",
    activityName: "Volunteer Coding Instructor",
    organization: "Code for Kids Non-Profit",
    duration: "2021 - Present",
    location: "San Francisco, CA",
    description:
      "Volunteer instructor teaching programming fundamentals to underserved youth aged 8-16. Developed curriculum and organized coding camps during summer breaks.",
    iconName: "Heart",
    type: "volunteering",
    role: "Volunteer Instructor",
    responsibilities: [
      "Teach Python and Scratch programming to 30+ students weekly",
      "Develop age-appropriate coding curriculum",
      "Organize summer coding bootcamps",
      "Mentor students in their first coding projects",
      "Coordinate with other volunteers and staff",
    ],
    achievements: [
      "Taught 200+ students programming fundamentals",
      "Organized 5 successful summer coding camps",
      "Developed interactive curriculum adopted by other chapters",
      "Helped 15 students win local programming competitions",
    ],
    skillsDeveloped: [
      "Teaching & Mentorship",
      "Curriculum Development",
      "Community Outreach",
      "Patience & Empathy",
      "Event Organization",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://codeforkids.org",
  },
  {
    id: "photography-club",
    activityName: "Photography Club President",
    organization: "Bay Area Photography Collective",
    duration: "2020 - 2022",
    location: "San Francisco, CA",
    description:
      "Led a community photography club focusing on street photography and digital art. Organized monthly photo walks, workshops, and exhibitions showcasing member work.",
    iconName: "Camera",
    type: "creative",
    role: "Club President",
    responsibilities: [
      "Organized monthly photo walks around San Francisco",
      "Coordinated photography workshops with professional photographers",
      "Managed club social media and online presence",
      "Curated and organized annual photography exhibitions",
      "Built partnerships with local galleries and venues",
    ],
    achievements: [
      "Grew club membership from 20 to 150+ members",
      "Organized 3 successful photography exhibitions",
      "Featured club work in local art magazines",
      "Established mentorship program for amateur photographers",
    ],
    skillsDeveloped: [
      "Photography & Visual Arts",
      "Event Management",
      "Social Media Marketing",
      "Creative Direction",
      "Community Building",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://bayareaphoto.collective",
  },
  {
    id: "environmental-club",
    activityName: "Environmental Sustainability Advocate",
    organization: "Green Campus Initiative",
    duration: "2019 - 2021",
    location: "Berkeley, CA",
    description:
      "Spearheaded campus-wide sustainability initiatives including waste reduction programs, renewable energy advocacy, and environmental awareness campaigns.",
    iconName: "Leaf",
    type: "advocacy",
    role: "Lead Advocate",
    responsibilities: [
      "Developed campus waste reduction strategies",
      "Lobbied administration for renewable energy adoption",
      "Organized Earth Day awareness campaigns",
      "Coordinated recycling and composting programs",
      "Educated students on sustainable living practices",
    ],
    achievements: [
      "Reduced campus waste by 35% through new initiatives",
      "Secured $50,000 funding for solar panel installation",
      "Organized campus-wide events reaching 2,000+ students",
      "Established campus community garden",
    ],
    skillsDeveloped: [
      "Environmental Policy",
      "Project Management",
      "Advocacy & Lobbying",
      "Data Analysis",
      "Sustainability Planning",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://berkeley.edu/green-campus",
  },
];

// Utility function to create custom extracurricular data
export const createExtracurricularsData = (
  customExtracurriculars: Partial<Record<string, Partial<ExtracurricularData>>>,
): ExtracurricularData[] => {
  return defaultExtracurriculars.map((extracurricular) => {
    const custom = customExtracurriculars[extracurricular.id];
    if (custom) {
      return { ...extracurricular, ...custom };
    }
    return extracurricular;
  });
};

// Utility to get extracurriculars by type
export const getExtracurricularsByType = (type: string): ExtracurricularData[] => {
  return defaultExtracurriculars.filter((extracurricular) =>
    extracurricular.type.toLowerCase().includes(type.toLowerCase()),
  );
};

// Utility to get recent extracurriculars
export const getRecentExtracurriculars = (limit: number = 3): ExtracurricularData[] => {
  return defaultExtracurriculars.slice(0, limit);
};
