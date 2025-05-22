
import { Article as BaseArticle } from "../context/ArticleContext";

// تعريف نوع Article الموسع
declare module "../context/ArticleContext" {
  interface Article extends BaseArticle {
    url?: string;
  }
}
