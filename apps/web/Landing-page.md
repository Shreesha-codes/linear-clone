# Linear Landing Page Clone - Complete Project Documentation

## Project Overview

This is a **Next.js 14** project that recreates the Linear app landing page with modern web technologies, animations, and a component-based architecture. It's designed as a showcase of advanced UI/UX patterns, smooth animations, and responsive design.

**Total Files**: 190 files (excluding node_modules, .git, .next)

---

## Tech Stack

### Core Framework
- **Next.js 14.2.5** - React framework with App Router
- **React 18** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **CSS Modules** - Scoped component styling
- **PostCSS** - CSS processing

### Animation & Interaction
- **Framer Motion 11.3.17** - Animation library
- **@radix-ui/react-dialog** - Accessible dialog primitives
- **@radix-ui/react-slot** - Component composition

### UI Components
- **class-variance-authority** - Component variant management
- **tailwind-merge & clsx** - Conditional class management
- **tailwindcss-animate** - Tailwind animation utilities
- **lucide-react** - Icon library
- **react-icons** - Additional icon sets

### Build Tools
- **@svgr/webpack** - SVG to React component transformation
- **ESLint** - Code linting

---

## Project Structure

```
linear-landing-page-main/
├── app/                          # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css              # Global styles & CSS variables
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Home page (main entry)
│   └── sections/                # Page sections
│       ├── collaborate/
│       ├── customers/
│       ├── foundation/
│       ├── hero/
│       ├── issue-tracking/
│       ├── long-term-planning/
│       ├── modern-product-teams/
│       └── prefooter/
│
├── components/                   # Reusable components
│   ├── ambient-lighting/        # Background lighting effects
│   ├── bento-grid/              # Grid layout system
│   ├── blur-pop-up/             # Animation wrapper
│   ├── blur-pop-up-by-words/    # Text animation
│   ├── footer/                  # Site footer
│   ├── header/                  # Navigation header
│   ├── illustrate-animate/      # Illustration animations
│   ├── layout-wrapper/          # Page layout container
│   ├── sectionHeading/          # Section heading component
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       └── dialog.tsx
│
├── lib/                          # Utility libraries
│   ├── animations.ts            # Framer Motion variants
│   ├── constant.ts              # App constants & data
│   └── utils.ts                 # Helper functions
│
├── assets/                       # SVG icons (60+ files)
│   ├── logo.svg
│   ├── inbox.svg
│   ├── workflow.svg
│   └── ... (various icons)
│
├── public/                       # Static assets
│   ├── collaborate-img1.avif
│   ├── fast-moving.avif
│   ├── perfection.avif
│   ├── issue-tracking-hero.png
│   ├── roadmap.png
│   ├── user-*.jpg/png           # User avatars
│   └── static/fonts/            # Custom fonts
│
├── components.json               # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
├── .eslintrc.json               # ESLint configuration
└── .gitignore                   # Git ignore rules
```

---

## Key Configuration Files

### 1. **package.json**
```json
{
  "name": "interview",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Key Dependencies:**
- `@radix-ui/react-dialog` & `@radix-ui/react-slot` - Headless UI primitives
- `framer-motion` - Animation library
- `@svgr/webpack` - SVG as React components
- `tailwindcss-animate` - Animation utilities

### 2. **tsconfig.json**
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Module resolution: bundler mode
- JSX: preserve (for Next.js)

### 3. **next.config.mjs**
Custom webpack configuration for SVG handling:
- SVGs can be imported as React components
- `*.svg?url` imports as URL
- Default SVG imports as React components via @svgr/webpack

### 4. **tailwind.config.ts**
- Dark mode: class-based
- Custom animations: accordion-down, accordion-up
- Includes tailwindcss-animate plugin
- Responsive breakpoints at 2xl (1400px)

### 5. **components.json** (shadcn/ui)
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "gray"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Core Files Breakdown

### **app/layout.tsx**
Root layout that wraps all pages:
- Includes `<Header />` at top
- Renders `{children}` (page content)
- Includes `<Footer />` at bottom
- Sets metadata (title, description)

### **app/page.tsx**
Main landing page composition:
```tsx
<main>
  <AmbientLighting />      // Background lighting effects
  <Hero />                 // Hero section
  <Customers />            // Customer logos
  <ModernProductTeams />   // Product teams section
  <LongTermPlanning />     // Planning features
  <IssueTracking />        // Issue tracking features
  <Collaborate />          // Collaboration section
  <Foundation />           // Foundation/tech stack
  <PreFooter />            // CTA section
</main>
```

### **app/globals.css**
Extensive CSS custom properties (CSS variables):

**Key Variable Groups:**
1. **Layout Variables**
   - `--header-height: 64px`
   - `--page-max-width: 1024px`
   - `--page-padding-default: 32px`
   - `--grid-columns: 12`

2. **Color Variables**
   - Primary: `--color-bg-primary: #08090a`
   - Text: `--color-text-primary: #fff`
   - Border: `--color-border-primary: #23252a`
   - Brand: `--color-brand-bg: #5e69d1`

3. **Typography**
   - Custom font: "Linear" (Inter var)
   - Font sizes from micro (0.6875rem) to title1 (2.25rem)
   - Font weights: 400-680

4. **Animation Easing**
   - Various cubic-bezier curves (ease-in, ease-out, ease-in-out)
   - Speed variables for transitions

5. **Z-index Layers**
   - `--layer-header: 100`
   - `--layer-dialog: 700`
   - `--layer-max: 10000`

**Responsive Breakpoints:**
- Mobile: max-width 640px (4 columns)
- Tablet: max-width 768px (8 columns)
- Desktop: 12 columns

---

## Component Architecture

### **Section Pattern**
Each section follows this structure:
```
section-name/
├── index.tsx              # Main section component
├── styles.module.css      # Section styles
├── feature-lookup-data.tsx (optional) # Section data
└── components/            # Section-specific components
    ├── card-name/
    │   ├── index.tsx
    │   └── styles.module.css
```

### **1. Hero Section** (`app/sections/hero/`)
- Main landing area with heading
- Animated text using `BlurPopUpByWord`
- Call-to-action buttons
- Illustration with sidebar and inbox
- Uses `IllustrateAnimate` for 3D-like animations

### **2. Customers Section** (`app/sections/customers/`)
Components:
- `customer-list/` - Grid display of customer logos
- `customer-marquee/` - Scrolling marquee of logos

### **3. Modern Product Teams** (`app/sections/modern-product-teams/`)
Components:
- `carousel/` - Horizontal carousel
- `carousel-card/` - Individual cards
- `section-heading/` - Section title

### **4. Issue Tracking** (`app/sections/issue-tracking/`)
Showcase of task management features:
- Uses **Bento Grid** layout system
- Components: `first-card/`, `second-card/`, `user-card/`, `wide-card/`, `menu/`
- `feature-lookup-data.tsx` - Feature icons & descriptions

### **5. Long-term Planning** (`app/sections/long-term-planning/`)
Complex section with tabbed interface:
- Wide card with multiple sub-components:
  - `tab-header/` - Tab navigation
  - `tab-body/` - Tab content
  - `tab-toggle-button/` - Toggle controls
  - `collaborative-docs-card/` - Document preview
  - `inline-comments/` - Comment UI
  - `text-to-issue-commands/` - Command palette

### **6. Collaborate** (`app/sections/collaborate/`)
- `carousel/` - Image carousel
- `carouselCard/` - Card components

### **7. Foundation** (`app/sections/foundation/`)
- `featureList.tsx` - Feature list display
- `definitionList.tsx` - Definition list component

### **8. PreFooter** (`app/sections/prefooter/`)
Final CTA section before footer

---

## Reusable Components

### **1. Bento Grid System** (`components/bento-grid/`)
Flexible grid layout inspired by iOS/macOS design:

**Main Components:**
```tsx
<BentoGrid>                          // Container
  <BentoGridTopLayer>                // Top row
    <BentoCardLeft />                // Left card
    <BentoGridCardRight />           // Right card
  </BentoGridTopLayer>
  
  <BentoGridWideCardWrapper>         // Wide card row
    <WideCard />
  </BentoGridWideCardWrapper>
  
  <BentoGridSeperator />             // Visual separator
  
  <BentoGridFeatureLookupWrapper>    // Feature grid
    <BentoGridFeatureLookUpCard />   // Individual features
  </BentoGridFeatureLookupWrapper>
</BentoGrid>
```

**Sub-components:**
- `bento-card-heading/` - Card titles
- `bento-grid-card-left/` - Left-aligned cards
- `bento-grid-card-right/` - Right-aligned cards
- `bento-grid-feature-lookup-card/` - Feature showcase cards

### **2. Animation Components**

#### **BlurPopUp** (`components/blur-pop-up/`)
```tsx
<BlurPopUp delay={1} className="...">
  {children}
</BlurPopUp>
```
- Animates element from blurred to clear
- Fades in with upward motion
- Configurable delay

#### **BlurPopUpByWords** (`components/blur-pop-up-by-words/`)
```tsx
<BlurPopUpByWord text="Your text here" />
```
- Animates text word-by-word
- Each word appears with blur effect

#### **IllustrateAnimate** (`components/illustrate-animate/`)
```tsx
<IllustrateAnimate delay={2} duration={1.4}>
  {children}
</IllustrateAnimate>
```
- 3D-like animation effect
- Moves from translated/scaled position to normal

### **3. AmbientLighting** (`components/ambient-lighting/`)
Creates atmospheric background lighting:
- Three light sources (light__a, light__b, light__c)
- Positioned absolutely
- Adds depth to the page

### **4. Header** (`components/header/`)
Sticky navigation bar:
- Blur effect background
- Responsive menu (desktop/mobile)
- Navigation links with dropdown triggers
- Login/Signup buttons
- Keyboard shortcut badge (L)
- Mobile hamburger menu

### **5. Footer** (`components/footer/`)
Multi-column footer:
- Logo and social icons (Twitter, GitHub, Slack, YouTube)
- 4 columns: Features, Company, Resources, Developers
- Fully linked navigation
- `footerSection.tsx` - Reusable section component

### **6. LayoutWrapper** (`components/layout-wrapper/`)
Simple container with max-width and padding constraints

### **7. SectionHeading** (`components/sectionHeading/`)
Reusable section title component:
- Badge with custom styling
- Heading text
- Consistent styling across sections

### **8. UI Components** (`components/ui/`)
shadcn/ui styled components:
- **Button**: Multiple variants (default, destructive, outline, ghost, link)
- **Dialog**: Modal/dialog primitives

---

## Library Files

### **lib/utils.ts**
```typescript
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
Utility for merging Tailwind classes (prevents conflicts)

### **lib/animations.ts**
Framer Motion animation variants:

**blurPopUp:**
```typescript
{
  initial: { opacity: 0, filter: 'blur(10px)', y: '20%' },
  animate: { opacity: 1, filter: 'blur(0px)', y: 0 }
}
```

**illustrate:**
```typescript
{
  initial: { opacity: 0, x: 50, y: -50, z: 300 },
  animate: { opacity: 1, x: 0, y: 0, z: 0 }
}
```

### **lib/constant.ts**
Application data:

**Data Types:**
- `footerSections[]` - Footer navigation data
- `foundationList[]` - Foundation feature list
- `userCards[]` - User card data with avatars
- `modernProductCards[]` - Product showcase cards

---

## Assets Organization

### **SVG Icons** (`assets/`)
60+ SVG icons including:
- **Navigation**: logo, inbox, sidebar icons
- **Status**: accept, decline, at-risk, off-track
- **Features**: workflow, views, filter, sla
- **Integration**: figma, slack
- **UI Elements**: comment, copy, favourite, more
- **Data viz**: graph, funnel
- **Team**: people, person, teams
- **Project**: milestone, initiative, workspace

All SVGs are imported as React components via @svgr/webpack

### **Images** (`public/`)
- **Hero images**: issue-tracking-hero.png, roadmap.png
- **Feature images**: collaborate-img1.avif, fast-moving.avif, perfection.avif
- **Product**: product-development.jpeg
- **User avatars**: user-1 through user-9 (jpg/png)
- **Dashboard**: dashboard.svg
- **Fonts**: Inter var font in static/fonts/

---

## Styling Approach

### **Hybrid System**
1. **Tailwind CSS** - Utility classes for layout, spacing, colors
2. **CSS Modules** - Component-scoped styles for complex components
3. **CSS Variables** - Theme tokens in globals.css

### **Design Tokens**
Colors follow a dark theme:
- Background: `#08090a` (near black)
- Text: `#fff` to `#595a5c` (gradient)
- Brand: `#5e69d1` (purple-blue)
- Accent colors: blue, red, green, orange, yellow, purple

### **Responsive Strategy**
- Mobile-first approach
- Breakpoints: 640px (mobile), 768px (tablet), 1400px (2xl)
- Grid columns: 4 (mobile) → 8 (tablet) → 12 (desktop)
- CSS classes: `.hide__mobile`, `.hide__tablet`, `.show__mobile`

---

## Animation Strategy

### **Framer Motion Integration**
All animations use Framer Motion with:
- `whileInView` - Trigger animations on scroll
- `viewport={{ once: true }}` - Animate only once
- Custom variants from `lib/animations.ts`

### **Animation Types**
1. **Text Animations**: Word-by-word blur/fade-in
2. **Element Animations**: Blur pop-up with vertical motion
3. **Illustration Animations**: 3D-like transformations
4. **Scroll Animations**: Triggered as sections enter viewport

### **Performance**
- CSS `will-change` for GPU acceleration
- Transform-based animations (not position)
- Backdrop-filter for blur effects

---

## How to Use This Code in Another Project

### **1. Extract Specific Components**

#### **To Extract Animation System:**
Copy these files:
```
lib/animations.ts
components/blur-pop-up/
components/blur-pop-up-by-words/
components/illustrate-animate/
```
Install: `framer-motion`

#### **To Extract Bento Grid:**
Copy these files:
```
components/bento-grid/
```
Includes complete grid system with all card variants

#### **To Extract Header/Footer:**
Copy these files:
```
components/header/
components/footer/
lib/constant.ts (for footer data)
```
Update navigation links to match your routes

### **2. Reuse Styling System**

#### **CSS Variables:**
Copy from `app/globals.css`:
- Color scheme variables
- Layout variables
- Typography variables
- Animation easing functions

#### **Tailwind Configuration:**
Copy from `tailwind.config.ts`:
- Custom animations
- Theme extensions

### **3. SVG Import Pattern**

To use SVGs as React components:
```typescript
// next.config.mjs
webpack(config) {
  // Add SVG handling configuration
}
```
Then import: `import Logo from '@/assets/logo.svg'`

### **4. Component Patterns to Reuse**

#### **Section Pattern:**
```tsx
<section className={styles.section}>
  <LayoutWrapper>
    <SectionHeading 
      heading="Title"
      badgeText="Badge"
      badgeStyle="bg-blue-500"
    />
    {/* Content */}
  </LayoutWrapper>
</section>
```

#### **Animation Pattern:**
```tsx
<BlurPopUp delay={1}>
  <h2>Animated Heading</h2>
</BlurPopUp>
```

#### **Grid Pattern:**
```tsx
<BentoGrid>
  <BentoGridTopLayer>
    <BentoCardLeft title="..." description="...">
      {/* Content */}
    </BentoCardLeft>
  </BentoGridTopLayer>
</BentoGrid>
```

### **5. Best Practices from This Project**

1. **Component Organization**: Each component in own folder with styles
2. **Type Safety**: TypeScript interfaces for props
3. **Responsive Design**: Mobile-first with CSS custom properties
4. **Performance**: CSS Modules for scoped styles, no global pollution
5. **Accessibility**: Radix UI primitives for keyboard navigation
6. **Code Splitting**: Section-based organization for lazy loading
7. **Asset Management**: SVG as components, optimized images

---

## Development Workflow

### **Install Dependencies**
```bash
npm install
```

### **Run Development Server**
```bash
npm run dev
```
Open http://localhost:3000

### **Build for Production**
```bash
npm run build
npm start
```

### **Lint Code**
```bash
npm run lint
```

---

## Key Features Implemented

### **Visual Design**
- ✅ Dark theme with custom color palette
- ✅ Glassmorphism effects (blur, transparency)
- ✅ Ambient lighting backgrounds
- ✅ Bento grid layouts
- ✅ Custom typography (Inter var font)

### **Interactions**
- ✅ Scroll-triggered animations
- ✅ Blur/fade-in effects
- ✅ Word-by-word text animations
- ✅ 3D transform effects
- ✅ Hover states
- ✅ Responsive navigation

### **Technical**
- ✅ Server-side rendering (Next.js)
- ✅ TypeScript type safety
- ✅ CSS Modules scoping
- ✅ SVG as React components
- ✅ Optimized images
- ✅ Responsive design
- ✅ Accessibility primitives

---

## Dependencies Breakdown

### **Production Dependencies (17)**
```json
{
  "@radix-ui/react-dialog": "^1.1.1",      // Modal dialogs
  "@radix-ui/react-slot": "^1.1.0",        // Component composition
  "@svgr/webpack": "^8.1.0",               // SVG to React
  "class-variance-authority": "^0.7.0",    // Variant management
  "clsx": "^2.1.1",                        // Class merging
  "framer-motion": "^11.3.17",             // Animations
  "lucide-react": "^0.414.0",              // Icons
  "next": "14.2.5",                        // Framework
  "react": "^18",                          // UI library
  "react-dom": "^18",                      // React DOM
  "react-icons": "^5.2.1",                 // Icon library
  "tailwind-merge": "^2.4.0",              // Tailwind utils
  "tailwindcss-animate": "^1.0.7"          // Animations
}
```

### **Dev Dependencies (7)**
```json
{
  "@types/node": "^20",                    // Node types
  "@types/react": "^18",                   // React types
  "@types/react-dom": "^18",               // React DOM types
  "eslint": "^8",                          // Linting
  "eslint-config-next": "14.2.5",          // Next.js ESLint
  "postcss": "^8",                         // CSS processing
  "tailwindcss": "^3.4.1",                 // Tailwind
  "typescript": "^5"                       // TypeScript
}
```

---

## File Count Summary

| Category | Count |
|----------|-------|
| TypeScript/TSX files | ~95 |
| CSS Module files | ~45 |
| SVG icons | ~60 |
| Images | ~20 |
| Configuration files | 8 |
| **Total** | **~190** |

---

## Sections Detail

### **1. Hero** - Landing section
- Animated headline
- Call-to-action buttons
- Illustration with sidebar

### **2. Customers** - Social proof
- Customer logos in grid
- Marquee effect

### **3. Modern Product Teams** - Feature showcase
- Carousel of cards
- Product images
- Feature highlights

### **4. Long-term Planning** - Planning features
- Tabbed interface
- Collaborative docs
- Inline comments
- Text-to-issue commands

### **5. Issue Tracking** - Task management
- Bento grid layout
- Cycles feature
- Triage management
- Custom workflows
- Filters and SLAs

### **6. Collaborate** - Team features
- Collaboration images
- Carousel cards

### **7. Foundation** - Technical foundation
- Feature list
- Definition list
- Security & performance highlights

### **8. PreFooter** - Final CTA
- Conversion-focused section

---

## Migration Guide

### **To Next.js 15:**
1. Update package.json dependencies
2. Review App Router changes
3. Update middleware if any

### **To React 19:**
1. Check Framer Motion compatibility
2. Update React types
3. Test animations

### **To Tailwind 4:**
1. Update configuration format
2. Review CSS variable usage
3. Test responsive breakpoints

---

## Performance Optimizations

1. **Image Optimization**: Next.js Image component
2. **Font Loading**: Local font with font-display: block
3. **Code Splitting**: Section-based organization
4. **CSS Modules**: Scoped styles, tree-shaking
5. **SVG Optimization**: React components, tree-shakeable
6. **Animation Performance**: GPU-accelerated transforms
7. **Lazy Loading**: Images and sections

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest

---

## Accessibility Features

- Semantic HTML
- ARIA labels (via Radix UI)
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance

---

## License

Check the original repository for license information.

---

## Summary

This is a production-quality landing page clone featuring:
- **Modern Stack**: Next.js 14, React 18, TypeScript
- **Advanced Animations**: Framer Motion with scroll triggers
- **Responsive Design**: Mobile-first approach
- **Component Architecture**: Modular, reusable components
- **Performance**: Optimized images, fonts, and code splitting
- **Accessibility**: Radix UI primitives

Perfect for learning modern web development patterns and extracting components for your own projects!
