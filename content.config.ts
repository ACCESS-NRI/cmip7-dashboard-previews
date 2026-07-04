import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: "**/*.md",
      // `title` and `description` are part of the built-in page schema; declare
      // the extra frontmatter CMIP7 updates use so it is typed on the items.
      schema: z.object({
        date: z.string().optional(),
        author: z.string().optional(),
        // Tags an explainer post to a CMIP7 experiment by name; the dashboard
        // surfaces it as that experiment's Overview-level content. Tagged
        // posts still appear in the /blog feed like any other post.
        experiment: z.string().optional(),
        // Optional outbound links (WCRP/CMIP papers, press releases,
        // explainers) rendered as a "Further reading" list.
        furtherReading: z
          .array(z.object({ title: z.string(), url: z.string() }))
          .optional(),
      }),
    }),
  },
});
