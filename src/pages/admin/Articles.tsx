
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Plus, RefreshCw } from "lucide-react";
import ArticleSearch from "../../components/admin/articles/ArticleSearch";
import ArticleStatistics from "../../components/admin/articles/ArticleStatistics";
import ArticleTable from "../../components/admin/articles/ArticleTable";
import EditArticleModal from "../../components/admin/articles/EditArticleModal";

const AdminArticles = () => {
  const { articles, deleteArticle, updateArticle } = useArticles();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const handleDeleteArticle = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      deleteArticle(id);
      toast.success("تم حذف المقال بنجاح");
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedArticle: Partial<Article>) => {
    if (editingArticle && updatedArticle.title && updatedArticle.content && updatedArticle.category) {
      const finalArticle = {
        ...editingArticle,
        ...updatedArticle,
        date: updatedArticle.date || new Date().toISOString().split('T')[0]
      };
      
      updateArticle(editingArticle.id, finalArticle);
      toast.success("تم تحديث المقال بنجاح");
      setEditingArticle(null);
    } else {
      toast.error("الرجاء ملء جميع الحقول الإلزامية");
    }
  };

  const toggleFeatured = (id: string, featured: boolean) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      updateArticle(id, { ...article, featured: !featured });
      toast.success(`تم ${!featured ? 'إضافة' : 'إزالة'} المقال ${!featured ? 'إلى' : 'من'} القسم المميز`);
    }
  };

  const handleRefreshArticles = () => {
    window.location.reload();
  };
  
  const filteredArticles = articles.filter(article => 
    article.title.includes(searchTerm) || 
    article.content.includes(searchTerm) ||
    article.category.includes(searchTerm) ||
    (article.source && article.source.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المقالات</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshArticles}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} />
            تحديث
          </Button>
          <Link to="/admin/articles/new">
            <Button className="bg-news-accent hover:bg-red-700">
              <Plus className="ml-2" size={16} />
              مقال جديد
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <ArticleSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        
        <ArticleStatistics articles={articles} />
        
        <ArticleTable
          articles={filteredArticles}
          onEdit={handleEditArticle}
          onDelete={handleDeleteArticle}
          onToggleFeatured={toggleFeatured}
        />
      </div>

      <EditArticleModal
        article={editingArticle}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default AdminArticles;
