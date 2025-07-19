import * as z from 'zod';
import { UserSchema } from './user.schema';
import { NotificationSchema } from './notification.schema';

export const DashboardSchema = z.object({
  monthlyLogins: z.array(
    z.object({ loginDate: z.string(), logins: z.number() }),
  ),
  latestLogins: z.array(UserSchema.pick({ name: true, lastLogin: true })),
  userProgresses: z.array(
    UserSchema.pick({ id: true, name: true, chapters: true }),
  ),
  totalStudents: z.number(),
  totalChapters: z.number(),
  totalUnits: z.number(),
  totalVideos: z.number(),
  totalExercises: z.number(),
  notifications: z.array(
    NotificationSchema.pick({ id: true, title: true, content: true }),
  ),
});

export type Dashboard = z.infer<typeof DashboardSchema>;
