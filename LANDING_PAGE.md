# Landing Page Implementation

## Overview

This PR adds a complete landing page implementation for the Linear clone project, featuring:

- 8 fully-designed sections (Hero, Customers, Modern Product Teams, Long-term Planning, Issue Tracking, Collaborate, Foundation, Pre-footer)
- 62 custom SVG assets
- Smooth animations using Framer Motion
- Responsive design with Tailwind CSS
- Reusable component library

## Tech Stack

- **React 19.0.0** - Latest React with automatic JSX runtime
- **Next.js 16.0.1** - App Router pattern
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Framer Motion 11.18.2** - Animation library
- **@svgr/webpack 8.1.0** - SVG-as-React-component imports
- **Radix UI** - Accessible component primitives

## Development

### Running the Dev Server

The landing page works perfectly in development mode with webpack:

```bash
npm install
npm run dev
```

This will start the Next.js dev server on http://localhost:3000 with full SVG support and hot reload.

## Current Limitations

### Production Build Issue

⚠️ **Known Issue**: The production build currently fails due to Next.js 16's Turbopack not fully supporting custom webpack configurations for SVG handling.

**Error**: The build fails when trying to pre-render pages because Turbopack doesn't use the webpack SVG loader configuration in production mode.

**Workaround Options**:
1. **Migrate to Tailwind CSS v4** (upstream uses v4, landing page uses v3) - requires updating all CSS modules
2. **Wait for Turbopack SVG support** - Next.js team is working on native SVG handling in Turbopack
3. **Use alternative SVG approach** - Convert SVGs to inline components or use different import strategy

### Why It Works in Dev but Not Build

- **Dev mode**: Uses webpack when `--webpack` flag is provided, which respects the custom SVG loader config
- **Build mode**: Next.js 16 uses Turbopack by default, which doesn't support custom webpack loaders yet

## File Structure

```
apps/web/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx             # Root layout with Header/Footer
│   ├── globals.css            # Global styles
│   └── sections/              # Landing page sections
│       ├── hero/
│       ├── customers/
│       ├── modern-product-teams/
│       ├── long-term-planning/
│       ├── issue-tracking/
│       ├── collaborate/
│       ├── foundation/
│       └── prefooter/
├── components/
│   ├── header/                # Navigation header
│   ├── footer/                # Site footer
│   ├── ambient-lighting/      # Background effects
│   ├── bento-grid/            # Grid layout components
│   └── ui/                    # Reusable UI components
├── assets/                    # 62 SVG files
├── lib/
│   ├── animations.ts          # Framer Motion variants
│   ├── constant.ts            # App constants
│   └── utils.ts               # Utility functions
└── next.config.mjs            # Next.js config with webpack SVG loader
```

## Components Implemented

### Sections
- **Hero**: Animated hero section with gradient effects
- **Customers**: Customer logos marquee
- **Modern Product Teams**: Feature showcase with carousel
- **Long-term Planning**: Tabbed interface for planning features
- **Issue Tracking**: Interactive issue tracking demo
- **Collaborate**: Collaboration features with carousel
- **Foundation**: Core platform features
- **Pre-footer**: CTA section

### Shared Components
- **Header**: Responsive navigation with mobile menu
- **Footer**: Multi-column footer with social links
- **BentoGrid**: Flexible grid layout system
- **AmbientLighting**: Animated background gradients
- **UI Components**: Button, Dialog, etc.

## Dependencies Added

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "framer-motion": "^11.18.2",
    "lucide-react": "^0.414.0",
    "react-icons": "^5.2.1",
    "tailwind-merge": "^2.4.0",
    "tailwindcss": "^3.4.18",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@svgr/webpack": "^8.1.0"
  }
}
```

## Next Steps

To make this production-ready, the upstream maintainer can choose one of these paths:

1. **Accept as dev-only** - Landing page works perfectly in development, useful for design/UX review
2. **Help with Tailwind v4 migration** - Migrate all CSS modules from Tailwind v3 to v4 syntax (requires `@reference` directives and updated responsive breakpoints)
3. **Alternative SVG strategy** - Convert SVG imports to a Turbopack-compatible approach
4. **Wait for Next.js update** - Future Next.js versions may improve Turbopack webpack compatibility

## Credits

Landing page design inspired by [Linear.app](https://linear.app), implemented with modern React best practices.

## Questions?

For any questions or to discuss the migration path, please comment on the PR or reach out to @Suhassk205.
