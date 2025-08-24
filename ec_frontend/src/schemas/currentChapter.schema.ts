import * as z from "zod";
import { UnitSchema } from "./unit.schema";

export const CurrentChapterSchema = z.object({
  id: z.uuid(),
  chapterId: z.uuid(),
  userId: z.uuid(),
  progress: z.number(),
  status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
  units: z.array(UnitSchema),
});

export type CurrentChapter = z.infer<typeof CurrentChapterSchema>;
