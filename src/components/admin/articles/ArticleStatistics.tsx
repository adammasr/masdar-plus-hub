
import { Article } from "@/context/ArticleContext";

interface ArticleStatisticsProps {
  articles: Article[];
}

const ArticleStatistics = ({ articles }: ArticleStatisticsProps) => {
  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-sm text-blue-800">
        <strong>إجمالي المقالات:</strong> {articles.length} | 
        <strong> المميزة:</strong> {articles.filter(a => a.featured).length} | 
        <strong> لها فيديو:</strong> {articles.filter(a => a.videoUrl).length}
      </p>
    </div>
  );
};

export default ArticleStatistics;
