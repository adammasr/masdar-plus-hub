import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Videos = () => {
  const { articles } = useArticles();
  
  const videoArticles = articles
    .filter(article => article.videoUrl)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Featured video (if available)
  const featuredVideo = videoArticles.length > 0 ? videoArticles[0] : null;
  // Rest of the videos
  const restOfVideos = videoArticles.slice(1);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Video className="ml-2 text-news-accent" />
          فيديوهات
        </h1>
        <p className="text-gray-600">
          أحدث مقاطع الفيديو والتقارير المصورة
        </p>
      </div>
      
      {/* Featured Video */}
      {featuredVideo && (
        <div className="bg-white rounded-lg overflow-hidden shadow-md mb-8">
          <div className="relative aspect-video">
            <img 
              src={featuredVideo.image} 
              alt={featuredVideo.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button className="bg-news-accent hover:bg-red-700 text-white rounded-full h-16 w-16 flex items-center justify-center">
                <Play className="h-8 w-8" />
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-2">
              <span className="bg-news-accent/10 text-news-accent text-xs py-1 px-2 rounded-full">
                فيديو مميز
              </span>
              <span className="mr-2 text-gray-500 text-sm">
                {formatDate(featuredVideo.date)}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-4">{featuredVideo.title}</h2>
            <p className="text-gray-600">{featuredVideo.excerpt}</p>
            
            <Button className="mt-4 bg-news-accent hover:bg-red-700">
              <Play className="ml-2 h-4 w-4" />
              مشاهدة الفيديو
            </Button>
          </div>
        </div>
      )}
      
      {/* Rest of Videos */}
      <ArticleGrid articles={restOfVideos} title="أحدث الفيديوهات" />
    </div>
  );
};

export default Videos;
