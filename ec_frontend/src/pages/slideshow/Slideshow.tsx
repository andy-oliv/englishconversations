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

export default function Slideshow(): ReactElement {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const slideshowId = searchParams.get("id");
  const [slides, setSlides] = useState<Slideshow | null>(null);
  const currentContent = useCurrentChapterStore((state) =>
    state.getCurrentContent()
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
        <div>
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
            key={currentContent?.id}
            content={currentContent}
            contentType={currentContent?.contentType ?? "VIDEO"}
          />
        </div>
      )}
    </>
  );
}
