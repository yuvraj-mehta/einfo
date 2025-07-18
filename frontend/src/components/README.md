# Reusable Profile Section

A fully reusable profile card and links component that can be easily used across different projects.

## 🚀 Quick Start

### Basic Usage (Use defaults)

```tsx
import ProfileSection from "@/components/ProfileSection";

function MyPage() {
  return <ProfileSection />;
}
```

### Custom Profile

```tsx
import ProfileSection from "@/components/ProfileSection";
import { createProfile } from "@/lib/profileData";

function MyPage() {
  const profile = createProfile({
    name: "Your Name",
    jobTitle: "Your Job Title",
    email: "your@email.com",
    website: "yourwebsite.com",
    location: "Your Location",
    profileImage: "/your-image.jpg",
  });

  return <ProfileSection profile={profile} />;
}
```

### Custom Links

```tsx
import ProfileSection from "@/components/ProfileSection";
import { createProfile, createProjectLinks } from "@/lib/profileData";

function MyPage() {
  const profile = createProfile({
    name: "Your Name",
    email: "your@email.com",
  });

  const projects = createProjectLinks({
    dribbble: { href: "https://dribbble.com/yourprofile" },
    behance: { href: "https://behance.net/yourprofile" },
    linkedin: { href: "https://linkedin.com/in/yourprofile" },
  });

  return <ProfileSection profile={profile} projects={projects} />;
}
```

## 📝 Props

| Prop           | Type                                     | Default           | Description                   |
| -------------- | ---------------------------------------- | ----------------- | ----------------------------- |
| `profile`      | `Partial<PersonProfile>`                 | `defaultProfile`  | Personal information          |
| `projects`     | `ProjectLink[]`                          | `defaultProjects` | Array of project/social links |
| `className`    | `string`                                 | `""`              | Additional CSS classes        |
| `onLinkClick`  | `(linkId: string, href: string) => void` | `undefined`       | Custom link expand handler    |
| `onDirectLink` | `(href: string) => void`                 | `undefined`       | Custom direct link handler    |

## 🔧 Types

```tsx
interface PersonProfile {
  name: string;
  jobTitle: string;
  bio: string;
  email: string;
  website: string;
  location: string;
  profileImage: string;
  resumeUrl?: string;
}

interface ProjectLink {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  imageUrl?: string;
  projectDetails: string;
}
```

## 🎨 Available Icons

```tsx
import {
  DribbbleIcon,
  BehanceIcon,
  LinkedInIcon,
  FigmaIcon,
  EmailIcon,
} from "@/lib/profileData";

// Use in custom projects
const customProject = {
  id: "dribbble",
  title: "Dribbble",
  icon: <DribbbleIcon />,
  // ... other props
};
```

## 📦 What to Copy for Other Projects

To use this in another project, copy these files:

- `src/components/ProfileSection.tsx`
- `src/lib/profileData.tsx`
- `src/components/DigitalCard.tsx`
- `src/components/LinkButton.tsx`
- `src/components/ExpandableCard.tsx`

## 💡 Examples

See `src/examples/ProfileExamples.tsx` for complete working examples including:

- Default usage
- Custom profiles
- Custom links
- Custom event handlers
- Multiple profiles on one page

## ✨ Features

- ✅ **Fully Configurable**: All data passed as props
- ✅ **TypeScript Support**: Complete type safety
- ✅ **Default Fallbacks**: Works out of the box
- ✅ **Custom Icons**: Easy icon integration
- ✅ **Responsive Design**: Works on all devices
- ✅ **Event Handlers**: Custom link behavior
- ✅ **Reusable**: Use in any project
- ✅ **No Breaking Changes**: Maintains original functionality

## 🔄 Migration from Hardcoded Version

If you had hardcoded data before:

```tsx
// Before
const projects = {
  dribbble: { title: "Dribbble", href: "..." },
  // ...
};

// After
import { createProjectLinks } from "@/lib/profileData";
const projects = createProjectLinks({
  dribbble: { href: "..." },
  // ...
});
```

That's it! Your profile section is now fully reusable across projects! 🎉
