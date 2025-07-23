import type { AchievementData } from "@/types/newSections";

// Example achievements data
export const defaultAchievements: AchievementData[] = [
  {
    id: "hackathon-winner",
    title: "1st Place - Tech Innovation Hackathon 2023",
    organization: "Silicon Valley Tech Hub",
    duration: "March 2023",
    location: "San Jose, CA",
    description:
      "Led a team of 4 developers to create an AI-powered sustainability app that won first place among 150+ participants. The solution helps users track and reduce their carbon footprint through gamification.",
    iconName: "Trophy",
    type: "competition",
    skillsInvolved: [
      "React Native",
      "Machine Learning",
      "Team Leadership",
      "Product Design",
      "Pitch Presentation",
    ],
    keyPoints: [
      "Competed against 150+ participants from top tech companies",
      "Developed working prototype in 48 hours",
      "Secured $10,000 prize money and mentorship program",
      "Featured in TechCrunch article",
      "Led cross-functional team of developers and designers",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://techcrunch.com/hackathon-winners-2023",
  },
  {
    id: "open-source-contribution",
    title: "Core Contributor - Open Source React Library",
    organization: "React Community",
    duration: "2022 - Present",
    location: "Remote",
    description:
      "Active contributor to a popular React UI library with over 50k GitHub stars. Contributed to performance optimizations, accessibility improvements, and new component development.",
    iconName: "Code2",
    type: "contribution",
    skillsInvolved: [
      "TypeScript",
      "React",
      "Performance Optimization",
      "Accessibility",
      "Code Review",
      "Technical Writing",
    ],
    keyPoints: [
      "Contributed 200+ commits to main repository",
      "Improved performance by 40% through code optimizations",
      "Added accessibility features for visually impaired users",
      "Maintained 98% test coverage on new features",
      "Mentored 15+ new contributors through PR reviews",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://github.com/react-ui-library",
  },
  {
    id: "leadership-award",
    title: "Outstanding Leadership Award",
    organization: "University of California, Berkeley",
    duration: "May 2020",
    location: "Berkeley, CA",
    description:
      "Recognized for exceptional leadership in organizing university-wide coding bootcamp that trained 500+ students in web development fundamentals over one academic year.",
    iconName: "Award",
    type: "recognition",
    skillsInvolved: [
      "Event Management",
      "Public Speaking",
      "Curriculum Development",
      "Team Coordination",
      "Mentorship",
    ],
    keyPoints: [
      "Organized 20+ workshops with industry professionals",
      "Managed budget of $15,000 for educational resources",
      "Achieved 95% student satisfaction rating",
      "Established partnerships with 5 tech companies",
      "Created sustainable program adopted by university",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop&crop=center",
    websiteUrl: "https://berkeley.edu/student-awards-2020",
  },
];

// Utility function to create custom achievements data
export const createAchievementsData = (
  customAchievements: Partial<Record<string, Partial<AchievementData>>>,
): AchievementData[] => {
  return defaultAchievements.map((achievement) => {
    const custom = customAchievements[achievement.id];
    if (custom) {
      return { ...achievement, ...custom };
    }
    return achievement;
  });
};

// Utility to get achievements by type
export const getAchievementsByType = (type: string): AchievementData[] => {
  return defaultAchievements.filter((achievement) =>
    achievement.type.toLowerCase().includes(type.toLowerCase()),
  );
};

// Utility to get recent achievements
export const getRecentAchievements = (limit: number = 3): AchievementData[] => {
  return defaultAchievements.slice(0, limit);
};
