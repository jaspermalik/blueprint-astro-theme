---
title: API Reference
description: Theme configuration and component APIs
order: 4
---

## BaseLayout

The root layout component that wraps all pages.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Page title |
| `description` | `string` | — | Meta description |
| `nav` | `SidebarGroup[]` | `[]` | Sidebar navigation |
| `lang` | `string` | `"zh-CN"` | HTML lang |

## Content Schema

Docs collection uses the following frontmatter schema:

```ts
{
  title: string;
  description?: string;
  order?: number;
  date?: Date;
}
```
