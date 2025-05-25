
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Shield, Sword, Radar, Users } from "lucide-react";

const Military = () => {
  const { articles } = useArticles();
  
  // فلترة الأخبار العسكرية
  const militaryArticles = articles
    .filter(article => 
      article.category === "عسكرية" ||
      article.title.toLowerCase().includes("عسكري") ||
      article.title.toLowerCase().includes("دفاع") ||
      article.title.toLowerCase().includes("جيش") ||
      article.content.toLowerCase().includes("عسكري") ||
      article.content.toLowerCase().includes("دفاع")
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Shield className="ml-2 text-news-accent" />
          الأخبار العسكرية
        </h1>
        <p className="text-gray-600 mb-6">
          آخر الأخبار والتطورات في القطاع العسكري والدفاعي
        </p>
        
        {/* مجالات عسكرية */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Sword className="text-red-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">القوات المسلحة</h3>
            </div>
            <p className="text-gray-600 text-sm">
              أخبار وتطورات القوات المسلحة المصرية
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Radar className="text-blue-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">التقنيات الدفاعية</h3>
            </div>
            <p className="text-gray-600 text-sm">
              أحدث التقنيات والأسلحة الدفاعية المتطورة
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Users className="text-green-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">التدريبات</h3>
            </div>
            <p className="text-gray-600 text-sm">
              التدريبات العسكرية والمناورات الدفاعية
            </p>
          </div>
        </div>
      </div>
      
      <ArticleGrid articles={militaryArticles} title="الأخبار العسكرية" />
    </div>
  );
};

export default Military;
