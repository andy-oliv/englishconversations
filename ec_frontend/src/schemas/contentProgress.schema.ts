import * as z from "zod";

export const contentProgressSchema = z.object({
  id: z.number(),
  contentId: z.number(),
  progress: z.number(),
  status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
  isFavorite: z.boolean().nullable(),
  notes: z.string().nullable(),
});

export type ContentProgress = z.infer<typeof contentProgressSchema>;
