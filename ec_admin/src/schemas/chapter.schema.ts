import * as z from 'zod';

export const ChapterSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  file: z.object({
    url: z.url(),
  }),
  units: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
    }),
  ),
});

export const ChaptersSchema = z.array(ChapterSchema);
export type Chapter = z.infer<typeof ChapterSchema>;
