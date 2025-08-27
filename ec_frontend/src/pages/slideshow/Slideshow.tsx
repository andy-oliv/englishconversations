import axios from "axios";
import { useEffect, useState, type ReactElement } from "react";
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
import ContentDescription from "../../components/contentDescription/ContentDescription";
import type { Unit } from "../../schemas/unit.schema";
import type { Content } from "../../schemas/content.schema";
import type { CurrentChapter } from "../../schemas/currentChapter.schema";

export default function Slideshow(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const slideshowId = searchParams.get("id");
  const [slides, setSlides] = useState<Slideshow | null>(null);
  const currentChapter: CurrentChapter | null = useCurrentChapterStore(
    (state) => state.data
  );
  const currentContent = useCurrentChapterStore((state) =>
    state.getCurrentContent()
  );
  const activeUnit: Unit | undefined = currentChapter?.units.find((unit) =>
    unit.contents.some((content) => {
      const ids = [content.video?.id, content.slideshow?.id, content.quiz?.id];
      return ids.includes(slideshowId ?? "");
    })
  );
  const activeContent: Content | undefined = activeUnit?.contents.find(
    (content) => content?.video?.id === slideshowId
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchSlideshow(): Promise<void> {
      setLoading(true);
      try {
        const response = await axios.get(
          `${environment.backendApiUrl}/slideshow/${slideshowId}`,
          { withCredentials: true }
        );

        const parsedResponse = SlideshowSchema.safeParse(response.data.data);
        if (parsedResponse.success) {
          setSlides(parsedResponse.data);
          setLoading(false);
          return;
        }

        console.log(parsedResponse.error.issues);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchSlideshow();
  }, [slideshowId]);

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <div className={styles.slideshowLoader}></div>
          <div className={styles.infoLoaderWrapper}>
            <div className={styles.infoLoader}></div>
            <div className={styles.infoLoader}></div>
            <div className={styles.infoLoader}></div>
          </div>
        </div>
      ) : (
        <div className={styles.slideshowContainer}>
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
          <ContentDescription
            key={activeContent?.id}
            content={activeContent ? activeContent : currentContent}
            contentType={"SLIDESHOW"}
          />
        </div>
      )}
    </>
  );
}
