import * as z from "zod";

export const UserEditSchema = z.object({
  name: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  birthdate: z.string().optional().nullable(),
});

export type UserEdit = z.infer<typeof UserEditSchema>;
