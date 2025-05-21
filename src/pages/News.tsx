
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Newspaper, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const News = () => {
  const { articles } = useArticles();
  
  // تاريخ بداية سحب الأخبار (21 مايو 2025)
  const startSyncDate = new Date('2025-05-21T00:00:00');
  
  // التأكد من فلترة الأخبار حسب التاريخ
  const newsArticles = articles
    .filter(article => article.category === "أخبار" && new Date(article.date) >= startSyncDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Get sources
  const sources = [...new Set(newsArticles.map(article => article.source).filter(Boolean))];
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Newspaper className="ml-2 text-news-accent" />
          الأخبار
        </h1>
        <p className="text-gray-600">
          آخر وأهم الأخبار المحلية والعالمية من مصادر موثوقة
        </p>
        
        {/* تاريخ البداية */}
        <div className="flex items-center mt-3 bg-blue-50 text-blue-800 px-4 py-2 rounded-md">
          <Calendar className="ml-2 text-blue-600" size={16} />
          <span className="text-sm">تظهر الأخبار بدءًا من تاريخ {startSyncDate.toLocaleDateString('ar-EG')}</span>
        </div>
        
        {/* Breaking news banner */}
        <div className="bg-news-accent text-white p-3 rounded-md mt-4 flex items-center">
          <AlertCircle className="ml-2" />
          <div className="font-bold">آخر الأخبار:</div>
          <div className="mr-2 overflow-hidden whitespace-nowrap">
            {newsArticles.length > 0 ? newsArticles[0].title : "لا توجد أخبار جديدة"}
          </div>
        </div>
        
        {/* Sources */}
        {sources.length > 0 && (
          <div className="mt-6">
            <h2 className="text-sm text-gray-500 mb-2">المصادر:</h2>
            <div className="flex flex-wrap gap-2">
              {sources.map((source, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ArticleGrid articles={newsArticles} title="أحدث الأخبار" />
    </div>
  );
};

export default News;
