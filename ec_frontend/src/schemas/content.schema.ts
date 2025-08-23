import * as z from "zod";

export const ContentSchema = z.object({
  id: z.number(),
  contentType: z.enum(["VIDEO", "SLIDESHOW", "QUIZ", "TEST"]),
  order: z.number(),
  quiz: z
    .object({
      id: z.uuid(),
      isTest: z.boolean(),
      title: z.string(),
      description: z.string(),
    })
    .nullable(),
  video: z
    .object({
      id: z.uuid(),
      title: z.string(),
      description: z.string(),
    })
    .nullable(),
  slideshow: z
    .object({
      id: z.uuid(),
      title: z.string(),
      description: z.string(),
    })
    .nullable(),
  contentProgress: z.object({
    id: z.number(),
    contentId: z.number(),
    progress: z.number(),
    status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
    isFavorite: z.boolean().nullable(),
    notes: z.string().nullable(),
  }),
});

export type Content = z.infer<typeof ContentSchema>;

export const ContentSchemas = z.array(ContentSchema);
