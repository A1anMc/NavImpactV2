# NavImpact Design System

## 🎨 **Overview**

NavImpact's design system provides a consistent, professional foundation for building the Impact & Intelligence Platform. Inspired by modern platforms like Donezo, it emphasises clean aesthetics, clear hierarchy, and meaningful impact communication.

## 🎯 **Design Principles**

1. **Professional Impact Focus** - Every element should communicate value and outcomes
2. **Clean & Modern** - Minimal, purposeful design that doesn't distract from content
3. **Accessible** - WCAG compliant with proper contrast and keyboard navigation
4. **Consistent** - Unified patterns across all components and pages
5. **Scalable** - Design tokens and components that grow with the platform

## 🌈 **Color Palette**

### Primary Colors
- **Purple (Primary)**: `#a855f7` - Main brand color for CTAs and key elements
- **Green (Success)**: `#22c55e` - Progress indicators and positive states
- **Neutral Grays**: `#6b7280` to `#111827` - Text and backgrounds

### Color Usage
```typescript
// Primary actions and CTAs
primary-600: #9333ea
primary-700: #7c3aed

// Success states and progress
success-500: #22c55e
success-600: #16a34a

// Neutral text hierarchy
neutral-900: #111827 (Headings)
neutral-700: #374151 (Body text)
neutral-500: #6b7280 (Secondary text)
neutral-300: #d1d5db (Borders)
```

## 📝 **Typography**

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale
- **Display**: `3rem` (48px) - Hero headlines
- **H1**: `2.25rem` (36px) - Page titles
- **H2**: `1.875rem` (30px) - Section headers
- **H3**: `1.5rem` (24px) - Card titles
- **Body**: `1rem` (16px) - Main content
- **Small**: `0.875rem` (14px) - Supporting text
- **Caption**: `0.75rem` (12px) - Labels and metadata

### Font Weights
- **Normal**: 400 - Body text
- **Medium**: 500 - Emphasis
- **Semibold**: 600 - Headings
- **Bold**: 700 - Strong emphasis

## 📏 **Spacing System**

8px base unit system:
- **4px** (0.25rem) - Micro spacing
- **8px** (0.5rem) - Small spacing
- **16px** (1rem) - Base spacing
- **24px** (1.5rem) - Medium spacing
- **32px** (2rem) - Large spacing
- **48px** (3rem) - Section spacing

## 🧩 **Components**

### Cards
```typescript
// Base card with hover effect
<Card hover>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Buttons
```typescript
// Primary action
<Button variant="primary" size="md">
  Primary Action
</Button>

// Secondary action
<Button variant="secondary" size="md">
  Secondary Action
</Button>

// Success state
<Button variant="success" size="md">
  Success Action
</Button>
```

### Badges
```typescript
// Status badge
<Badge variant="success" size="md">
  Active
</Badge>

// SDG badge with official colors
<SDGBadge sdgCode="SDG-4" size="md">
  Quality Education
</SDGBadge>
```

### Page Headers
```typescript
<PageHeader
  tagline="Impact Dashboard"
  subheading="Track your projects and outcomes"
  description="Optional longer description"
  actions={<Button>Action</Button>}
/>
```

## 🎯 **Page Templates**

### Standard Page Structure
1. **Page Header** - Tagline, subheading, description, actions
2. **Stats Grid** - Key metrics and KPIs
3. **Main Content** - Cards, tables, forms
4. **Quick Actions** - Common user actions

### Copy Kit Integration
All page content uses the copy kit for consistent messaging:
```typescript
import { copyKit } from '@/lib/copy-kit';

<PageHeader
  tagline={copyKit.dashboard.tagline}
  subheading={copyKit.dashboard.subheading}
  description={copyKit.dashboard.description}
/>
```

## 🎨 **SDG Integration**

### Official SDG Colors
Each SDG has its official UN color for consistent branding:
- SDG-1 (No Poverty): `#E5243B`
- SDG-4 (Quality Education): `#C5192D`
- SDG-13 (Climate Action): `#3F7E44`
- etc.

### SDG Badge Usage
```typescript
<SDGBadge sdgCode="SDG-4" size="md">
  Quality Education
</SDGBadge>
```

## 📱 **Responsive Design**

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Grid System
```css
/* Mobile first */
.grid-cols-1

/* Tablet */
.md:grid-cols-2

/* Desktop */
.lg:grid-cols-3
```

## ♿ **Accessibility**

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Interactive elements have sufficient contrast
- Color is never the only indicator

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Logical tab order

### Screen Readers
- Proper ARIA labels
- Semantic HTML structure
- Alt text for images

## 🚀 **Usage Guidelines**

### Do's
- ✅ Use the design system components consistently
- ✅ Follow the copy kit for messaging
- ✅ Maintain proper spacing and hierarchy
- ✅ Test accessibility with keyboard navigation
- ✅ Use SDG colors for official UN goals

### Don'ts
- ❌ Don't create custom colors outside the system
- ❌ Don't skip the copy kit for page content
- ❌ Don't ignore responsive design
- ❌ Don't forget accessibility considerations
- ❌ Don't use unofficial SDG colors

## 🔧 **Development**

### Adding New Components
1. Create component in `src/components/ui/`
2. Follow existing patterns and naming
3. Include TypeScript interfaces
4. Add to design system documentation
5. Test with different variants and states

### Updating the System
1. Update `src/lib/design-system.ts`
2. Update `tailwind.config.ts` if needed
3. Update this documentation
4. Test across all pages
5. Ensure accessibility compliance

## 📚 **Resources**

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [UN SDG Colors](https://www.un.org/sustainabledevelopment/sustainable-development-goals/)
- [Inter Font](https://rsms.me/inter/)

---

*This design system ensures NavImpact maintains a professional, consistent, and impactful user experience across all platform features.* 