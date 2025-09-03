import * as z from "zod";

export const NotificationSchema = z.object({
  id: z.uuid(),
  notificationId: z.number(),
  userId: z.uuid(),
  readAt: z.string().nullable(),
  isRead: z.boolean().nullable(),
  deliveredAt: z.string(),
  deliveredViaApp: z.boolean().nullable(),
  deliveredViaEmail: z.boolean().nullable(),
  notification: z.object({
    actionUrl: z.string().nullable(),
    title: z.string(),
    content: z.string(),
  }),
});

export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationSchemas = z.array(NotificationSchema);
