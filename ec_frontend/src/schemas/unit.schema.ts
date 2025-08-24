import * as z from "zod";
import { UnitProgressSchema } from "./unitProgress.schema";
import { ContentSchema } from "./content.schema";

export const UnitSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  imageUrl: z.url(),
  chapterId: z.uuid(),
  order: z.number(),
  contents: z.array(ContentSchema),
  unitProgress: UnitProgressSchema,
});

export type Unit = z.infer<typeof UnitSchema>;
