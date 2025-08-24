import axios from "axios";
import type CompletedContentData from "../types/completedContentData";
import { environment } from "../../environment/environment";
import * as Sentry from "@sentry/react";
import { toastMessages } from "../messages/toastMessages";
import { toast } from "react-toastify";
import {
  CurrentChapterSchema,
  type CurrentChapter,
} from "../../schemas/currentChapter.schema";

export default async function completeContent(
  id: number | null,
  userContentId: number | null,
  setCurrentChapter: (data: CurrentChapter) => void,
  data?: CompletedContentData
): Promise<void> {
  if (!userContentId || !id) {
    toast.error(toastMessages.completeContent.error, { autoClose: 3000 });
    return;
  }
  try {
    const response = await axios.patch(
      `${environment.backendApiUrl}/user/contents/complete/${userContentId}`,
      data,
      { withCredentials: true }
    );
    const parsedResponse = CurrentChapterSchema.safeParse(response.data.data);

    if (parsedResponse.success) {
      setCurrentChapter(parsedResponse.data);
    }

    Sentry.captureException(parsedResponse.error, {
      extra: {
        context: "helper/completeContent.ts",
        action: "completeContent",
        zodParseError: parsedResponse?.error?.issues,
      },
    });
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        context: "helper/completeContent.ts",
        action: "completeContent",
        error,
      },
    });
  }
}
