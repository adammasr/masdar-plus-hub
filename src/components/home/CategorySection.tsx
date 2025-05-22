
import { Link } from "react-router-dom";
import { Article } from "../../context/ArticleContext";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategorySectionProps {
  title: string;
  icon: LucideIcon;
  articles: Article[];
  linkPath: string;
}

const CategorySection = ({ title, icon: Icon, articles, linkPath }: CategorySectionProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
          <h2 className="text-2xl font-bold flex items-center">
            <Icon size={22} />
            <span className="mr-2">{title}</span>
          </h2>
          <Link
            to={linkPath}
            className="text-news-accent hover:underline text-sm font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="space-y-4">
          {articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0"
              >
                <Link to={`/news/${article.id}`} className="block group">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-news-accent transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-xs">
                      {new Date(article.date).toLocaleDateString("ar-EG")}
                    </span>
                    {article.source && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {article.source}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              لا توجد أخبار {title.toLowerCase()} حالياً
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySection;
