import * as z from 'zod';
import { UserSchema } from './user.schema';

export const LoggedUserSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
});

export type LoggedUser = z.infer<typeof LoggedUserSchema>;
