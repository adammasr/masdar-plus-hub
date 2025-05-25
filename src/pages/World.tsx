
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Globe, MapPin, Satellite, Building } from "lucide-react";

const World = () => {
  const { articles } = useArticles();
  
  // فلترة الأخبار العالمية
  const worldArticles = articles
    .filter(article => 
      article.category === "العالم" ||
      article.category === "دولية" ||
      article.title.toLowerCase().includes("عالمي") ||
      article.title.toLowerCase().includes("دولي") ||
      article.title.toLowerCase().includes("عالم") ||
      article.content.toLowerCase().includes("عالمي") ||
      article.content.toLowerCase().includes("دولي")
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Globe className="ml-2 text-news-accent" />
          أخبار العالم
        </h1>
        <p className="text-gray-600 mb-6">
          آخر الأخبار والأحداث من جميع أنحاء العالم
        </p>
        
        {/* المناطق العالمية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <MapPin className="text-blue-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">الشرق الأوسط</h3>
            </div>
            <p className="text-gray-600 text-sm">
              آخر التطورات في منطقة الشرق الأوسط وشمال أفريقيا
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Satellite className="text-green-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">القارات</h3>
            </div>
            <p className="text-gray-600 text-sm">
              أخبار من قارات العالم: آسيا، أوروبا، أمريكا وأفريقيا
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Building className="text-purple-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">المنظمات الدولية</h3>
            </div>
            <p className="text-gray-600 text-sm">
              أخبار الأمم المتحدة والمنظمات الدولية
            </p>
          </div>
        </div>
      </div>
      
      <ArticleGrid articles={worldArticles} title="أخبار العالم" />
    </div>
  );
};

export default World;
