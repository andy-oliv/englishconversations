import * as z from "zod";
import { ContentSchema } from "./content.schema";

export const CurrentUnitSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  unitNumber: z.number(),
  contents: z.array(ContentSchema),
});

export type CurrentUnit = z.infer<typeof CurrentUnitSchema>;
