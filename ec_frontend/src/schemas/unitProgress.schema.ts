import * as z from "zod";

export const UnitProgressSchema = z.object({
  id: z.uuid(),
  progress: z.number(),
  status: z.enum(["LOCKED", "IN_PROGRESS", "COMPLETED"]),
});

export type UnitProgress = z.infer<typeof UnitProgressSchema>;
