
import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { MapPin, Filter, Search, TrendingUp, AlertCircle } from "lucide-react";
import { egyptianGovernorates } from "../data/governoratesData";
import { AdSlot } from "../components/ads/AdService";
import { categorizeArticle, improveImageExtraction } from "../utils/smartCategorization";

const Governorates = () => {
  const { articles } = useArticles();
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // نظام تصنيف ذكي محسن لأخبار المحافظات
  const categorizeArticleByGovernorate = (article: any): string | null => {
    const title = article.title.toLowerCase();
    const content = article.content.toLowerCase();
    const excerpt = article.excerpt?.toLowerCase() || '';
    const fullText = `${title} ${content} ${excerpt}`;
    
    // التحقق من الكلمات المحظورة أولاً
    const forbiddenKeywords = [
      'only available in paid plans',
      'upgrade to premium', 
      'subscription required',
      'إعلان',
      'اشترك الآن'
    ];
    
    if (forbiddenKeywords.some(keyword => fullText.includes(keyword))) {
      return null; // تجاهل المقالات الإعلانية
    }
    
    // البحث المحسن عن أسماء المحافظات
    for (const gov of egyptianGovernorates) {
      const govLower = gov.toLowerCase();
      // نقاط قوة مختلفة للتطابقات
      const directMatch = fullText.includes(govLower);
      const officialMatch = fullText.includes(`محافظة ${govLower}`) || fullText.includes(`محافظ ${govLower}`);
      
      if (directMatch || officialMatch) {
        return gov;
      }
    }
    
    // كلمات مفتاحية محسنة ومتوسعة للمحافظات
    const governorateKeywords: Record<string, string[]> = {
      'القاهرة': ['العاصمة', 'القاهرة', 'وسط البلد', 'مصر الجديدة', 'المعادي', 'حلوان', 'النزهة', 'مدينة نصر', 'التجمع الخامس'],
      'الإسكندرية': ['الإسكندرية', 'الثغر', 'المتوسط', 'بحري', 'العجمي', 'المنتزه', 'سيدي بشر'],
      'الجيزة': ['الجيزة', 'الأهرام', 'الهرم', 'فيصل', '6 أكتوبر', 'الشيخ زايد', 'المهندسين', 'العجوزة'],
      'الشرقية': ['الزقازيق', 'الشرقية', 'بلبيس', 'فاقوس', 'ديرب نجم', 'أبو حماد'],
      'المنوفية': ['شبين الكوم', 'المنوفية', 'منوف', 'السادات', 'تلا', 'أشمون'],
      'القليوبية': ['بنها', 'القليوبية', 'شبرا الخيمة', 'القناطر', 'طوخ', 'كفر شكر'],
      'أسوان': ['أسوان', 'النوبة', 'إدفو', 'كوم أمبو', 'دراو', 'أبو سمبل'],
      'الأقصر': ['الأقصر', 'الكرنك', 'الدير البحري', 'وادي الملوك', 'إسنا', 'الطود'],
      'البحر الأحمر': ['الغردقة', 'سفاجا', 'مرسى علم', 'رأس غارب', 'القصير'],
      'جنوب سيناء': ['شرم الشيخ', 'دهب', 'نويبع', 'طابا', 'كاترين'],
      'شمال سيناء': ['العريش', 'رفح', 'الشيخ زويد', 'بئر العبد'],
      'مطروح': ['مرسى مطروح', 'السلوم', 'سيوة', 'الضبعة'],
      'الوادي الجديد': ['الخارجة', 'الداخلة', 'الفرافرة', 'باريس'],
      'البحيرة': ['دمنهور', 'رشيد', 'إدكو', 'كفر الدوار'],
      'كفر الشيخ': ['كفر الشيخ', 'دسوق', 'فوه', 'بلطيم'],
      'الدقهلية': ['المنصورة', 'طلخا', 'ميت غمر', 'أجا'],
      'الغربية': ['طنطا', 'المحلة الكبرى', 'زفتى', 'السنطة'],
      'دمياط': ['دمياط', 'رأس البر', 'فارسكور', 'الزرقا'],
      'بورسعيد': ['بورسعيد', 'بورفؤاد'],
      'الإسماعيلية': ['الإسماعيلية', 'التل الكبير', 'فايد', 'القنطرة'],
      'السويس': ['السويس', 'الأربعين', 'عتاقة'],
      'المنيا': ['المنيا', 'ملوي', 'سمالوط', 'بني مزار'],
      'أسيوط': ['أسيوط', 'ديروط', 'منفلوط', 'أبنوب'],
      'سوهاج': ['سوهاج', 'أخميم', 'البلينا', 'المراغة'],
      'قنا': ['قنا', 'نجع حمادي', 'دشنا', 'فرشوط'],
      'بني سويف': ['بني سويف', 'الواسطى', 'ناصر', 'ببا'],
      'الفيوم': ['الفيوم', 'سنورس', 'إطسا', 'طامية']
    };
    
    // البحث بنظام نقاط للحصول على أفضل تطابق
    let bestMatch = { governorate: null as string | null, score: 0 };
    
    for (const [gov, keywords] of Object.entries(governorateKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        const matches = (fullText.match(new RegExp(keywordLower, 'g')) || []).length;
        score += matches;
        
        // نقاط إضافية إذا كانت الكلمة في العنوان
        if (title.includes(keywordLower)) {
          score += 2;
        }
      }
      
      if (score > bestMatch.score) {
        bestMatch = { governorate: gov, score };
      }
    }
    
    // إرجاع النتيجة فقط إذا كانت النقاط كافية
    return bestMatch.score >= 1 ? bestMatch.governorate : null;
  };

  // فلترة أخبار المحافظات مع نظام تصنيف ذكي محسن
  const governoratesArticles = useMemo(() => {
    let filteredArticles = articles.filter(article => {
      // استبعاد المقالات الإعلانية أو غير المناسبة
      const isAdvertisement = article.title.toLowerCase().includes('only available in paid plans') ||
                             article.content.toLowerCase().includes('subscription required') ||
                             !article.title || article.title.length < 10;
      
      if (isAdvertisement) return false;
      
      // التحقق من الفئة أولاً
      if (article.category === "محافظات") {
        // تحسين الصورة إذا لم تكن مناسبة
        if (!article.image || article.image.includes('placeholder')) {
          article.image = improveImageExtraction(article);
        }
        return true;
      }
      
      // استخدام النظام الذكي للتصنيف
      const detectedGov = categorizeArticleByGovernorate(article);
      if (detectedGov) {
        // تحديث فئة المقال تلقائياً
        article.category = "محافظات";
        (article as any).governorate = detectedGov;
        // تحسين الصورة
        article.image = improveImageExtraction(article);
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
