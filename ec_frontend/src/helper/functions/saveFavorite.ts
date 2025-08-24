import * as Sentry from "@sentry/react";
import axios from "axios";
import { environment } from "../../environment/environment";
import { toast } from "react-toastify";
import { toastMessages } from "../messages/toastMessages";
import {
  CurrentChapterSchema,
  type CurrentChapter,
} from "../../schemas/currentChapter.schema";

export default async function saveFavorite(
  id: number | null,
  userContentId: number | null,
  setCurrentChapter: (data: CurrentChapter) => void,
  isFavorite?: boolean
): Promise<void> {
  if (!id || !userContentId) {
    toast.error(toastMessages.saveFavoriteAndNotes.error, {
      autoClose: 3000,
    });
    return;
  }
  try {
    const data = {
      isFavorite: isFavorite ?? undefined,
    };

    console.log("DATA: ", data);
    const response = await axios.patch(
      `${environment.backendApiUrl}/user/contents/favorite-notes/${userContentId}`,
      data,
      { withCredentials: true }
    );

    const parsedResponse = CurrentChapterSchema.safeParse(response.data.data);
    console.log("RESPONSE: ", response);
    console.log("PARSE: ", parsedResponse.data);

    if (parsedResponse.success) {
      setCurrentChapter(parsedResponse.data);
      return;
    }

    Sentry.captureException(parsedResponse.error, {
      extra: {
        context: "helper/saveFavoriteAndNotes.ts",
        action: "saveFavoriteAndNotes",
        zodParseError: parsedResponse?.error?.issues,
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        context: "helper/saveFavoriteAndNotes.ts",
        action: "saveFavoriteAndNotes",
        error,
      },
    });
  }
}
