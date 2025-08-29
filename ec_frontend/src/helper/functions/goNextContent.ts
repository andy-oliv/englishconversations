import type { Content } from "../../schemas/content.schema";
import type { CurrentChapter } from "../../schemas/currentChapter.schema";
import type { Unit } from "../../schemas/unit.schema";
import { toastMessages } from "../messages/toastMessages";

export default function goNextcontent(
  currentChapter: CurrentChapter,
  contentId: string | undefined,
  contentType: string,
  navigate: (url: string, additionalInfo: { replace: boolean }) => void,
  toast: {
    error: (message: string, additionalInfo: { autoClose: number }) => void;
  },
  Sentry: {
    captureException: (
      error: unknown,
      additionalInfo: {
        extra: { context: string; action: string; error: unknown };
      }
    ) => void;
  }
): void {
  const activeUnit: Unit | undefined = currentChapter?.units.find((unit) =>
    unit.contents.some((content) => {
      const ids = [content.video?.id, content.slideshow?.id, content.quiz?.id];
      return ids.includes(contentId ?? "");
    })
  );
  const activeContent: Content | undefined = activeUnit?.contents.find(
    (content) => {
      const allowedContents: Record<string, boolean> = {
        QUIZ: content?.quiz?.id === contentId,
        SLIDESHOW: content?.slideshow?.id === contentId,
        VIDEO: content?.video?.id === contentId,
        TEST: content?.quiz?.id === contentId,
      };

      return allowedContents[contentType];
    }
  );

  try {
    if (activeContent) {
      const currentContentIndex: number =
        activeUnit?.contents.indexOf(activeContent) ?? -1;

      const nextContent: Content | undefined =
        currentContentIndex >= 0
          ? activeUnit?.contents[currentContentIndex + 1]
          : undefined;

      if (nextContent) {
        const contentType: string = nextContent.contentType.toLowerCase();
        const allowedTypes: Record<
          string,
          { id: string | undefined; url: string } | undefined
        > = {
          video: {
            id: nextContent.video?.id,
            url: "/hub/video?id",
          },
          slideshow: {
            id: nextContent.slideshow?.id,
            url: "/hub/slideshow?id",
          },
          quiz: {
            id: nextContent.quiz?.id,
            url: "/quiz?id",
          },
          test: {
            id: nextContent.quiz?.id,
            url: "/quiz?id",
          },
        };
        navigate(
          `${allowedTypes[contentType]?.url}=${allowedTypes[contentType]?.id}`,
          {
            replace: true,
          }
        );

        return;
      }
    }

    if (activeUnit) {
      const currentUnitIndex: number =
        currentChapter?.units.indexOf(activeUnit) ?? -1;

      const nextUnit: Unit | undefined =
        currentUnitIndex >= 0
          ? currentChapter?.units[currentUnitIndex + 1]
          : undefined;

      if (nextUnit) {
        const firstContent: Content | undefined = nextUnit.contents[0];
        const contentType: string = firstContent.contentType.toLowerCase();
        const allowedTypes: Record<
          string,
          { id: string | undefined; url: string } | undefined
        > = {
          video: {
            id: firstContent.video?.id,
            url: "/hub/video?id",
          },
          slideshow: {
            id: firstContent.slideshow?.id,
            url: "/hub/slideshow?id",
          },
          quiz: {
            id: firstContent.quiz?.id,
            url: "/quiz?id",
          },
          test: {
            id: firstContent.quiz?.id,
            url: "/quiz?id",
          },
        };
        navigate(
          `${allowedTypes[contentType]?.url}=${allowedTypes[contentType]?.id}`,
          {
            replace: true,
          }
        );

        return;
      }
    }

    navigate("/", { replace: true });
  } catch (error) {
    toast.error(toastMessages.goNextContent.error, { autoClose: 3000 });

    Sentry.captureException(error, {
      extra: {
        context: "CompletedQuiz",
        action: "goNextContent",
        error,
      },
    });
  }
}
