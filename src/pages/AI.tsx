
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Brain, Zap, Cpu, Bot } from "lucide-react";

const AI = () => {
  const { articles } = useArticles();
  
  // فلترة الأخبار المتعلقة بالذكاء الاصطناعي
  const aiArticles = articles
    .filter(article => 
      article.category === "ذكاء اصطناعي" ||
      article.title.toLowerCase().includes("ذكاء اصطناعي") ||
      article.title.toLowerCase().includes("ai") ||
      article.content.toLowerCase().includes("ذكاء اصطناعي") ||
      article.content.toLowerCase().includes("تكنولوجيا")
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Brain className="ml-2 text-news-accent" />
          الذكاء الاصطناعي
        </h1>
        <p className="text-gray-600 mb-6">
          آخر أخبار وتطورات تقنيات الذكاء الاصطناعي والتكنولوجيا المتقدمة
        </p>
        
        {/* مجالات الذكاء الاصطناعي */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Bot className="text-blue-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">التعلم الآلي</h3>
            </div>
            <p className="text-gray-600 text-sm">
              أحدث التطورات في خوارزميات التعلم الآلي والتطبيقات الذكية
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Zap className="text-purple-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">الأتمتة الذكية</h3>
            </div>
            <p className="text-gray-600 text-sm">
              تطبيقات الذكاء الاصطناعي في الصناعة والخدمات
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border shadow-sm">
            <div className="flex items-center mb-3">
              <Cpu className="text-green-600 ml-2" size={24} />
              <h3 className="text-lg font-bold text-gray-800">الابتكار التقني</h3>
            </div>
            <p className="text-gray-600 text-sm">
              أحدث الابتكارات والاختراعات في مجال التقنية
            </p>
          </div>
        </div>
      </div>
      
      <ArticleGrid articles={aiArticles} title="أخبار الذكاء الاصطناعي" />
    </div>
  );
};

export default AI;
