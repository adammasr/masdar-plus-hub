
import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { MapPin, Filter } from "lucide-react";
import { governoratesData, egyptianGovernorates } from "../data/governoratesData";

const Governorates = () => {
  const { articles, addBatchArticles } = useArticles();
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("الكل");

  // إضافة البيانات التجريبية عند أول تحميل للصفحة
  useEffect(() => {
    // التحقق من وجود أخبار محافظات
    const existingGovNews = articles.filter(article => article.category === "محافظات");
    
    if (existingGovNews.length === 0) {
      // إضافة البيانات التجريبية
      addBatchArticles(governoratesData as any[]);
    }
  }, [articles, addBatchArticles]);

  // فلترة أخبار المحافظات
  const governoratesArticles = useMemo(() => {
    let filteredArticles = articles.filter(article => article.category === "محافظات");
    
    if (selectedGovernorate !== "الكل") {
      filteredArticles = filteredArticles.filter(article => 
        (article as any).governorate === selectedGovernorate ||
        article.title.includes(selectedGovernorate) ||
        article.content.includes(selectedGovernorate)
      );
    }
    
    return filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, selectedGovernorate]);

  // إحصائيات المحافظات
  const governoratesStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    articles.filter(article => article.category === "محافظات").forEach(article => {
      const gov = (article as any).governorate || "أخرى";
      stats[gov] = (stats[gov] || 0) + 1;
    });
    
    return stats;
  }, [articles]);

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <MapPin className="ml-2 text-news-accent" />
          أخبار المحافظات
        </h1>
        <p className="text-gray-600 mb-6">
          آخر الأخبار والتطورات من محافظات جمهورية مصر العربية
        </p>

        {/* فلتر المحافظات */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-news-accent" size={20} />
            <h3 className="text-lg font-bold">فلترة حسب المحافظة</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGovernorate("الكل")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGovernorate === "الكل"
                  ? "bg-news-accent text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              الكل ({articles.filter(a => a.category === "محافظات").length})
            </button>
            
            {egyptianGovernorates.map(gov => {
              const count = governoratesStats[gov] || 0;
              if (count === 0) return null;
              
              return (
                <button
                  key={gov}
                  onClick={() => setSelectedGovernorate(gov)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedGovernorate === gov
                      ? "bg-news-accent text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {gov} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-700">{governoratesArticles.length}</div>
            <div className="text-sm text-blue-600">إجمالي الأخبار</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-700">{Object.keys(governoratesStats).length}</div>
            <div className="text-sm text-green-600">محافظات نشطة</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-700">
              {articles.filter(a => a.category === "محافظات" && 
                new Date(a.date) >= new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-sm text-purple-600">أخبار اليوم</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-700">
              {articles.filter(a => a.category === "محافظات" && a.featured).length}
            </div>
            <div className="text-sm text-orange-600">أخبار مميزة</div>
          </div>
        </div>
      </div>

      {/* عرض الأخبار */}
      {governoratesArticles.length > 0 ? (
        <ArticleGrid 
          articles={governoratesArticles} 
          title={selectedGovernorate === "الكل" ? "جميع أخبار المحافظات" : `أخبار ${selectedGovernorate}`}
        />
      ) : (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            لا توجد أخبار متاحة
          </h3>
          <p className="text-gray-500">
            {selectedGovernorate === "الكل" 
              ? "لا توجد أخبار محافظات متاحة حالياً" 
              : `لا توجد أخبار متاحة لمحافظة ${selectedGovernorate}`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Governorates;
