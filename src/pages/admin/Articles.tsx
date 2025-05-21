
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Trash2, Edit, Search, Plus } from "lucide-react";

const AdminArticles = () => {
  const { articles, deleteArticle } = useArticles();
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleDeleteArticle = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      deleteArticle(id);
      toast.success("تم حذف المقال بنجاح");
    }
  };
  
  const filteredArticles = articles.filter(article => 
    article.title.includes(searchTerm) || 
    article.content.includes(searchTerm) ||
    article.category.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المقالات</h1>
        <Link to="/admin/articles/new">
          <Button className="bg-news-accent hover:bg-red-700">
            <Plus className="ml-2" size={16} />
            مقال جديد
          </Button>
        </Link>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center border rounded-md overflow-hidden mb-4">
          <Search size={20} className="mx-2 text-gray-400" />
          <Input
            type="text"
            placeholder="بحث عن مقال..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">العنوان</th>
                <th className="px-6 py-3">القسم</th>
                <th className="px-6 py-3">التاريخ</th>
                <th className="px-6 py-3">المصدر</th>
                <th className="px-6 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">لا توجد مقالات مطابقة</td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b">
                    <td className="px-6 py-4 font-medium">{article.title}</td>
                    <td className="px-6 py-4">{article.category}</td>
                    <td className="px-6 py-4">{article.date}</td>
                    <td className="px-6 py-4">{article.source || "محرر يدويًا"}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminArticles;
