
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { PieChart, DollarSign, TrendingUp } from "lucide-react";

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
        <p className="text-gray-600">
          آخر الأخبار والتحليلات الاقتصادية وأسعار العملات والبورصة
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="text-green-600" />
              <span className="font-bold">الدولار</span>
            </div>
            <div className="text-xl font-bold">30.94 <span className="text-xs">ج.م</span></div>
            <div className="flex items-center justify-center text-xs text-green-600">
              <TrendingUp size={12} className="ml-1" /> 0.05%
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="font-bold ml-1">€</span>
              <span className="font-bold">اليورو</span>
            </div>
            <div className="text-xl font-bold">33.41 <span className="text-xs">ج.م</span></div>
            <div className="flex items-center justify-center text-xs text-red-600">
              <TrendingUp size={12} className="ml-1 rotate-180" /> 0.12%
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="font-bold ml-1">£</span>
              <span className="font-bold">الجنيه الإسترليني</span>
            </div>
            <div className="text-xl font-bold">39.05 <span className="text-xs">ج.م</span></div>
            <div className="flex items-center justify-center text-xs text-green-600">
              <TrendingUp size={12} className="ml-1" /> 0.23%
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="font-bold ml-1">﷼</span>
              <span className="font-bold">الريال السعودي</span>
            </div>
            <div className="text-xl font-bold">8.25 <span className="text-xs">ج.م</span></div>
            <div className="flex items-center justify-center text-xs text-gray-600">
              0.00%
            </div>
          </div>
        </div>
      </div>
      
      <ArticleGrid articles={economyArticles} title="أخبار الاقتصاد" />
    </div>
  );
};

export default Economy;
