import * as z from 'zod';

export const NotificationSchema = z.object({
  id: z.int(),
  title: z.string(),
  content: z.string(),
  actionUrl: z.optional(z.url()),
});

export type Notification = z.infer<typeof NotificationSchema>;
