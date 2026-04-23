# Blueprint Astro Theme

A clean documentation theme for Astro 5, ported from Blueprint Docs.

## Installation

```bash
npm install blueprint-astro-theme
```

This package has peer dependencies on `astro` and `astro-pagefind`. Make sure they are installed in your project:

```bash
npm install astro astro-pagefind
```

## Setup

### 1. Configure Content Collection

Create or update `src/content.config.ts` in your project. Import the theme's schema to ensure your docs match the expected frontmatter structure:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from 'blueprint-astro-theme/schema';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: docsSchema,
});

export const collections = { docs };
```

### 2. Create Your Content

Place Markdown files in `src/content/docs/`. Nested folders automatically become nested sidebar groups.

```md
---
title: Getting Started
description: How to install and configure the project
order: 1
---

## Installation

Run the following command...
```

### 3. Create Pages

#### Homepage (`src/pages/index.astro`)

```astro
---
import { BaseLayout, TocGroup, generateSidebar } from 'blueprint-astro-theme';
import { getCollection } from 'astro:content';

const allDocs = await getCollection('docs');
const sidebar = generateSidebar(allDocs);
---

<BaseLayout title="My Documentation" nav={sidebar.groups}>
  <div class="home-header">
    <h1 class="home-title">My Documentation</h1>
    <p class="home-subtitle">Welcome to the docs</p>
  </div>

  <div class="toc-grid">
    {sidebar.groups.map((group) => (
      <TocGroup group={group} docs={allDocs} />
    ))}
  </div>
</BaseLayout>
```

#### Doc Pages (`src/pages/docs/[...slug].astro`)

```astro
---
import { BaseLayout, TableOfContents, generateSidebar } from 'blueprint-astro-theme';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  const sorted = docs.sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  return sorted.map((doc, index) => ({
    params: { slug: doc.id },
    props: { doc, allDocs: sorted, currentIndex: index },
  }));
}

const { doc, allDocs, currentIndex } = Astro.props;
const { Content, headings } = await render(doc);
const sidebar = generateSidebar(allDocs);

const prev = currentIndex > 0 ? allDocs[currentIndex - 1] : null;
const next = currentIndex < allDocs.length - 1 ? allDocs[currentIndex + 1] : null;
---

<BaseLayout title={doc.data.title} description={doc.data.description} nav={sidebar.groups}>
  <div class="article-with-toc">
    <article>
      <header class="article-header">
        <h1 class="article-title">{doc.data.title}</h1>
        {doc.data.description && <p class="article-meta">{doc.data.description}</p>}
      </header>

      <div class="article-content">
        <Content />
      </div>

      <nav class="article-nav">
        {prev ? (
          <a href={`/docs/${prev.id}`} class="article-nav-link prev">
            <div class="article-nav-label">Previous</div>
            <div class="article-nav-title">{prev.data.title}</div>
          </a>
        ) : <div />}
        {next ? (
          <a href={`/docs/${next.id}`} class="article-nav-link next">
            <div class="article-nav-label">Next</div>
            <div class="article-nav-title">{next.data.title}</div>
          </a>
        ) : <div />}
      </nav>
    </article>

    <aside class="toc-sidebar">
      <TableOfContents headings={headings} />
    </aside>
  </div>
</BaseLayout>
```

#### Import Styles

In your project's root layout or page, import the theme's global CSS:

```astro
---
import 'blueprint-astro-theme/styles/global.css';
---
```

Or, if you are already using `BaseLayout`, the styles are imported automatically.

### 4. Configure Pagefind (Search)

Add `astro-pagefind` to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
  integrations: [pagefind()],
  vite: {
    optimizeDeps: { exclude: ['/pagefind/pagefind.js'] },
    build: { rollupOptions: { external: ['/pagefind/pagefind.js'] } },
  },
});
```

## Available Exports

### Layouts

| Export | Description |
|--------|-------------|
| `BaseLayout` | Root layout with sidebar, theme script, fonts, and slots |

### Components

| Export | Description |
|--------|-------------|
| `Sidebar` | Left sidebar with logo, search, navigation groups, theme toggle |
| `SidebarSubgroup` | Recursive nested group renderer for Sidebar |
| `TableOfContents` | Sticky right-side TOC from page headings |
| `ThemeToggle` | Light / dark / auto theme toggle button |
| `Search` | Pagefind-powered search modal (Cmd+K) |
| `BackToTop` | Scroll-to-top button |
| `TocGroup` | Homepage card grid for doc groups |

### Utilities

| Export | Description |
|--------|-------------|
| `generateSidebar(docs)` | Auto-generate nested sidebar from docs collection |
| `getFlatSidebar(docs)` | Flat single-level sidebar from docs collection |
| `docsSchema` | Zod schema for docs frontmatter (import from `/schema`) |

### Types

| Export | Description |
|--------|-------------|
| `SidebarItem` | `{ title, href, num? }` |
| `SidebarGroup` | `{ title?, items }` |
| `SidebarConfig` | `{ groups: SidebarGroup[] }` |
| `DocsCollection` | Inferred type from `docsSchema` |

## BaseLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **required** | Page title (`<title>`) |
| `description` | `string` | theme description | Meta description |
| `nav` | `SidebarGroup[]` | `[]` | Sidebar navigation groups |
| `lang` | `string` | `"zh-CN"` | HTML lang attribute |

## Component Props

### Sidebar

| Prop | Type | Default |
|------|------|---------|
| `logo` | `string` | `"Blueprint"` |
| `subtitle` | `string` | `"Astro Theme"` |
| `nav` | `SidebarGroup[]` | `[]` |
| `footerText` | `string` | `""` |

### TableOfContents

| Prop | Type | Default |
|------|------|---------|
| `headings` | `{ depth, slug, text }[]` | `[]` |
| `title` | `string` | `"目录"` |

### Search

| Prop | Type | Default |
|------|------|---------|
| `placeholder` | `string` | `"搜索文档"` |

## CSS Variables

Override these in your own global CSS to customize the theme:

| Variable | Description | Light Default |
|----------|-------------|---------------|
| `--c-bg` | Page background | `#f8fafc` |
| `--c-canvas` | Card/content background | `#ffffff` |
| `--c-border` | Border color | `#cbd5e1` |
| `--c-text-main` | Primary text | `#0f172a` |
| `--c-text-sub` | Secondary text | `#64748b` |
| `--c-accent` | Accent/link color | `#1B365D` |
| `--c-accent-hover` | Link hover color | `#2a4a7a` |
| `--c-code-bg` | Code background | `#f1f5f9` |
| `--sidebar-width` | Sidebar width | `280px` |

Dark mode is automatically handled via `[data-theme="dark"]` overrides.

## Frontmatter Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Document title |
| `description` | `string` | No | Short description |
| `order` | `number` | No | Sort order within group |
| `date` | `Date` | No | Publication date |

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Mobile: sidebar collapses to hamburger menu |
| `768px - 1024px` | Tablet: TOC hidden |
| `> 1024px` | Desktop: full layout with sidebar + TOC |

## License

MIT
