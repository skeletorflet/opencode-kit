---
name: astro-starlight
description: Astro Starlight template for beautiful documentation sites with MDX support.
---

# Astro Starlight Documentation Template

## Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Astro v5 | Content-focused |
| Theme | Starlight | Documentation theme |
| Content | MDX | Markdown + Components |
| Search | Pagefind | Built-in search |
| Styling | Tailwind CSS v4 | CSS-first |
| Deployment | Vercel/Netlify | Static + SSR |

---

## Directory Structure

```
project-name/
├── src/
│   ├── content/
│   │   ├── docs/
│   │   │   ├── getting-started.md
│   │   │   ├── guides/
│   │   │   │   ├── installation.md
│   │   │   │   └── configuration.md
│   │   │   └── api/
│   │   │       └── reference.md
│   │   └── config.ts           # Content schema
│   ├── components/
│   │   └── CustomComponent.astro
│   ├── styles/
│   │   └── custom.css
│   └── env.d.ts
├── public/
│   └── logo.svg
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

## Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'My Documentation',
      social: {
        github: '
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started' },
            { label: 'Installation', slug: 'guides/installation' },
          ],
        },
        {
          label: 'API Reference',
          autogenerate: { directory: 'api' },
        },
      ],
    }),
  ],
});
```

---

## Content Format

```markdown
---
title: Getting Started
description: Learn how to get started with our platform.
sidebar:
  order: 1
---

# Getting Started

Welcome to our documentation!

:::tip
This is a helpful tip for users.
:::

:::caution
Be careful when modifying production settings.
:::
```

---

## Custom Components

```astro
---
// src/components/FeatureCard.astro
interface Props {
  title: string;
  description: string;
  icon: string;
}

const { title, description, icon } = Astro.props;
---

<div class="feature-card">
  <span class="icon">{icon}</span>
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

---

## Setup Steps

1. Create project:
   ```bash
   npm create astro@latest my-docs -- --template starlight
   cd my-docs
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. Build:
   ```bash
   npm run build
   ```

---

## Best Practices

- **MDX for docs**: Use Markdown for content, components for interactivity
- **Search**: Pagefind provides built-in search
- **i18n**: Starlight supports multiple languages
- **Accessibility**: Starlight is WCAG compliant
- **Performance**: Astro's zero-JS approach for static content