import { z } from 'astro:content';

/**
 * Default schema for the docs content collection.
 * Import this into your own content.config.ts to use the theme's expected frontmatter fields.
 */
export const docsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.date().optional(),
  order: z.number().optional(),
});

export type DocsCollection = z.infer<typeof docsSchema>;
