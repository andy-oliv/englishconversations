import { LoginSchema } from "./login.schema";
import * as z from "zod";

export const ChangePasswordSchema = LoginSchema.pick({
  email: true,
  password: true,
});

export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
