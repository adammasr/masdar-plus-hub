
import { useArticles } from "../context/ArticleContext";
import FeaturedArticles from "../components/articles/FeaturedArticles";
import ArticleGrid from "../components/articles/ArticleGrid";

const Home = () => {
  const { articles } = useArticles();
  
  // Filter articles by category
  const latestNews = articles
    .filter(article => article.category === "أخبار")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
    
  const politicsNews = articles
    .filter(article => article.category === "سياسة")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
    
  const economyNews = articles
    .filter(article => article.category === "اقتصاد")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  return (
    <div className="container mx-auto py-6">
      {/* Featured Articles */}
      <FeaturedArticles />
      
      {/* Latest News */}
      <ArticleGrid articles={latestNews} title="أحدث الأخبار" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Politics News */}
        <div>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-news-accent">
            السياسة
          </h2>
          <div className="space-y-4">
            {politicsNews.map((article) => (
              <div key={article.id} className="border-b pb-4 last:border-0">
                <h3 className="text-lg font-bold mb-1">{article.title}</h3>
                <p className="text-gray-600 mb-2">{article.excerpt}</p>
                <span className="text-gray-500 text-sm">{article.date}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Economy News */}
        <div>
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 border-news-accent">
            الاقتصاد
          </h2>
          <div className="space-y-4">
            {economyNews.map((article) => (
              <div key={article.id} className="border-b pb-4 last:border-0">
                <h3 className="text-lg font-bold mb-1">{article.title}</h3>
                <p className="text-gray-600 mb-2">{article.excerpt}</p>
                <span className="text-gray-500 text-sm">{article.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
