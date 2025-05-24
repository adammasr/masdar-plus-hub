
import { Article } from "@/context/ArticleContext";
import { Star } from "lucide-react";
import ArticleActions from "./ArticleActions";

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const ArticleTable = ({ 
  articles, 
  onEdit, 
  onDelete, 
  onToggleFeatured 
}: ArticleTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-right">
        <thead className="bg-gray-50 text-xs uppercase">
          <tr>
            <th className="px-4 py-3">العنوان</th>
            <th className="px-4 py-3">القسم</th>
            <th className="px-4 py-3">التاريخ</th>
            <th className="px-4 py-3">المصدر</th>
            <th className="px-4 py-3">الحالة</th>
            <th className="px-4 py-3">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4">لا توجد مقالات مطابقة</td>
            </tr>
          ) : (
            articles.map((article) => (
              <tr key={article.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-4 font-medium max-w-xs">
                  <div className="truncate" title={article.title}>
                    {article.title}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {article.category}
                  </span>
                </td>
                <td className="px-4 py-4">{article.date}</td>
                <td className="px-4 py-4">
                  <span className="text-xs text-gray-600">
                    {article.source || "محرر يدويًا"}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {article.featured && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1">
                        <Star size={12} /> مميز
                      </span>
                    )}
                    {article.videoUrl && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        فيديو
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <ArticleActions
                    article={article}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleFeatured={onToggleFeatured}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleTable;
