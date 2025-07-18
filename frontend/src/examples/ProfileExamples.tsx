import ProfileSection from "@/components/ProfileSection";
import {
  createProfile,
  createProjectLinks,
  defaultProjects,
  DribbbleIcon,
  BehanceIcon,
  LinkedInIcon,
  FigmaIcon,
  EmailIcon,
} from "@/lib/profileData";

// Example 1: Using defaults (exactly like the original)
export function DefaultExample() {
  return <ProfileSection />;
}

// Example 2: Custom profile with default projects
export function CustomProfileExample() {
  const customProfile = createProfile({
    name: "Jane Smith",
    jobTitle: "Senior Product Designer",
    bio: "Designing user-centered digital experiences for startups and Fortune 500 companies.",
    email: "jane@example.com",
    website: "janesmith.design",
    location: "New York, NY",
    profileImage: "/custom-profile.jpg",
  });

  return <ProfileSection profile={customProfile} />;
}

// Example 3: Custom profile with custom project URLs
export function CustomLinksExample() {
  const customProfile = createProfile({
    name: "Alex Rodriguez",
    jobTitle: "UI Developer",
    email: "alex@alexdev.com",
    website: "alexdev.com",
  });

  const customProjects = createProjectLinks({
    dribbble: { href: "https://dribbble.com/alexrodriguez" },
    behance: { href: "https://behance.net/alexrodriguez" },
    linkedin: { href: "https://linkedin.com/in/alexrodriguez" },
    figma: { href: "https://figma.com/@alexrodriguez" },
    email: { href: "mailto:alex@alexdev.com" },
  });

  return <ProfileSection profile={customProfile} projects={customProjects} />;
}

// Example 4: Completely custom projects
export function CompletelyCustomExample() {
  const customProfile = createProfile({
    name: "Maria Garcia",
    jobTitle: "Brand Strategist",
    bio: "Helping businesses build memorable brands that connect with their audience.",
    email: "maria@brandstrategy.co",
    website: "brandstrategy.co",
    location: "Los Angeles",
  });

  const customProjects = [
    {
      id: "portfolio",
      title: "Portfolio",
      description: "Brand Case Studies",
      href: "https://brandstrategy.co/portfolio",
      icon: <FigmaIcon />,
      imageUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=240&fit=crop",
      projectDetails:
        "Explore comprehensive brand strategies and visual identity systems for diverse clients.",
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      description: "Professional Network",
      href: "https://linkedin.com/in/mariagarcia",
      icon: <LinkedInIcon />,
      projectDetails:
        "Connect with me for brand strategy insights and industry discussions.",
    },
    {
      id: "email",
      title: "Email",
      description: "Let's Collaborate",
      href: "mailto:maria@brandstrategy.co",
      icon: <EmailIcon />,
      projectDetails:
        "Reach out for brand consulting, speaking engagements, or collaborations.",
    },
  ];

  return <ProfileSection profile={customProfile} projects={customProjects} />;
}

// Example 5: With custom event handlers
export function WithCustomHandlersExample() {
  const handleLinkClick = (linkId: string, href: string) => {
    console.log(`Link expanded: ${linkId} - ${href}`);
    // You can add analytics tracking here
  };

  const handleDirectLink = (href: string) => {
    console.log(`Direct link clicked: ${href}`);
    // Custom logic before opening link
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <ProfileSection
      onLinkClick={handleLinkClick}
      onDirectLink={handleDirectLink}
    />
  );
}

// Example 6: Multiple profiles on one page
export function MultipleProfilesExample() {
  const designer = createProfile({
    name: "Designer Name",
    jobTitle: "UI/UX Designer",
    email: "designer@example.com",
  });

  const developer = createProfile({
    name: "Developer Name",
    jobTitle: "Full Stack Developer",
    email: "developer@example.com",
  });

  return (
    <div className="space-y-20">
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Designer</h2>
        <ProfileSection profile={designer} className="max-w-md" />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-center mb-8">Developer</h2>
        <ProfileSection profile={developer} className="max-w-md" />
      </section>
    </div>
  );
}

// Export all examples
export const examples = {
  DefaultExample,
  CustomProfileExample,
  CustomLinksExample,
  CompletelyCustomExample,
  WithCustomHandlersExample,
  MultipleProfilesExample,
};

export default examples;
