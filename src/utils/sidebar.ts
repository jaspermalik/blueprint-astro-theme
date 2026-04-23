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
  type: 'route' | 'doc' | 'divider';
  title?: string;
  href?: string;
  description?: string;
  num?: string;
  origin?: string;
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
 * Find the first doc item in a nested group (for route zone destination).
 */
function findFirstDoc(group: SidebarGroup): SidebarItem | undefined {
  for (const item of group.items) {
    if ('href' in item) {
      return item;
    } else {
      const found = findFirstDoc(item);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Flatten a SidebarGroup into zone-typed BoardingPassRows.
 * Nested groups become route zones + doc rows + dividers.
 */
export function flattenGroupToZones(
  group: SidebarGroup,
  docs: CollectionEntry<'docs'>[]
): BoardingPassRow[] {
  const rows: BoardingPassRow[] = [];

  for (const item of group.items) {
    if ('href' in item) {
      // Leaf doc → info grid row
      const doc = docs.find((d) => `/docs/${d.id}` === item.href);
      rows.push({
        type: 'doc',
        title: item.title,
        href: item.href,
        description: doc?.data.description,
        num: item.num,
      });
    } else {
      // Nested group → route zone + its children
      const firstDoc = findFirstDoc(item);
      rows.push({
        type: 'route',
        origin: item.title || '',
        title: firstDoc?.title || '',
        href: firstDoc?.href,
      });

      // Add children as doc rows
      for (const child of item.items) {
        if ('href' in child) {
          const doc = docs.find((d) => `/docs/${d.id}` === child.href);
          rows.push({
            type: 'doc',
            title: child.title,
            href: child.href,
            description: doc?.data.description,
            num: child.num,
          });
        } else {
          // Deep nesting: recursively flatten sub-groups as more doc rows
          const subDoc = findFirstDoc(child);
          if (subDoc) {
            const doc = docs.find((d) => `/docs/${d.id}` === subDoc.href);
            rows.push({
              type: 'doc',
              title: subDoc.title,
              href: subDoc.href,
              description: doc?.data.description,
              num: subDoc.num,
            });
          }
        }
      }

      rows.push({ type: 'divider' });
    }
  }

  return rows;
}