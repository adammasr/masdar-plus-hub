
import { useArticles } from "../context/ArticleContext";
import FeaturedArticles from "../components/articles/FeaturedArticles";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Article } from "../context/ArticleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Newspaper, TrendingUp, PieChart, Video } from "lucide-react";

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
    .slice(0, 4);
    
  const economyNews = articles
    .filter(article => article.category === "اقتصاد")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
    
  const videoArticles = articles
    .filter(article => article.videoUrl)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const CategoryNewsItem = ({ article }: { article: Article }) => (
    <div className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
      <Link to="#" className="block group">
        <h3 className="text-lg font-bold mb-1 group-hover:text-news-accent transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-600 mb-2 text-sm line-clamp-2">{article.excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-xs">{formatDate(article.date)}</span>
          {article.source && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {article.source}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
  
  const SectionTitle = ({ icon, title, linkTo }: { icon: React.ReactNode, title: string, linkTo: string }) => (
    <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
      <h2 className="text-2xl font-bold flex items-center">
        {icon}
        <span className="mr-2">{title}</span>
      </h2>
      <Link to={linkTo} className="text-news-accent hover:underline text-sm font-medium">
        عرض الكل
      </Link>
    </div>
  );
  
  return (
    <div className="container mx-auto py-6">
      {/* Featured Articles */}
      <FeaturedArticles />
      
      {/* Latest News */}
      <div className="mb-10">
        <SectionTitle 
          icon={<Newspaper size={24} />} 
          title="أحدث الأخبار" 
          linkTo="/news" 
        />
        <ArticleGrid articles={latestNews} title="" initialLimit={6} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Politics News */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <SectionTitle 
                icon={<TrendingUp size={22} />} 
                title="السياسة" 
                linkTo="/politics" 
              />
              <div className="space-y-4">
                {politicsNews.length > 0 ? (
                  politicsNews.map((article) => (
                    <CategoryNewsItem key={article.id} article={article} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد أخبار سياسية حالياً</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Economy News */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <SectionTitle 
                icon={<PieChart size={22} />} 
                title="الاقتصاد" 
                linkTo="/economy" 
              />
              <div className="space-y-4">
                {economyNews.length > 0 ? (
                  economyNews.map((article) => (
                    <CategoryNewsItem key={article.id} article={article} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد أخبار اقتصادية حالياً</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Video Section */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6">
              <SectionTitle 
                icon={<Video size={22} />} 
                title="فيديوهات" 
                linkTo="/videos" 
              />
              <div className="space-y-6">
                {videoArticles.length > 0 ? (
                  videoArticles.map((article) => (
                    <div key={article.id} className="relative group">
                      <div className="relative">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <div className="bg-news-accent/80 rounded-full p-3 group-hover:scale-110 transition-transform">
                            <Play className="text-white" size={24} />
                          </div>
                        </div>
                      </div>
                      <h3 className="mt-2 font-bold group-hover:text-news-accent transition-colors">{article.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(article.date)}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد فيديوهات حالياً</p>
                )}
                
                <div className="text-center pt-2">
                  <Link 
                    to="/videos"
                    className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm transition-colors w-full"
                  >
                    مشاهدة المزيد من الفيديوهات
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
