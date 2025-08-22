import * as z from "zod";
import { ExerciseSchema } from "./exercise.schema";

export const QuizContentSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  imageUrl: z.url().nullable(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  isTest: z.boolean(),
  exercises: z.array(ExerciseSchema),
});

export type QuizContent = z.infer<typeof QuizContentSchema>;
