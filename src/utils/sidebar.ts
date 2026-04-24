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

export interface ReceiptLine {
  type: 'item' | 'category' | 'divider';
  title?: string;
  href?: string;
  num?: string;
  description?: string;
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

  // Build global num map from sorted docs (3-digit zero-padded)
  const numMap = new Map<string, string>();
  sorted.forEach((doc, i) => {
    numMap.set(`/docs/${doc.id}`, String(i + 1).padStart(3, '0'));
  });

  // Convert tree to SidebarGroup format
  const groups: SidebarGroup[] = root.children
    .filter(c => c.children.length > 0 || c.href)
    .sort((a, b) => a.order - b.order)
    .map(node => convertTreeNode(node, numMap));

  return { groups };
}

function convertTreeNode(node: TreeNode, numMap: Map<string, string>): SidebarGroup {
  const items: (SidebarItem | SidebarGroup)[] = node.children
    .sort((a, b) => a.order - b.order)
    .map((child) => {
      if (child.href) {
        // Leaf - SidebarItem with auto num
        return {
          title: child.title,
          href: child.href,
          num: numMap.get(child.href),
        } as SidebarItem;
      } else {
        // Branch - nested SidebarGroup
        return convertTreeNode(child, numMap);
      }
    });

  // If node has href, it's actually an item at root level
  if (node.href) {
    return {
      items: [{
        title: node.title,
        href: node.href,
        num: numMap.get(node.href),
      }],
    };
  }

  return {
    title: node.title,
    items,
  };
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
 * Flatten a SidebarGroup into receipt-typed lines.
 * Nested groups become category headers + item rows + dividers.
 */
export function flattenGroupToReceipt(
  group: SidebarGroup,
  docs: CollectionEntry<'docs'>[]
): ReceiptLine[] {
  const lines: ReceiptLine[] = [];

  // Collect nested groups first to know which is last
  const nestedGroups: SidebarGroup[] = [];
  const flatItems: SidebarItem[] = [];

  for (const item of group.items) {
    if ('href' in item) {
      flatItems.push(item);
    } else {
      nestedGroups.push(item);
    }
  }

  // Flat items first (if any)
  for (const item of flatItems) {
    const doc = docs.find((d) => `/docs/${d.id}` === item.href);
    lines.push({
      type: 'item',
      title: item.title,
      href: item.href,
      num: item.num,
      description: doc?.data.description,
    });
  }

  // Nested groups with lighter visual separation
  for (let i = 0; i < nestedGroups.length; i++) {
    const nested = nestedGroups[i];
    const isLast = i === nestedGroups.length - 1;

    lines.push({
      type: 'category',
      title: nested.title || '',
    });

    for (const child of nested.items) {
      if ('href' in child) {
        const doc = docs.find((d) => `/docs/${d.id}` === child.href);
        lines.push({
          type: 'item',
          title: child.title,
          href: child.href,
          num: child.num,
          description: doc?.data.description,
        });
      } else {
        const subDoc = findFirstDoc(child);
        if (subDoc) {
          const doc = docs.find((d) => `/docs/${d.id}` === subDoc.href);
          lines.push({
            type: 'item',
            title: subDoc.title,
            href: subDoc.href,
            description: doc?.data.description,
            num: subDoc.num,
          });
        }
      }
    }

    // Only add divider between nested groups, not after the last one
    if (!isLast) {
      lines.push({ type: 'divider' });
    }
  }

  return lines;
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