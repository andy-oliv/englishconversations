import * as z from "zod";

export const SlideshowSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  slides: z.array(
    z.object({
      id: z.uuid(),
      title: z.string(),
      description: z.string(),
      type: z.enum(["VIDEO", "IMAGE"]),
      url: z.url(),
      order: z.number(),
    })
  ),
});

export type Slideshow = z.infer<typeof SlideshowSchema>;
