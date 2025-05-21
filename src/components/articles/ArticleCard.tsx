import { Link } from "react-router-dom";
import { Article } from "../../context/ArticleContext";
import { Play, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  detailUrl: string; // رابط تفاصيل الخبر
}

const ArticleCard = ({ article, featured = false, detailUrl }: ArticleCardProps) => {
  const { title, excerpt, image, category, date, videoUrl, source } = article;

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
    <div className={`news-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${featured ? 'md:flex' : ''}`}>
      <div className={`relative ${featured ? 'md:w-2/5' : ''}`}>
        <img
          src={image}
          alt={title}
          className={`w-full h-48 object-cover ${featured ? 'md:h-full' : ''}`}
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end">
          <Badge className="bg-news-accent hover:bg-red-700 text-white font-medium">
            {category}
          </Badge>
          {videoUrl && (
            <Badge variant="outline" className="bg-black/50 text-white border-none">
              <Play className="text-white mr-1" size={12} /> فيديو
            </Badge>
          )}
        </div>
        {source && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="outline" className="bg-white/80 text-gray-700 text-xs">
              {source}
            </Badge>
          </div>
        )}
      </div>
      <div className={`p-4 ${featured ? 'md:w-3/5' : ''}`}>
        <h3 className={`font-bold text-gray-900 hover:text-news-accent transition-colors ${featured ? 'text-2xl' : 'text-xl'}`}>
          {title}
        </h3>
        <p className="mt-2 text-gray-600 leading-relaxed">{excerpt}</p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 ml-1" />
            <span>{formatDate(date)}</span>
          </div>
          <Link
            to={detailUrl}
            className="text-news-accent hover:underline font-medium flex items-center"
          >
            اقرأ المزيد
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
