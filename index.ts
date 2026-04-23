// Layouts
export { default as BaseLayout } from './src/layouts/BaseLayout.astro';

// Components
export { default as Sidebar } from './src/components/Sidebar.astro';
export { default as SidebarSubgroup } from './src/components/SidebarSubgroup.astro';
export { default as TableOfContents } from './src/components/TableOfContents.astro';
export { default as ThemeToggle } from './src/components/ThemeToggle.astro';
export { default as Search } from './src/components/Search.astro';
export { default as BackToTop } from './src/components/BackToTop.astro';
export { default as TocGroup } from './src/components/TocGroup.astro';

// Utils & Types
export { generateSidebar, getFlatSidebar } from './src/utils/sidebar';
export type { SidebarItem, SidebarGroup, SidebarConfig } from './src/utils/sidebar';

// Content Schema
export { docsSchema } from './src/schema';
export type { DocsCollection } from './src/schema';
