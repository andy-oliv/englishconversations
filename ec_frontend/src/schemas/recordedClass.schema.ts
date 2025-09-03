import * as z from "zod";

export const RecordedClassSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  recordedClassId: z.uuid(),
  recording: z.object({
    id: z.uuid(),
    title: z.string(),
    url: z.url(),
    thumbnailUrl: z.url(),
    recordedAt: z.string(),
    subject: z.object({
      id: z.number(),
      title: z.string(),
    }),
    materials: z.array(
      z.object({
        material: z.object({
          id: z.uuid(),
          type: z.enum(["IMAGE", "PDF", "SLIDESHOW", "AUDIO", "OTHER"]),
          title: z.string(),
          url: z.url(),
        }),
      })
    ),
  }),
});

export type RecordedClass = z.infer<typeof RecordedClassSchema>;

export const RecordedClassSchemas = z.array(RecordedClassSchema);
