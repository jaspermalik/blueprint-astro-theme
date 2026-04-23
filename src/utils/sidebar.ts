import type { CollectionEntry } from 'astro:content';

export interface SidebarItem {
  title: string;
  href: string;
  num?: string;
}

export interface SidebarGroup {
  title?: string;
  items: (SidebarItem | SidebarGroup)[];
}

export interface SidebarConfig {
  groups: SidebarGroup[];
}

export interface BoardingPassRow {
  type: 'doc' | 'category';
  level: number;
  title: string;
  href?: string;
  description?: string;
  num?: string;
}

interface TreeNode {
  title: string;
  href?: string;
  children: TreeNode[];
  order: number;
}

/**
 * Auto-generate sidebar navigation from docs collection.
 * Supports multi-level nested directories (e.g., A/B/C → A > B > C).
 */
export function generateSidebar(docs: CollectionEntry<'docs'>[]): SidebarConfig {
  const sorted = [...docs].sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  // Build tree structure
  const root: TreeNode = { title: '', children: [], order: 0 };

  for (const doc of sorted) {
    const id = doc.id;
    const parts = id.split('/');

    // Traverse/create path in tree
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      // Last part is always the document (Astro 5.x id doesn't include .md extension)
      const isDoc = i === parts.length - 1;

      if (isDoc) {
        // Leaf node - the actual document
        current.children.push({
          title: doc.data.title,
          href: `/docs/${id}`,
          children: [],
          order: doc.data.order || 0,
        });
      } else {
        // Directory node - find or create
        let child = current.children.find(c => c.title.toLowerCase() === part.toLowerCase() && !c.href);
        if (!child) {
          child = {
            title: part.charAt(0).toUpperCase() + part.slice(1),
            children: [],
            order: 0,
          };
          current.children.push(child);
        }
        current = child;
      }
    }
  }

  // Convert tree to SidebarGroup format
  const groups: SidebarGroup[] = root.children
    .filter(c => c.children.length > 0 || c.href)
    .sort((a, b) => a.order - b.order)
    .map(convertTreeNode);

  return { groups };
}

function convertTreeNode(node: TreeNode, index: number = 0): SidebarGroup {
  const items: (SidebarItem | SidebarGroup)[] = node.children
    .sort((a, b) => a.order - b.order)
    .map((child, i) => {
      if (child.href) {
        // Leaf - SidebarItem with auto-generated num from order
        return {
          title: child.title,
          href: child.href,
          num: child.order ? String(child.order).padStart(3, '0') : undefined,
        } as SidebarItem;
      } else {
        // Branch - nested SidebarGroup
        return convertTreeNode(child, i);
      }
    });

  // If node has href, it's actually an item at root level
  if (node.href) {
    return {
      items: [{
        title: node.title,
        href: node.href,
        num: node.order ? String(node.order).padStart(3, '0') : undefined,
      }],
    };
  }

  return {
    title: node.title,
    items,
  };
}

/**
 * Get flat sidebar items for simple single-level navigation
 */
export function getFlatSidebar(docs: CollectionEntry<'docs'>[]): SidebarItem[] {
  const sorted = [...docs].sort((a, b) => (a.data.order || 0) - (b.data.order || 0));

  return sorted.map((doc) => ({
    title: doc.data.title,
    href: `/docs/${doc.id}`,
  }));
}

/**
 * Flatten a nested SidebarGroup into a flat list of BoardingPassRows.
 * Category headers become non-clickable rows; docs become link rows.
 */
export function flattenGroupForBoardingPass(
  group: SidebarGroup,
  docs: CollectionEntry<'docs'>[],
  level: number = 0
): BoardingPassRow[] {
  const rows: BoardingPassRow[] = [];

  for (const item of group.items) {
    if ('href' in item) {
      const doc = docs.find((d) => `/docs/${d.id}` === item.href);
      rows.push({
        type: 'doc',
        level,
        title: item.title,
        href: item.href,
        description: doc?.data.description,
        num: item.num,
      });
    } else {
      rows.push({
        type: 'category',
        level,
        title: item.title || '',
      });
      rows.push(...flattenGroupForBoardingPass(item, docs, level + 1));
    }
  }

  return rows;
}