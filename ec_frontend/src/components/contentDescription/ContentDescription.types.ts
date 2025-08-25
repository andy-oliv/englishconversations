import type { Content } from "../../schemas/content.schema";
import type { ContentType } from "../contentCard/ContentCard.types";

export default interface ContentDescriptionProps {
  content: Content | null;
  contentType: ContentType;
  videoDuration?: number;
}
