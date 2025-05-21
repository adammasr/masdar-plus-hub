import { Link } from "react-router-dom";
import { Article } from "../../context/ArticleContext";
import { Play, Clock, Flame, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  detailUrl: string; // رابط تفاصيل الخبر
}

const ArticleCard = ({ article, featured = false, detailUrl }: ArticleCardProps) => {
  const { title, excerpt, image, category, date, videoUrl, source } = article;
  const [imgLoaded, setImgLoaded] = useState(false);

  // تنسيق التاريخ للعرض
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div
      className={`
        news-card group bg-white rounded-2xl overflow-hidden shadow-lg
        hover:shadow-2xl transition-all duration-300 border border-gray-100
        ${featured ? 'md:flex relative min-h-[260px] md:min-h-[220px] bg-gradient-to-r from-[#fff7f7] to-white' : ''}
      `}
    >
      {/* الصورة مع تأثير تحميل عصري */}
      <div className={`relative ${featured ? 'md:w-2/5 min-h-[220px]' : 'h-52'} flex-shrink-0`}>
        <div className={`absolute inset-0 bg-gray-200 animate-pulse rounded-xl transition-all duration-500 ${imgLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img
          src={image}
          alt={title}
          className={`
            w-full h-full object-cover rounded-xl transition-all duration-700
            ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
            ${featured ? 'md:h-full h-52' : 'h-52'}
          `}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-10">
          <Badge className="bg-news-accent text-white text-xs font-semibold px-3 shadow">
            {category}
          </Badge>
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
        {source && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1">
            <Badge variant="outline" className="bg-white/85 text-gray-700 text-xs flex items-center gap-1 px-2 py-1 shadow">
              <ExternalLink className="w-3 h-3 text-gray-500" /> {source}
            </Badge>
          </div>
        )}
      </div>
      {/* محتوى الخبر */}
      <div className={`p-5 flex flex-col justify-between ${featured ? 'md:w-3/5' : ''}`}>
        <div>
          <h3 className={`
            font-bold text-gray-900 group-hover:text-news-accent transition-colors
            ${featured ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}
            line-clamp-2
          `}>
            {title}
          </h3>
          <p className="mt-3 text-gray-600 leading-relaxed text-base md:text-lg line-clamp-3">{excerpt}</p>
        </div>
        <div className="flex flex-wrap justify-between items-center mt-6 gap-2">
          <div className="flex items-center text-gray-500 text-sm gap-1">
            <Clock className="h-4 w-4 ml-1" />
            <span>{formatDate(date)}</span>
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
