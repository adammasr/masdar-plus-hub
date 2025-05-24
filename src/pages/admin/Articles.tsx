
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Trash2, Edit, Search, Plus, Eye, Star, RefreshCw } from "lucide-react";

const AdminArticles = () => {
  const { articles, deleteArticle, updateArticle, addArticle } = useArticles();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Article>>({});
  
  const handleDeleteArticle = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      deleteArticle(id);
      toast.success("تم حذف المقال بنجاح");
    }
  };

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article);
    setEditForm(article);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingArticle && editForm.title && editForm.content && editForm.category) {
      const updatedArticle = {
        ...editingArticle,
        ...editForm,
        date: editForm.date || new Date().toISOString().split('T')[0]
      };
      
      updateArticle(editingArticle.id, updatedArticle);
      toast.success("تم تحديث المقال بنجاح");
      setIsEditModalOpen(false);
      setEditingArticle(null);
      setEditForm({});
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
    // تحديث قائمة المقالات من localStorage
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
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>إجمالي المقالات:</strong> {articles.length} | 
            <strong> المميزة:</strong> {articles.filter(a => a.featured).length} | 
            <strong> لها فيديو:</strong> {articles.filter(a => a.videoUrl).length}
          </p>
        </div>
        
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
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">لا توجد مقالات مطابقة</td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
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
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleFeatured(article.id, article.featured)}
                          title={article.featured ? "إزالة من المميز" : "إضافة للمميز"}
                        >
                          <Star size={14} className={article.featured ? "fill-yellow-400 text-yellow-400" : ""} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditArticle(article)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteArticle(article.id)}
                        >
                          <Trash2 size={14} />
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

      {/* مودال تحرير المقال */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تحرير المقال</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="block mb-2 text-sm font-medium">عنوان المقال</label>
              <Input
                value={editForm.title || ''}
                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                placeholder="عنوان المقال"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">القسم</label>
                <Select 
                  value={editForm.category || ''} 
                  onValueChange={(value) => setEditForm({...editForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="أخبار">أخبار</SelectItem>
                    <SelectItem value="سياسة">سياسة</SelectItem>
                    <SelectItem value="اقتصاد">اقتصاد</SelectItem>
                    <SelectItem value="فيديوهات">فيديوهات</SelectItem>
                    <SelectItem value="رياضة">رياضة</SelectItem>
                    <SelectItem value="تكنولوجيا">تكنولوجيا</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">رابط الصورة</label>
                <Input
                  value={editForm.image || ''}
                  onChange={(e) => setEditForm({...editForm, image: e.target.value})}
                  placeholder="رابط الصورة"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">المقتطف</label>
              <Input
                value={editForm.excerpt || ''}
                onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                placeholder="مقتطف المقال"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">محتوى المقال</label>
              <Textarea
                value={editForm.content || ''}
                onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                placeholder="محتوى المقال"
                rows={6}
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">رابط الفيديو (اختياري)</label>
              <Input
                value={editForm.videoUrl || ''}
                onChange={(e) => setEditForm({...editForm, videoUrl: e.target.value})}
                placeholder="رابط الفيديو"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="editFeatured" 
                checked={editForm.featured || false}
                onCheckedChange={(checked) => setEditForm({...editForm, featured: checked as boolean})}
              />
              <label htmlFor="editFeatured" className="text-sm font-medium mr-2">
                عرض في القسم المميز
              </label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={handleSaveEdit}
                className="bg-news-accent hover:bg-red-700"
              >
                حفظ التغييرات
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticles;
