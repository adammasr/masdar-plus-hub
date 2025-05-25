
import { useState, useMemo } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleCard from "../components/articles/ArticleCard";
import { MapPin, Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// قائمة المحافظات المصرية
const EGYPTIAN_GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "البحر الأحمر", "البحيرة",
  "الفيوم", "الغربية", "الإسماعيلية", "المنيا", "المنوفية", "الوادي الجديد",
  "شمال سيناء", "جنوب سيناء", "بورسعيد", "القليوبية", "قنا", "السويس",
  "سوهاج", "بني سويف", "دمياط", "أسوان", "أسيوط", "الأقصر", "مطروح",
  "كفر الشيخ", "الشرقية"
];

const Governorates = () => {
  const { articles } = useArticles();
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  // إضافة أخبار تجريبية للمحافظات إذا لم تكن موجودة
  const enhancedArticles = useMemo(() => {
    const existingArticles = [...articles];
    
    // إضافة أخبار تجريبية لكل محافظة
    if (articles.length < 10) {
      EGYPTIAN_GOVERNORATES.forEach((gov, index) => {
        existingArticles.push({
          id: `gov-${index}`,
          title: `أخبار مهمة من محافظة ${gov}`,
          content: `تقرير شامل حول آخر التطورات والأحداث في محافظة ${gov}. يتضمن التقرير معلومات مفصلة حول التطورات الاقتصادية والاجتماعية والسياسية في المحافظة.`,
          excerpt: `آخر الأخبار والتطورات في محافظة ${gov}`,
          image: `https://images.unsplash.com/photo-1500000000000?w=600&h=400&fit=crop&auto=format`,
          category: "محافظات",
          date: new Date().toISOString(),
          source: `مراسل ${gov}`,
          readingTime: 3
        });
      });
    }
    
    return existingArticles;
  }, [articles]);

  // فلترة المقالات حسب المحافظة والبحث
  const filteredArticles = useMemo(() => {
    let filtered = enhancedArticles;

    // فلترة حسب المحافظة
    if (selectedGovernorate !== "الكل") {
      filtered = filtered.filter(article => 
        article.title.includes(selectedGovernorate) ||
        article.content.includes(selectedGovernorate) ||
        article.excerpt?.includes(selectedGovernorate) ||
        article.category === "محافظات"
      );
    }

    // فلترة حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // ترتيب حسب التاريخ
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [enhancedArticles, selectedGovernorate, searchTerm]);

  // إحصائيات المحافظات
  const governorateStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    EGYPTIAN_GOVERNORATES.forEach(gov => {
      stats[gov] = enhancedArticles.filter(article =>
        article.title.includes(gov) ||
        article.content.includes(gov) ||
        article.excerpt?.includes(gov)
      ).length;
    });

    return stats;
  }, [enhancedArticles]);

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MapPin className="h-8 w-8 text-news-accent" />
          <h1 className="text-4xl font-bold text-gray-800">أخبار المحافظات</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          تابع آخر الأخبار والأحداث في جميع محافظات جمهورية مصر العربية
        </p>
      </div>

      {/* تنبيه في حالة عدم وجود أخبار كافية */}
      {articles.length < 10 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span className="text-blue-800 font-semibold">ملاحظة:</span>
          </div>
          <p className="text-blue-700 mt-1">
            يتم عرض أخبار تجريبية للمحافظات. بمجرد إضافة أخبار حقيقية من خلاصات RSS أو Facebook، ستظهر هنا تلقائياً.
          </p>
        </div>
      )}

      {/* البحث */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="ابحث في أخبار المحافظات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* فلتر المحافظات */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-center">اختر المحافظة</h2>
        <div className="flex flex-wrap gap-2 justify-center max-w-6xl mx-auto">
          <Button
            variant={selectedGovernorate === "الكل" ? "default" : "outline"}
            onClick={() => setSelectedGovernorate("الكل")}
            className={selectedGovernorate === "الكل" ? "bg-news-accent hover:bg-news-accent/90" : ""}
          >
            الكل ({enhancedArticles.length})
          </Button>
          {EGYPTIAN_GOVERNORATES.map((gov) => (
            <Button
              key={gov}
              variant={selectedGovernorate === gov ? "default" : "outline"}
              onClick={() => setSelectedGovernorate(gov)}
              className={`${
                selectedGovernorate === gov 
                  ? "bg-news-accent hover:bg-news-accent/90" 
                  : ""
              } ${governorateStats[gov] === 0 ? "opacity-50" : ""}`}
              disabled={governorateStats[gov] === 0}
            >
              {gov} ({governorateStats[gov]})
            </Button>
          ))}
        </div>
      </div>

      {/* النتائج */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700">
          {selectedGovernorate === "الكل" 
            ? `جميع أخبار المحافظات (${filteredArticles.length})` 
            : `أخبار ${selectedGovernorate} (${filteredArticles.length})`
          }
          {searchTerm && ` - البحث عن: "${searchTerm}"`}
        </h3>
      </div>

      {/* المقالات */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              detailUrl={`/news/${article.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            لا توجد أخبار متاحة
          </h3>
          <p className="text-gray-400">
            {selectedGovernorate === "الكل"
              ? "لم يتم العثور على أخبار للمحافظات في الوقت الحالي"
              : `لم يتم العثور على أخبار لمحافظة ${selectedGovernorate} في الوقت الحالي`
            }
            {searchTerm && ` أو البحث عن "${searchTerm}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Governorates;
