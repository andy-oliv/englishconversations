import { useEffect, useState, type ReactElement } from "react";
import styles from "./styles/Notifications.module.scss";
import { io, Socket } from "socket.io-client";
import { environment } from "../../environment/environment";
import { useNotificationStore } from "../../stores/notificationStore";
import {
  NotificationSchemas,
  type Notification,
} from "../../schemas/notification.schema";
import axios from "axios";
import type { User } from "../../schemas/user.schema";
import { useUserStore } from "../../stores/userStore";
import dayjs from "dayjs";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router-dom";

export default function Notifications(): ReactElement {
  async function handleToContentClick(
    url: string,
    notificationId: string
  ): Promise<void> {
    await handleSetIsRead(notificationId);
    navigate(`${url}`);
  }

  async function handleSetIsRead(notificationId: string): Promise<void> {
    setIsRead(notificationId);

    try {
      await axios.patch(
        `${environment.backendApiUrl}/users/notifications/update?userId=${user?.id}&id=${notificationId}`,
        { isRead: true, readAt: dayjs() },
        { withCredentials: true }
      );
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          context: "Notifications",
          action: "handleSetIsRead",
          error,
        },
      });
    }
  }

  async function handleSetAllRead(): Promise<void> {
    setAllRead();

    try {
      const response = await axios.patch(
        `${environment.backendApiUrl}/users/notifications/update/all`,
        {
          userId: user?.id,
          notificationIds: notifications.map((notification) => notification.id),
        },
        { withCredentials: true }
      );

      console.log(response);
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          context: "Notifications",
          action: "handleSetIsRead",
          error,
        },
      });
    }
  }

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const setAllRead = useNotificationStore((state) => state.setAllRead);
  const setIsRead = useNotificationStore((state) => state.setIsRead);

  const notifications: Notification[] = useNotificationStore(
    (state) => state.notifications
  );
  const user: User | null = useUserStore((state) => state.data);
  const navigate = useNavigate();

  useEffect(() => {
    let socket: Socket;

    async function connectSocket(): Promise<void> {
      socket = io(`${environment.backendApiUrl}/notifications`, {
        withCredentials: true,
      });

      socket.on("privateNotification", (payload) => {
        addNotification(payload);
      });
    }

    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [addNotification]);

  useEffect(() => {
    async function fetchNotifications(): Promise<void> {
      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/users/notifications/query?userId=${user?.id}`,
          { withCredentials: true }
        );

        const parsedResponse = NotificationSchemas.safeParse(
          response.data.data
        );

        if (parsedResponse.success) {
          setNotifications(parsedResponse.data);
          return;
        }

        Sentry.captureException(parsedResponse.error, {
          extra: {
            context: "Notifications",
            action: "fetchNotifications",
            zodParsingError: parsedResponse.error.issues,
          },
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "Notifications",
            action: "fetchNotifications",
            error,
          },
        });
      }
    }

    fetchNotifications();
  }, [user?.id, setNotifications]);

  return (
    <>
      <div className={styles.notificationsContainer}>
        <div
          className={styles.icon}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-bell-icon lucide-bell"
          >
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </div>
        <div
          className={showMenu ? styles.showMenu : styles.hideMenu}
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <p
            className={`${styles.readAllBtn} ${notifications.every((notification) => notification.isRead) || notifications.length === 0 ? styles.inactiveBtn : null}`}
            onClick={() => handleSetAllRead()}
          >
            Marcar todas lidas{" "}
          </p>
          {notifications.length > 0
            ? notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationWrapper} ${notification.isRead ? styles.readWrapper : null}`}
                >
                  <h3 className={styles.notificationTitle}>
                    {notification.notification.title}
                  </h3>
                  <p className={styles.notificationContent}>
                    {notification.notification.content}
                  </p>
                  <div className={styles.btnWrapper}>
                    <button
                      className={`${styles.btn} ${notification.isRead ? styles.isRead : null}`}
                      onClick={() => handleSetIsRead(notification.id)}
                    >
                      {notification.isRead ? "Lida" : "Marcar como lida"}
                    </button>
                    <button
                      className={`${notification.notification.actionUrl ? styles.btn : styles.noUrl}`}
                      onClick={() =>
                        notification.notification.actionUrl
                          ? handleToContentClick(
                              notification.notification.actionUrl,
                              notification.id
                            )
                          : null
                      }
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))
            : null}
        </div>
        {notifications.length === 0 ||
        notifications.every((notification) => notification.isRead) ? null : (
          <div className={`${styles.counter}`}>
            <p className={styles.value}>
              {
                notifications.filter(
                  (notification) => notification.isRead != true
                ).length
              }
            </p>
          </div>
        )}
      </div>
    </>
  );
}
