
import { Link } from "react-router-dom";
import { Article } from "../../context/ArticleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Play } from "lucide-react";

interface VideoSectionProps {
  videoArticles: Article[];
}

const VideoSection = ({ videoArticles }: VideoSectionProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
          <h2 className="text-2xl font-bold flex items-center">
            <Video size={22} />
            <span className="mr-2">فيديوهات</span>
          </h2>
          <Link
            to="/videos"
            className="text-news-accent hover:underline text-sm font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="space-y-6">
          {videoArticles.length > 0 ? (
            videoArticles.map((article) => (
              <div key={article.id} className="relative group">
                <Link to={`/news/${article.id}`}>
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
                  <h3 className="mt-2 font-bold group-hover:text-news-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(article.date).toLocaleDateString("ar-EG")}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              لا توجد فيديوهات حالياً
            </p>
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
  );
};

export default VideoSection;
