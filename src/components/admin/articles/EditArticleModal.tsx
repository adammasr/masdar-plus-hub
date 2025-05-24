
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Article } from "@/context/ArticleContext";

interface EditArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Partial<Article>) => void;
}

const EditArticleModal = ({ 
  article, 
  isOpen, 
  onClose, 
  onSave 
}: EditArticleModalProps) => {
  const [editForm, setEditForm] = useState<Partial<Article>>({});

  useEffect(() => {
    if (article) {
      setEditForm(article);
    }
  }, [article]);

  const handleSave = () => {
    if (editForm.title && editForm.content && editForm.category) {
      onSave(editForm);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              onClick={onClose}
              className="ml-2"
            >
              إلغاء
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-news-accent hover:bg-red-700"
            >
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditArticleModal;
