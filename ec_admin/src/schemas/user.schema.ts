import * as z from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.optional(z.string()).nullable(),
  birthdate: z.optional(z.string()).nullable(),
  city: z.optional(z.string()).nullable(),
  state: z.optional(z.string()).nullable(),
  country: z.optional(z.string()).nullable(),
  avatarUrl: z.url(),
  languageLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1']),
  email: z.email(),
  role: z.enum(['ADMIN', 'STUDENT']),
  lastLogin: z.optional(z.string()).nullable(),
  chapters: z
    .optional(
      z.array(
        z.object({ status: z.enum(['COMPLETED', 'IN_PROGRESS', 'LOCKED']) }),
      ),
    )
    .nullable(),
});

export type User = z.infer<typeof UserSchema>;
