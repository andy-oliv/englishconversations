import * as z from "zod";
import { LoginSchema } from "./login.schema";

export const ChangeEmailSchema = LoginSchema.pick({
  email: true,
});

export type ChangeEmail = z.infer<typeof ChangeEmailSchema>;
