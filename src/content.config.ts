import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { blogSchema, projectSchema } from "./content/_schemas";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: blogSchema,
});

const project = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/project" }),
  schema: projectSchema,
});

export const collections = {
  blog,
  project,
};
