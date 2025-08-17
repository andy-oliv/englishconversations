import * as z from "zod";

export const UserProgressSchema = z.object({
  chapterProgress: z.array(
    z.object({
      chapter: z.object({
        id: z.uuid(),
        name: z.string(),
        description: z.string(),
      }),
      id: z.uuid(),
      progress: z.number(),
      status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
    })
  ),
  currentChapter: z.object({
    chapter: z.object({
      name: z.string(),
      description: z.string(),
      imageUrl: z.url(),
      units: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          imageUrl: z.url(),
          contents: z.array(
            z.object({
              id: z.number,
              contentType: z.enum(["SLIDESHOW", "VIDEO", "QUIZ"]),
              slideshow: z
                .object({
                  title: z.string,
                  description: z.string,
                })
                .nullable(),
              videos: z
                .object({
                  title: z.string,
                  description: z.string,
                })
                .nullable(),
              quiz: z
                .object({
                  title: z.string,
                  description: z.string,
                  isTest: z.boolean(),
                })
                .nullable(),
            })
          ),
        })
      ),
    }),
  }),
  totalChapters: z.number(),
  totalCompletedChapters: z.number(),
  totalCompletedTests: z.number(),
  totalCompletedUnits: z.number(),
  totalTests: z.number(),
  totalUnits: z.number(),
  unitProgress: z.array(
    z.object({
      status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
      id: z.uuid(),
      unit: z.object({
        id: z.number(),
        description: z.string(),
        name: z.string(),
      }),
      progress: z.number(),
    })
  ),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;
