
import { Article } from "../../context/ArticleContext";
import { Flame, Clock } from "lucide-react";

interface BreakingNewsProps {
  breakingNews: Article[];
}

const BreakingNews = ({ breakingNews }: BreakingNewsProps) => {
  if (breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-news-accent to-red-700 text-white rounded-lg py-3 px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Flame size={20} className="text-yellow-300 animate-pulse" />
            <span className="font-bold text-lg">أخبار عاجلة</span>
            <Clock size={16} className="text-yellow-200" />
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {breakingNews.map((article, index) => (
                <span key={article.id} className="inline-block">
                  {article.title}
                  {index < breakingNews.length - 1 && (
                    <span className="mx-6 text-yellow-300">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* عداد الأخبار */}
        <div className="mt-2 text-right">
          <span className="text-xs text-yellow-200 bg-black/20 px-2 py-1 rounded-full">
            {breakingNews.length} خبر عاجل
          </span>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;
