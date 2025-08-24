import axios from "axios";
import * as Sentry from "@sentry/react";
import { environment } from "../../environment/environment";

interface User {
  id?: string;
  email?: string;
  name?: string;
}

export async function logout(
  user: User | null,
  resetUser: () => void,
  navigate: (path: string) => void
): Promise<void> {
  try {
    await axios.get(`${environment.backendAuthUrl}/logout`, {
      withCredentials: true,
    });
    sessionStorage.removeItem("loggedUser");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userProgress");
    sessionStorage.removeItem("currentChapter");
    sessionStorage.removeItem("currentUnitId");
    sessionStorage.removeItem("currentContentId");

    resetUser();
    navigate("/login");
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        id: user?.id,
        userEmail: user?.email,
        userName: user?.name,
      },
    });
  }
}
