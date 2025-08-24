import * as z from "zod";

export const VideoSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  url: z.url(),
  duration: z.int(),
  thumbnailUrl: z.url(),
  feedback: z.number(),
});

export type Video = z.infer<typeof VideoSchema>;
