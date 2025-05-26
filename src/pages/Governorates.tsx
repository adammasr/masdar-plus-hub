
import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { MapPin, Filter, Search } from "lucide-react";
import { egyptianGovernorates } from "../data/governoratesData";
import { AdSlot } from "../components/ads/AdService";

const Governorates = () => {
  const { articles } = useArticles();
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // تحسين آلية تصنيف أخبار المحافظات
  const categorizeArticleByGovernorate = (article: any): string | null => {
    const title = article.title.toLowerCase();
    const content = article.content.toLowerCase();
    const fullText = `${title} ${content}`;
    
    // البحث عن أسماء المحافظات في المحتوى
    for (const gov of egyptianGovernorates) {
      const govLower = gov.toLowerCase();
      if (fullText.includes(govLower) || 
          fullText.includes(`محافظة ${govLower}`) ||
          fullText.includes(`محافظ ${govLower}`)) {
        return gov;
      }
    }
    
    // كلمات مفتاحية للمحافظات المختلفة
    const governorateKeywords: Record<string, string[]> = {
      'القاهرة': ['العاصمة', 'القاهرة', 'وسط البلد', 'مصر الجديدة', 'المعادي', 'حلوان'],
      'الإسكندرية': ['الإسكندرية', 'الثغر', 'المتوسط', 'بحري'],
      'الجيزة': ['الجيزة', 'الأهرام', 'الهرم', 'فيصل', '6 أكتوبر'],
      'الشرقية': ['الزقازيق', 'الشرقية', 'بلبيس', 'فاقوس'],
      'المنوفية': ['شبين الكوم', 'المنوفية', 'منوف', 'السادات'],
      'القليوبية': ['بنها', 'القليوبية', 'شبرا الخيمة', 'القناطر'],
      'أسوان': ['أسوان', 'النوبة', 'إدفو', 'كوم أمبو'],
      'الأقصر': ['الأقصر', 'الكرنك', 'الدير البحري', 'وادي الملوك']
    };
    
    for (const [gov, keywords] of Object.entries(governorateKeywords)) {
      if (keywords.some(keyword => fullText.includes(keyword.toLowerCase()))) {
        return gov;
      }
    }
    
    return null;
  };

  // فلترة أخبار المحافظات مع تحسين التصنيف
  const governoratesArticles = useMemo(() => {
    let filteredArticles = articles.filter(article => {
      // التحقق من الفئة أولاً
      if (article.category === "محافظات") return true;
      
      // ثم التحقق من المحتوى
      const detectedGov = categorizeArticleByGovernorate(article);
      if (detectedGov) {
        // تحديث فئة المقال تلقائياً إذا لم تكن محافظات
        if (article.category !== "محافظات") {
          article.category = "محافظات";
          (article as any).governorate = detectedGov;
        }
        return true;
      }
      
      return false;
    });
    
    // فلترة حسب المحافظة المختارة
    if (selectedGovernorate !== "الكل") {
      filteredArticles = filteredArticles.filter(article => {
        const detectedGov = categorizeArticleByGovernorate(article);
        return detectedGov === selectedGovernorate ||
               (article as any).governorate === selectedGovernorate;
      });
    }
    
    // فلترة حسب البحث
    if (searchTerm) {
      filteredArticles = filteredArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filteredArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, selectedGovernorate, searchTerm]);

  // إحصائيات المحافظات
  const governoratesStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    articles.forEach(article => {
      const detectedGov = categorizeArticleByGovernorate(article);
      if (detectedGov || article.category === "محافظات") {
        const gov = detectedGov || (article as any).governorate || "أخرى";
        stats[gov] = (stats[gov] || 0) + 1;
      }
    });
    
    return stats;
  }, [articles]);

  useEffect(() => {
    document.title = "أخبار المحافظات | مصدر بلس";
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <AdSlot position="header" className="mb-6" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <MapPin className="ml-2 text-news-accent" />
          أخبار المحافظات
        </h1>
        <p className="text-gray-600 mb-6">
          آخر الأخبار والتطورات من محافظات جمهورية مصر العربية
        </p>

        {/* شريط البحث */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="search"
              placeholder="ابحث في أخبار المحافظات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-news-accent"
              dir="rtl"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

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
              الكل ({governoratesArticles.length})
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
            <div className="text-sm text-blue-600">
              {selectedGovernorate === "الكل" ? "إجمالي الأخبار" : `أخبار ${selectedGovernorate}`}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-700">{Object.keys(governoratesStats).length}</div>
            <div className="text-sm text-green-600">محافظات نشطة</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-purple-700">
              {articles.filter(a => {
                const isGovNews = a.category === "محافظات" || categorizeArticleByGovernorate(a);
                return isGovNews && new Date(a.date) >= new Date(Date.now() - 24 * 60 * 60 * 1000);
              }).length}
            </div>
            <div className="text-sm text-purple-600">أخبار اليوم</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-700">
              {articles.filter(a => {
                const isGovNews = a.category === "محافظات" || categorizeArticleByGovernorate(a);
                return isGovNews && a.featured;
              }).length}
            </div>
            <div className="text-sm text-orange-600">أخبار مميزة</div>
          </div>
        </div>
      </div>

      <AdSlot position="article" className="mb-6" />

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
              ? searchTerm 
                ? `لا توجد نتائج للبحث عن "${searchTerm}"`
                : "لا توجد أخبار محافظات متاحة حالياً" 
              : searchTerm
                ? `لا توجد نتائج في ${selectedGovernorate} للبحث عن "${searchTerm}"`
                : `لا توجد أخبار متاحة لمحافظة ${selectedGovernorate}`
            }
          </p>
        </div>
      )}

      <AdSlot position="footer" className="mt-8" />
    </div>
  );
};

export default Governorates;
