
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  source: string;
  image: string;
  featured?: boolean;
  originalLink?: string;
  videoUrl?: string;
  governorate?: string;
  tags?: string[];
  readingTime?: number;
  isTranslated?: boolean;
  originalSource?: string;
}
