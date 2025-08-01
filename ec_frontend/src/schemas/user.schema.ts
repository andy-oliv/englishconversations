import * as z from "zod";

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  bio: z.string(),
  birthdate: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  avatarUrl: z.url(),
  languageLevel: z.enum(["A1", "A2", "B1", "B2", "C1"]),
  email: z.email(),
  role: z.enum(["STUDENT", "ADMIN"]),
  lastLogin: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserSchemas = z.array(UserSchema);
