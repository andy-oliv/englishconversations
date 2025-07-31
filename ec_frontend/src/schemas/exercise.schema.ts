import * as z from "zod";

export const ExerciseSchema = z.object({
  id: z.number(),
  type: z.enum([
    "FILL_IN_THE_BLANKS",
    "MULTIPLE_CHOICE_QUESTION",
    "CORRECT_OR_INCORRECT",
    "MATCH_THE_COLUMNS",
    "UNSCRAMBLE_WORD",
    "UNSCRAMBLE_SENTENCE",
    "LISTENING_COMPREHENSION",
    "PICTIONARY",
    "FREE_ANSWER_QUESTION",
    "TRANSLATION",
    "SPEAKING_EXERCISE",
    "VIDEO_QUESTION",
  ]),
  description: z.string(),
  columnA: z.nullable(z.array(z.string())).optional(),
  columnB: z.nullable(z.array(z.string())).optional(),
  contentUrl: z.nullable(z.url()).optional(),
  level: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  options: z.nullable(z.array(z.string())).optional(),
  correctAnswer: z.array(z.string()),
  quizId: z.uuid(),
});

export type Exercise = z.infer<typeof ExerciseSchema>;

export const ExerciseSchemas = z.array(ExerciseSchema);
