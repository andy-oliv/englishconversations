import axios from "axios";
import type CompletedContentData from "../types/completedContentData";
import { environment } from "../../environment/environment";
import * as Sentry from "@sentry/react";
import { toastMessages } from "../messages/toastMessages";
import { toast } from "react-toastify";
import { CurrentChapterSchema } from "../../schemas/currentChapter.schema";
import type { Unit } from "../../schemas/unit.schema";
import goNextcontent from "./goNextContent";
import type { CurrentChapterStoreState } from "../../stores/currentChapterStore";

export default async function completeContent(
  id: number | null,
  userContentId: number | null,
  contentId: string | undefined,
  contentType: string,
  navigate: (url: string, additionalInfo: { replace: boolean }) => void,
  currentChapter: CurrentChapterStoreState,
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
      currentChapter.setCurrentChapter(parsedResponse.data);
      const currentUnit: Unit | null = currentChapter.getCurrentUnit();

      if (currentUnit && currentUnit.unitProgress.status === "COMPLETED") {
        const nextUnit: Unit | undefined = parsedResponse.data.units.find(
          (unit) => unit.unitProgress.status === "IN_PROGRESS"
        );

        if (nextUnit) {
          currentChapter.setCurrentUnitId(nextUnit.id);
        }
      }

      if (currentChapter.data) {
        goNextcontent(
          currentChapter.data,
          contentId,
          contentType,
          navigate,
          toast,
          Sentry
        );
      }

      return;
    }

    toast.error(toastMessages.completeContent.zodParsing, {
      autoClose: 3000,
    });

    Sentry.captureException(parsedResponse.error, {
      extra: {
        context: "helper/completeContent.ts",
        action: "completeContent",
        zodParseError: parsedResponse?.error?.issues,
      },
    });
  } catch (error) {
    toast.error(toastMessages.completeContent.error, {
      autoClose: 3000,
    });

    Sentry.captureException(error, {
      extra: {
        context: "helper/completeContent.ts",
        action: "completeContent",
        error,
      },
    });
  }
}
