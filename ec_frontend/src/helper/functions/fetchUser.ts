import axios from "axios";
import { UserSchema } from "../../schemas/user.schema";
import { useUserStore } from "../../stores/userStore";
import * as Sentry from "@sentry/react";

export async function fetchUser(id: string): Promise<void> {
  try {
    const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
      withCredentials: true,
    });

    const parsedResponse = UserSchema.safeParse(response.data.data);

    if (parsedResponse.success) {
      useUserStore.getState().setUser(parsedResponse.data);
      return;
    }

    Sentry.captureException(parsedResponse.error.message, {
      extra: {
        context: "helper/functions/fetchUser",
        action: "fetchUser",
        zodParseIssues: parsedResponse.error.issues,
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        context: "helper/functions/fetchUser",
        action: "fetchUser",
        error,
      },
    });
  }
}
