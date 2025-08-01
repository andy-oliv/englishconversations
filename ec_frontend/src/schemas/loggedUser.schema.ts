import * as z from "zod";
import { UserSchema } from "./user.schema";

export const LoggedUserSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  role: true,
});

export type LoggedUser = z.infer<typeof LoggedUserSchema>;
