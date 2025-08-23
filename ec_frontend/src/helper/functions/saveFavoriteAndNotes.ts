import * as Sentry from "@sentry/react";
import axios from "axios";
import { environment } from "../../environment/environment";
import { toast } from "react-toastify";
import { toastMessages } from "../messages/toastMessages";

export default async function saveFavoriteAndNotes(
  userContentId: number | null,
  isFavorite: boolean,
  notes: string,
  setIsFavorite: (data: boolean) => void,
  setNotes: (data: string) => void
): Promise<void> {
  if (!userContentId) {
    toast.error(toastMessages.saveFavoriteAndNotes.error, {
      autoClose: 3000,
    });
  }
  try {
    const response = await axios.patch(
      `${environment.backendApiUrl}/user/contents/favorite-notes/${userContentId}`,
      { isFavorite: isFavorite, notes: notes === "" ? null : notes },
      { withCredentials: true }
    );

    setIsFavorite(response.data.data.isFavorite);
    setNotes(response.data.data.notes);
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
