import { Link } from "react-router-dom";
import { Article } from "../../context/ArticleContext";
import { Play, Clock, Flame, ExternalLink, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect } from "react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  detailUrl: string;
}

const ArticleCard = ({ article, featured = false, detailUrl }: ArticleCardProps) => {
  const { title, excerpt, image, category, date, videoUrl, source, isTranslated, readingTime } = article;
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgInView, setImgInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImgInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // تنظيف العنوان من العبارات غير المرغوب فيها
  const cleanTitle = (title: string): string => {
    return title
      // إزالة التواريخ والأوقات
      .replace(/\d{1,2}‏\/\d{1,2}‏\/\d{2,4}\s*\d{1,2}:\d{1,2}:\d{1,2}\s*(ص|م)/g, "")
      .replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, "")
      .replace(/\d{1,2}-\d{1,2}-\d{2,4}/g, "")
      // إزالة المصادر غير المرغوب فيها
      .replace(/من مصادر RSS/gi, "")
      .replace(/أخبار عاجلة من مصادر RSS/gi, "")
      .replace(/منشور جديد من صفحة فيسبوك/gi, "")
      .replace(/خبر من صفحات فيسبوك/gi, "")
      .replace(/من مصدر RSS/gi, "")
      .replace(/عاجل:/gi, "")
      .replace(/حصري/gi, "")
      .replace(/Breaking/gi, "")
      .replace(/\|\s*مصدر\s*بلس/gi, "")
      // تنظيف عام
      .replace(/-\s*$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", { 
      year: "numeric", 
      month: "long", 
      day: "numeric"
    });
  };

  const displayTitle = cleanTitle(title);

  return (
    <div
      className={`
        news-card group bg-white rounded-2xl overflow-hidden shadow-lg
        hover:shadow-2xl transition-all duration-300 border border-gray-100
        ${featured ? "md:flex relative min-h-[260px] md:min-h-[220px] bg-gradient-to-r from-[#fff7f7] to-white" : ""}
      `}
    >
      {/* صورة مع lazy loading */}
      <div className={`relative ${featured ? "md:w-2/5 min-h-[220px]" : "h-52"} flex-shrink-0`}>
        <div 
          ref={imgRef}
          className={`absolute inset-0 bg-gray-200 animate-pulse rounded-xl transition-all duration-500 ${imgLoaded ? "opacity-0" : "opacity-100"}`} 
        />
        {imgInView && (
          <img
            src={image}
            alt={displayTitle}
            className={`
              w-full h-full object-cover rounded-xl transition-all duration-700
              ${imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
              ${featured ? "md:h-full h-52" : "h-52"}
            `}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />
        )}
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-10">
          <Badge className="bg-news-accent text-white text-xs font-semibold px-3 shadow">
            {category}
          </Badge>
          
          {isTranslated && (
            <Badge variant="outline" className="bg-blue-500/80 text-white border-none flex items-center gap-1 px-2 py-1 text-xs shadow">
              <Globe size={12} /> مترجم
            </Badge>
          )}
          
          {videoUrl && (
            <Badge variant="outline" className="bg-black/60 text-white border-none flex items-center gap-1 px-2 py-1 text-xs shadow">
              <Play className="text-white" size={13} /> فيديو
            </Badge>
          )}
          
          {featured && (
            <Badge variant="outline" className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-none flex items-center gap-1 px-2 py-1 text-xs shadow animate-pulse">
              <Flame size={14} /> حصري
            </Badge>
          )}
        </div>
        
        {source && source !== "محرر يدويًا" && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1">
            <Badge variant="outline" className="bg-white/85 text-gray-700 text-xs flex items-center gap-1 px-2 py-1 shadow">
              <ExternalLink className="w-3 h-3 text-gray-500" /> {source}
            </Badge>
          </div>
        )}
      </div>
      
      {/* محتوى الخبر */}
      <div className={`p-5 flex flex-col justify-between ${featured ? "md:w-3/5" : ""}`}>
        <div>
          <h3 className={`
            font-bold text-gray-900 group-hover:text-news-accent transition-colors
            ${featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"}
            line-clamp-2
          `}>
            <Link to={detailUrl} className="hover:text-news-accent">
              {displayTitle}
            </Link>
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed text-base md:text-lg line-clamp-3">{excerpt}</p>
        </div>
        
        <div className="flex flex-wrap justify-between items-center mt-6 gap-2">
          <div className="flex items-center text-gray-500 text-sm gap-1">
            <Clock className="h-4 w-4 ml-1" />
            <span>{formatDate(date)}</span>
            {readingTime && (
              <>
                <span className="mx-2">•</span>
                <span>{readingTime} دقائق</span>
              </>
            )}
          </div>
          
          <Link
            to={detailUrl}
            className="
              text-news-accent hover:bg-news-accent hover:text-white
              font-semibold flex items-center gap-1 px-4 py-2 rounded-full transition
              border border-news-accent bg-white shadow-sm
              focus:outline-none focus:ring-2 focus:ring-news-accent focus:ring-offset-2
              group/link
            "
          >
            <span>اقرأ المزيد</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 group-hover/link:translate-x-1 transition-transform duration-200">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
   );
};

export default ArticleCard;
