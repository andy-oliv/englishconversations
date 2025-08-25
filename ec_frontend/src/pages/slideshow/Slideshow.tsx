import axios from "axios";
import { useEffect, useRef, useState, type ReactElement } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { environment } from "../../environment/environment";
import { useLocation } from "react-router-dom";
import {
  SlideshowSchema,
  type Slideshow,
} from "../../schemas/slideshow.schema";
import styles from "./styles/Slideshow.module.scss";
import { useCurrentChapterStore } from "../../stores/currentChapterStore";

export default function Slideshow(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const slideshowId = searchParams.get("id");
  const [slides, setSlides] = useState<Slideshow | null>(null);
  const currentContent = useCurrentChapterStore((state) =>
    state.getCurrentContent()
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(
    currentContent?.contentProgress?.isFavorite ?? false
  );
  const [notes, setNotes] = useState<string>(
    currentContent?.contentProgress.notes ?? ""
  );
  const [openNotes, setOpenNotes] = useState<boolean>(false);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    async function fetchSlideshow(): Promise<void> {
      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/slideshow/${slideshowId}`,
          { withCredentials: true }
        );

        const parsedResponse = SlideshowSchema.safeParse(response.data.data);
        if (parsedResponse.success) {
          setSlides(parsedResponse.data);
          return;
        }

        console.log(parsedResponse.error.issues);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSlideshow();
  }, [slideshowId]);

  return (
    <>
      <div>
        <div className={styles.sliderWrapper}>
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
            navigation
            pagination={{ clickable: true }}
          >
            {slides?.slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <img className={styles.slideImg} src={slide.url} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.info}>
          <div className={styles.videoTitleWrapper}>
            <h2 className={styles.videoTitle}>
              {currentContent?.video?.title}
            </h2>
            <div className={styles.icons}>
              <div className={styles.icon} onClick={() => saveFavorites()}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={34}
                  height={34}
                  viewBox="0 0 24 24"
                  fill={isFavorite ? "#000000" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bookmark-icon lucide-bookmark"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              </div>
              <div className={styles.notesContainer}>
                <div
                  className={`${styles.notesWrapper} ${openNotes ? styles.showNotes : ""}`}
                >
                  <h2 className={styles.notesTitle}>Anotações</h2>
                  <textarea
                    className={styles.noteInput}
                    rows={9}
                    cols={40}
                    ref={notesRef}
                    id="text"
                    defaultValue={currentContent?.contentProgress.notes ?? ""}
                  ></textarea>
                  <button className={styles.saveBtn} onClick={() => saveNote()}>
                    Salvar
                  </button>
                </div>
                <div
                  className={styles.icon}
                  onClick={() => setOpenNotes(!openNotes)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={34}
                    height={34}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-notebook-pen-icon lucide-notebook-pen"
                  >
                    <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                    <path d="M2 6h4" />
                    <path d="M2 10h4" />
                    <path d="M2 14h4" />
                    <path d="M2 18h4" />
                    <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <h3 className={styles.videoDescription}>
            {currentContent?.video?.description}
          </h3>
          <button
            className={`${styles.btn} ${saving ? styles.saving : ""} ${currentContent?.contentProgress?.status === "COMPLETED" ? styles.completeContent : ""}`}
            onClick={() => complete()}
          >
            {currentContent?.contentProgress.status === "COMPLETED"
              ? "Concluído"
              : saving
                ? "Concluindo..."
                : "Marcar como concluído"}
          </button>
        </div>
      </div>
    </>
  );
}
