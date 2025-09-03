import { useEffect, type ReactElement } from "react";
import styles from "./styles/RecordedClasses.module.scss";
import axios from "axios";
import { environment } from "../../environment/environment";
import type { User } from "../../schemas/user.schema";
import { useUserStore } from "../../stores/userStore";
import {
  RecordedClassSchemas,
  type RecordedClass,
} from "../../schemas/recordedClass.schema";
import { useRecordedClassStore } from "../../stores/recordedClassStore";
import dayjs from "dayjs";
import * as Sentry from "@sentry/react";
import "dayjs/locale/pt-br";
import { useNavigate } from "react-router-dom";

dayjs.locale("pt-br");

export default function RecordedClasses(): ReactElement {
  const navigate = useNavigate();
  const user: User | null = useUserStore((state) => state.data);
  const recordedClasses: RecordedClass[] | null = useRecordedClassStore(
    (state) => state.recordedClasses
  );
  const setRecordedClasses = useRecordedClassStore(
    (state) => state.setRecordedClasses
  );

  useEffect(() => {
    async function fetchClasses(): Promise<void> {
      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/classes/recordings/get-by?userId=${user?.id}`,
          { withCredentials: true }
        );

        const parsedResponse = RecordedClassSchemas.safeParse(
          response.data.data
        );

        if (parsedResponse.success) {
          setRecordedClasses(parsedResponse.data);
          return;
        }

        Sentry.captureException(parsedResponse.error, {
          extra: {
            context: "RecordedClasses",
            action: "fetchClasses",
            zodParsingError: parsedResponse.error.issues,
          },
        });
      } catch (error) {
        Sentry.captureException(error, {
          extra: {
            context: "RecordedClasses",
            action: "fetchClasses",
            error,
          },
        });
      }
    }

    fetchClasses();
  }, [user?.id, setRecordedClasses]);

  return (
    <>
      <div className={styles.screen}>
        <div className={styles.grid}>
          {recordedClasses && recordedClasses?.length > 0
            ? recordedClasses.map((recordedClass) => (
                <div
                  className={styles.classCard}
                  onClick={() =>
                    navigate(`/watch?id=${recordedClass.recording.id}`)
                  }
                >
                  <div className={styles.picture}>
                    <img
                      className={styles.thumbnail}
                      src={recordedClass.recording.thumbnailUrl}
                    />
                  </div>
                  <div className={styles.classInfo}>
                    <h3 className={styles.classTitle}>
                      {recordedClass.recording.title}
                    </h3>
                    <p className={styles.date}>
                      {dayjs(recordedClass.recording.recordedAt)
                        .add(1, "d")
                        .format("DD [de] MMMM [de] YYYY")}
                    </p>
                    <p className={styles.tag}>
                      {recordedClass.recording.subject.title}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
}
