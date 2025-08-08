import * as z from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  bio: z.string().nullable(),
  birthdate: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  avatarUrl: z.url(),
  languageLevel: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  email: z.email(),
  role: z.enum(["STUDENT", "ADMIN"]),
  lastLogin: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserSchemas = z.array(UserSchema);
