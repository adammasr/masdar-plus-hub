
import { Article } from "../../context/ArticleContext";
import { Flame, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BreakingNewsProps {
  breakingNews: Article[];
}

const BreakingNews = ({ breakingNews }: BreakingNewsProps) => {
  if (breakingNews.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="bg-gradient-to-r from-news-accent to-red-700 text-white rounded-lg py-4 px-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Flame size={20} className="text-yellow-300 animate-pulse" />
            <span className="font-bold text-lg">أخبار عاجلة</span>
            <Clock size={16} className="text-yellow-200" />
          </div>
          
          <div className="mr-auto">
            <span className="text-xs text-yellow-200 bg-black/20 px-2 py-1 rounded-full">
              {breakingNews.length} خبر عاجل
            </span>
          </div>
        </div>
        
        {/* عرض الأخبار العاجلة بعناوينها */}
        <div className="space-y-2">
          {breakingNews.slice(0, 3).map((article, index) => (
            <Link
              key={article.id}
              to={`/news/${article.id}`}
              className="flex items-center gap-2 group hover:bg-white/10 p-2 rounded transition-colors"
            >
              <span className="text-yellow-300 font-bold text-sm flex-shrink-0">
                {index + 1}.
              </span>
              <span className="text-white group-hover:text-yellow-100 transition-colors text-sm leading-relaxed">
                {article.title}
              </span>
              <ArrowLeft size={14} className="text-yellow-200 group-hover:translate-x-1 transition-transform mr-auto flex-shrink-0" />
            </Link>
          ))}
        </div>
        
        {/* رابط لعرض جميع الأخبار العاجلة */}
        {breakingNews.length > 3 && (
          <div className="mt-3 pt-2 border-t border-white/20">
            <Link
              to="/news"
              className="text-yellow-200 hover:text-yellow-100 text-xs underline flex items-center gap-1"
            >
              عرض جميع الأخبار العاجلة ({breakingNews.length})
              <ArrowLeft size={12} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakingNews;
