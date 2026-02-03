# Nex Dashboard — Design & Code Rules

This is v1 of my operating system. These rules are non-negotiable.

## Philosophy

- **Clean > Clever** — No workarounds. If it's not right, fix it properly.
- **Future-proof** — Code should scale. No shortcuts that create debt.
- **AI-native** — Built to be understood and modified by AI agents.
- **Apple-inspired** — Spatial, clean, considered. Every pixel intentional.

---

## Design System

### Visual Language

- **Glassmorphism** — Subtle backdrop blur, translucent surfaces
- **Spatial design** — Generous whitespace, clear hierarchy
- **Depth** — Use shadows and blur to create layers
- **Motion** — Subtle, purposeful animations (no gratuitous effects)

### Color Philosophy

- **Semantic colors** — Colors have meaning (success, warning, error, info)
- **Neutral base** — Most UI is neutral; color is accent
- **Dark/Light parity** — Both modes are first-class citizens
- **CSS variables** — All colors via `var(--color-*)` for runtime theming

### Typography

- **System font stack** — Native feel, fast loading
- **Clear hierarchy** — 4-5 distinct levels max
- **Readable** — Sufficient contrast, comfortable line-height

### Spacing

- **8px grid** — All spacing multiples of 8 (4 for tight situations)
- **Consistent gaps** — Use design tokens, not arbitrary values
- **Breathe** — When in doubt, add more space

---

## Code Conventions

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (routes)/          # Route groups
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Primitive UI components (Button, Card, Input)
│   └── features/          # Feature-specific components
├── lib/
│   ├── supabase/          # Database client & types
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Pure utility functions
├── styles/
│   └── globals.css        # Global styles & CSS variables
└── types/                 # Shared TypeScript types
```

### Component Rules

1. **Server Components by default** — Only `'use client'` when needed
2. **Composition over configuration** — Prefer children/slots over props
3. **Single responsibility** — One component, one job
4. **Colocate related code** — Tests, stories, types near components

### Naming

- **Components**: PascalCase (`ContentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useTheme.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **CSS variables**: kebab-case (`--color-primary`)
- **Files**: kebab-case for non-components (`api-client.ts`)

### TypeScript

- **Strict mode** — Always
- **No `any`** — Use `unknown` + type guards instead
- **Explicit return types** — For exported functions
- **Zod for validation** — Runtime type safety at boundaries

### Data Fetching

- **Server Components fetch data** — Pass to Client Components as props
- **React Query for client state** — When client-side fetching is needed
- **Supabase typed client** — Generated types from schema

### State Management

- **URL state first** — Use search params for shareable state
- **React Context for theme** — System-wide concerns only
- **Local state when possible** — Don't over-centralize

---

## CSS Architecture

### Global Styles (globals.css)

```css
@import "tailwindcss";

/* === Theme Variables === */
@theme {
  /* Colors defined via CSS variables for runtime theming */
  --color-background: var(--bg);
  --color-foreground: var(--fg);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  /* ... */
}

/* === Light Theme (default) === */
:root {
  --bg: 255 255 255;
  --fg: 9 9 11;
  --muted: 113 113 122;
  --accent: 234 179 8;
  /* ... */
}

/* === Dark Theme === */
[data-theme="dark"] {
  --bg: 9 9 11;
  --fg: 250 250 250;
  --muted: 161 161 170;
  --accent: 250 204 21;
  /* ... */
}
```

### Utility Classes

- Use Tailwind utilities for layout and spacing
- Use CSS variables for colors: `bg-[rgb(var(--bg))]` or via `@theme`
- Create custom utilities for repeated patterns

### Glass Effect Standard

```css
.glass {
  background: rgb(var(--bg) / 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgb(var(--fg) / 0.1);
}
```

---

## Component Library

### Primitives (src/components/ui/)

These are the atomic building blocks. Keep them pure.

| Component | Purpose |
|-----------|---------|
| `Button` | Actions, submissions |
| `Card` | Container with glass effect |
| `Input` | Text input, textarea |
| `Select` | Dropdowns |
| `Badge` | Status indicators |
| `Avatar` | User/entity images |
| `Skeleton` | Loading states |
| `Dialog` | Modal overlays |
| `Tooltip` | Contextual hints |

### Features (src/components/features/)

Composed from primitives for specific use cases.

---

## Performance Rules

1. **Images**: Use `next/image` with proper sizing
2. **Fonts**: Use `next/font` for self-hosting
3. **Code splitting**: Dynamic imports for heavy components
4. **Memoization**: Only when profiling shows need
5. **Suspense boundaries**: Wrap async components

---

## Accessibility

- **Semantic HTML** — Use proper elements (`button`, `nav`, `main`)
- **ARIA when needed** — But prefer semantic HTML first
- **Keyboard navigation** — All interactive elements focusable
- **Color contrast** — WCAG AA minimum (4.5:1 for text)
- **Motion** — Respect `prefers-reduced-motion`

---

## Testing

- **Unit tests** — For utils and hooks
- **Component tests** — For UI components with Testing Library
- **E2E** — Critical paths with Playwright
- **Visual regression** — For design system components

---

## Git Conventions

- **Conventional commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`
- **Atomic commits** — One logical change per commit
- **Branch naming**: `feature/description`, `fix/description`

---

## AI Instructions

When modifying this codebase:

1. **Read RULES.md first** — These rules override defaults
2. **Use Context7 MCP** — Query for latest library patterns
3. **Check existing patterns** — Match the established style
4. **Update types** — Keep TypeScript happy
5. **Test changes** — Ensure nothing breaks
6. **Document decisions** — Add comments for non-obvious choices

---

*Last updated: 2026-02-03 by Nex*
