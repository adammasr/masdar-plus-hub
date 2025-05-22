
import { Article } from "../../context/ArticleContext";
import { Link } from "react-router-dom";
import { Newspaper, Share2 } from "lucide-react";

interface LatestNewsProps {
  latestNews: Article[];
}

const LatestNews = ({ latestNews }: LatestNewsProps) => {
  const isNew = (date: string) => {
    const today = new Date();
    return today.getTime() - new Date(date).getTime() < 24 * 60 * 60 * 1000;
  };

  const handleShare = (articleId: string) => {
    const url = window.location.origin + `/news/${articleId}`;
    if (navigator.share) {
      navigator.share({ url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("تم نسخ رابط الخبر!");
    } else {
      window.prompt("انسخ الرابط:", url);
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
        <h2 className="text-2xl font-bold flex items-center">
          <Newspaper size={24} />
          <span className="mr-2">أحدث الأخبار</span>
        </h2>
        <Link
          to="/news"
          className="text-news-accent hover:underline text-sm font-medium"
        >
          عرض الكل
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {latestNews.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg flex flex-col group transition"
          >
            {article.image && (
              <Link to={`/news/${article.id}`}>
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              </Link>
            )}
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                {isNew(article.date) && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    جديد
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {new Date(article.date).toLocaleDateString("ar-EG")}
                </span>
                {article.source && (
                  <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {article.source}
                  </span>
                )}
              </div>
              <Link to={`/news/${article.id}`}>
                <h3 className="font-bold text-lg mb-1 group-hover:text-news-accent transition">
                  {article.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3 flex-1 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-2 mt-auto">
                <Link
                  to={`/news/${article.id}`}
                  className="text-news-accent text-xs hover:underline"
                >
                  التفاصيل
                </Link>
                <button
                  onClick={() => handleShare(article.id)}
                  title="مشاركة الخبر"
                  className="ml-auto text-gray-400 hover:text-news-accent text-xs flex items-center gap-1"
                >
                  <Share2 size={16} /> مشاركة
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestNews;
