import { useEffect, useMemo } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleCard from "../components/articles/ArticleCard";
import { GraduationCap } from "lucide-react";

const Education = () => {
  const { articles } = useArticles();

  const educationNews = useMemo(
    () =>
      articles
        .filter((a) => a.category === "جامعات وتعليم")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [articles]
  );

  useEffect(() => {
    document.title = "التعليم والجامعات | مصدر بلس";
  }, []);

  return (
    <div className="container mx-auto py-6 px-2">
      <div className="flex items-center mb-6">
        <GraduationCap className="w-8 h-8 text-indigo-600 ml-3" />
        <h1 className="text-3xl font-bold text-gray-900">أخبار التعليم والجامعات</h1>
      </div>

      {educationNews.length === 0 ? (
        <div className="text-center py-12">
          <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">لا توجد أخبار تعليمية متاحة حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educationNews.map((article) => (
            <ArticleCard key={article.id} article={article} detailUrl={`/news/${article.id}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
