
import { useState, useMemo } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleCard from "../components/articles/ArticleCard";
import { MapPin, Search } from "lucide-react";
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

  // فلترة المقالات حسب المحافظة والبحث
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // فلترة حسب المحافظة
    if (selectedGovernorate !== "الكل") {
      filtered = filtered.filter(article => 
        article.title.includes(selectedGovernorate) ||
        article.content.includes(selectedGovernorate) ||
        article.excerpt?.includes(selectedGovernorate)
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
  }, [articles, selectedGovernorate, searchTerm]);

  // إحصائيات المحافظات
  const governorateStats = useMemo(() => {
    const stats: Record<string, number> = {};
    
    EGYPTIAN_GOVERNORATES.forEach(gov => {
      stats[gov] = articles.filter(article =>
        article.title.includes(gov) ||
        article.content.includes(gov) ||
        article.excerpt?.includes(gov)
      ).length;
    });

    return stats;
  }, [articles]);

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
            الكل ({articles.length})
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
            <ArticleCard key={article.id} article={article} />
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
