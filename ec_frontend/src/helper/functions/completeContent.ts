import axios from "axios";
import type CompletedContentData from "../types/completedContentData";
import { environment } from "../../environment/environment";
import * as Sentry from "@sentry/react";
import {
  UnitProgressSchemas,
  type UnitProgress,
} from "../../schemas/unitProgress.schema";
import { toastMessages } from "../messages/toastMessages";
import { toast } from "react-toastify";
import type { CurrentUnit } from "../../schemas/currentUnit.schema";
import type { CurrentContent } from "../../schemas/currentContent.schema";
import type { ContentType } from "../../components/contentCard/ContentCard.types";

export default async function completeContent(
  id: number | null,
  userContentId: number | null,
  setUnit: (data: CurrentUnit) => void,
  setCurrentContent: (data: CurrentContent) => void,
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
    const parsedResponse = UnitProgressSchemas.safeParse(
      response.data.data.units
    );

    if (parsedResponse.success) {
      sessionStorage.setItem(
        "unitProgresses",
        JSON.stringify(parsedResponse.data)
      );

      const currentUnit: UnitProgress = parsedResponse.data.find(
        (unit) => unit.unitProgress.status === "IN_PROGRESS"
      )!;
      setUnit({
        id: currentUnit.id,
        title: currentUnit.name,
        description: currentUnit.description,
        unitNumber: currentUnit.order,
        contents: currentUnit.contents,
      });
      sessionStorage.setItem("currentUnit", JSON.stringify(currentUnit));

      const currentContent = currentUnit.contents.find(
        (content) => content.id === id
      )!;

      const contentDetails: Record<
        ContentType,
        { id: string | null; title: string | null; description: string | null }
      > = {
        QUIZ: {
          id: currentContent.quiz?.id ?? null,
          title: currentContent.quiz?.title ?? null,
          description: currentContent.quiz?.description ?? null,
        },
        SLIDESHOW: {
          id: currentContent.slideshow?.id ?? null,
          title: currentContent.slideshow?.title ?? null,
          description: currentContent.slideshow?.description ?? null,
        },
        TEST: {
          id: currentContent.quiz?.id ?? null,
          title: currentContent.quiz?.title ?? null,
          description: currentContent.quiz?.description ?? null,
        },
        VIDEO: {
          id: currentContent.video?.id ?? null,
          title: currentContent.video?.title ?? null,
          description: currentContent.video?.description ?? null,
        },
      };

      const updatedCurrentContent: CurrentContent = {
        id,
        contentId: contentDetails[currentContent.contentType].id!,
        userContentId,
        type: currentContent.contentType,
        title: contentDetails[currentContent.contentType].title!,
        description: contentDetails[currentContent.contentType].description!,
        isFavorite: currentContent.contentProgress.isFavorite,
        notes: currentContent.contentProgress.notes,
        isComplete: currentContent.contentProgress.status === "COMPLETED",
      };
      setCurrentContent(updatedCurrentContent);
      sessionStorage.setItem(
        "currentContent",
        JSON.stringify(updatedCurrentContent)
      );
      return;
    }

    Sentry.captureException(parsedResponse.error, {
      extra: {
        context: "helper/completeContent.ts",
        action: "completeContent",
        zodParseError: parsedResponse.error.issues,
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
