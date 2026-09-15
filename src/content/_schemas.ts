import { z } from "astro/zod";

export const blogSchema = z
  .object({
    author: z.string().optional(),
    pubDatetime: z.date(),
    title: z.string(),
    postSlug: z.string().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).default(["others"]),
    ogImage: z.string().optional(),
    description: z.string(),
  })
  .strict();

export const projectSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    website: z.string().optional(),
    icon: z.string().optional(),
    platforms: z.array(z.enum(["iOS", "Android", "Web"])).default([]),
    appStore: z.string().optional(),
    playStore: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
  })
  .strict();

export type BlogFrontmatter = z.infer<typeof blogSchema>;
export type ProjectFrontmatter = z.infer<typeof projectSchema>;
