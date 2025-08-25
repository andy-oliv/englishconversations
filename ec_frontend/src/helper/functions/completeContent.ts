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
import type { Unit } from "../../schemas/unit.schema";

export default async function completeContent(
  id: number | null,
  userContentId: number | null,
  setCurrentChapter: (data: CurrentChapter) => void,
  getCurrentUnit: () => Unit | null,
  setCurrentUnitId: (unitId: number) => void,
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
      const currentUnit: Unit | null = getCurrentUnit();

      if (currentUnit && currentUnit.unitProgress.status === "COMPLETED") {
        const nextUnit: Unit | undefined = parsedResponse.data.units.find(
          (unit) => unit.unitProgress.status === "IN_PROGRESS"
        );

        if (nextUnit) {
          setCurrentUnitId(nextUnit.id);
        }
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
