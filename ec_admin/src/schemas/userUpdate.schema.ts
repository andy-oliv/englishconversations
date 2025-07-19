import { UserSchema } from './user.schema';
import * as z from 'zod';

export const UserUpdateSchema = UserSchema.pick({
  name: true,
  bio: true,
  birthdate: true,
  city: true,
  state: true,
  country: true,
  avatarUrl: true,
}).partial();

export type UserUpdate = z.infer<typeof UserSchema>;
