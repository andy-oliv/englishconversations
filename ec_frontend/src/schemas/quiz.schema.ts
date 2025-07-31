import * as z from "zod";

export const QuizSchema = z.object({
  id: z.uuid(),
  isTest: z.boolean(),
  title: z.string(),
  description: z.string(),
  fileId: z.nullable(z.uuid()).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  unitId: z.nullable(z.number()).optional(),
});

export type Quiz = z.infer<typeof QuizSchema>;

export const QuizSchemas = z.array(QuizSchema);
