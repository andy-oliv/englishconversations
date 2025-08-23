import * as z from "zod";

export const CurrentContentSchema = z.object({
  id: z.number(),
  contentId: z.string(),
  userContentId: z.number(),
  type: z.enum(["VIDEO", "SLIDESHOW", "QUIZ", "TEST"]),
  title: z.string(),
  description: z.string(),
  isFavorite: z.boolean().nullable(),
  notes: z.string().nullable(),
  isComplete: z.boolean(),
});

export type CurrentContent = z.infer<typeof CurrentContentSchema>;
