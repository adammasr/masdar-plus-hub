
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { PieChart, TrendingUp, BarChart3 } from "lucide-react";

const Economy = () => {
  const { articles } = useArticles();
  
  const economyArticles = articles
    .filter(article => article.category === "اقتصاد")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <PieChart className="ml-2 text-news-accent" />
          الاقتصاد
        </h1>
        <p className="text-gray-600 mb-6">
          آخر الأخبار والتحليلات الاقتصادية والمالية من مصادر موثوقة
        </p>
        
        {/* مؤشرات اقتصادية عامة */}
        <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-lg border shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">المؤشرات الاقتصادية</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="text-green-600 ml-2" size={20} />
                <span className="font-bold">البورصة المصرية</span>
              </div>
              <div className="text-lg font-bold text-gray-700">
                تابع أحدث الأخبار والتحليلات
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <PieChart className="text-blue-600 ml-2" size={20} />
                <span className="font-bold">القطاع المصرفي</span>
              </div>
              <div className="text-lg font-bold text-gray-700">
                أخبار البنوك والتمويل
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="text-orange-600 ml-2" size={20} />
                <span className="font-bold">الاستثمار</span>
              </div>
              <div className="text-lg font-bold text-gray-700">
                فرص وتحليلات استثمارية
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              * للحصول على أسعار العملات الحية، يرجى زيارة المواقع المتخصصة
            </p>
          </div>
        </div>
      </div>
      
      <ArticleGrid articles={economyArticles} title="أخبار الاقتصاد" />
    </div>
  );
};

export default Economy;
