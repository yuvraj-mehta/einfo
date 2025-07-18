import type { EducationData } from "@/components/Education";
import { GraduationCap, Award, BookOpen, Trophy } from "lucide-react";

// Example education and certifications data
export const defaultEducation: EducationData[] = [
  {
    id: "bachelor-degree",
    institution: "University of California, Berkeley",
    degree: "Bachelor of Science in Computer Science",
    duration: "2016 - 2020",
    location: "Berkeley, CA",
    description:
      "Focused on software engineering, data structures, algorithms, and user interface design. Graduated with honors and completed a senior capstone project in web development.",
    icon: null,
    type: "degree",
    gpa: "3.8/4.0",
    achievements: [
      "Graduated Magna Cum Laude",
      "Dean's List for 6 semesters",
      "Senior Capstone Project: Award-winning web application",
      "Member of Computer Science Honor Society",
      "Teaching Assistant for Data Structures course",
    ],
    courses: [
      "Data Structures and Algorithms",
      "Software Engineering",
      "Database Systems",
      "Human-Computer Interaction",
      "Machine Learning Fundamentals",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://www.berkeley.edu",
  },
  {
    id: "aws-certification",
    institution: "Amazon Web Services",
    degree: "AWS Certified Solutions Architect - Professional",
    duration: "2023",
    location: "Online",
    description:
      "Advanced certification demonstrating expertise in designing distributed applications and systems on the AWS platform. Covers advanced architectural patterns, security, and cost optimization.",
    icon: null,
    type: "certification",
    achievements: [
      "Scored 850/1000 on certification exam",
      "Valid for 3 years with continuous learning requirements",
      "Recognized expertise in cloud architecture",
    ],
    courses: [
      "Advanced Networking",
      "Security Best Practices",
      "Cost Optimization Strategies",
      "Disaster Recovery Planning",
      "Multi-Region Architecture",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://aws.amazon.com/certification/",
  },
  {
    id: "design-bootcamp",
    institution: "Design Institute",
    degree: "UX/UI Design Professional Certificate",
    duration: "2021",
    location: "San Francisco, CA",
    description:
      "Intensive 12-week program covering user experience research, interface design, prototyping, and design thinking methodologies. Hands-on projects with real clients.",
    icon: null,
    type: "certificate",
    achievements: [
      "Completed 480 hours of intensive training",
      "Portfolio project featured in institute showcase",
      "Mentored by senior designers from top tech companies",
      "Received 'Outstanding Student' award",
    ],
    courses: [
      "User Research Methods",
      "Information Architecture",
      "Interaction Design",
      "Visual Design Principles",
      "Prototyping with Figma",
      "Usability Testing",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://designinstitute.com",
  },
  {
    id: "google-certification",
    institution: "Google",
    degree: "Google UX Design Professional Certificate",
    duration: "2022",
    location: "Online",
    description:
      "Comprehensive program covering the entire UX design process from user research to high-fidelity prototypes. Completed multiple portfolio projects and case studies.",
    icon: null,
    type: "certification",
    achievements: [
      "Completed 6-course series in 4 months",
      "Built 3 end-to-end UX projects",
      "Industry-recognized credential",
      "Connected with Google UX community",
    ],
    courses: [
      "Foundations of User Experience Design",
      "Start the UX Design Process",
      "Build Wireframes and Low-Fidelity Prototypes",
      "Conduct UX Research and Test Early Concepts",
      "Create High-Fidelity Designs and Prototypes",
      "Responsive Web Design in Adobe XD",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://grow.google/certificates/ux-design/",
  },
];

// Utility function to create custom education data
export const createEducationData = (
  customEducation: Partial<Record<string, Partial<EducationData>>>,
): EducationData[] => {
  return defaultEducation.map((education) => {
    const custom = customEducation[education.id];
    if (custom) {
      return { ...education, ...custom };
    }
    return education;
  });
};

// Utility to get education by type
export const getEducationByType = (type: string): EducationData[] => {
  return defaultEducation.filter((education) =>
    education.type.toLowerCase().includes(type.toLowerCase()),
  );
};

// Utility to get recent education/certifications
export const getRecentEducation = (years: number): EducationData[] => {
  // This is a simple implementation - you'd want to parse dates properly
  return defaultEducation.slice(0, years);
};
