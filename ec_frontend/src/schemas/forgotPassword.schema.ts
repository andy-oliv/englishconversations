import * as z from "zod";
import { LoginSchema } from "./login.schema";

export const ForgotPasswordSchema = LoginSchema.pick({
  email: true,
});

export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;
