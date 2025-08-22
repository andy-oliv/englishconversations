import * as z from "zod";
import { ContentSchema } from "./content.schema";

export const UnitProgressSchema = z.object({
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
  contents: z.array(ContentSchema),
});

export type UnitProgress = z.infer<typeof UnitProgressSchema>;

export const UnitProgressSchemas = z.array(UnitProgressSchema);
