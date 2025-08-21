import * as z from "zod";

export const ChapterProgressSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.url(),
  order: z.number(),
  chapterId: z.uuid(),
  unitProgress: z.object({
    id: z.uuid(),
    progress: z.number(),
    status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
  }),
  contents: z.array(
    z.object({
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
      }),
    })
  ),
});

export type ChapterProgress = z.infer<typeof ChapterProgressSchema>;

export const ChapterProgressSchemas = z.array(ChapterProgressSchema);
