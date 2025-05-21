
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../../context/ArticleContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const AdminNewArticle = () => {
  const navigate = useNavigate();
  const { addArticle } = useArticles();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("https://placehold.co/600x400/news-accent/white?text=المصدر+بلس");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !category) {
      toast.error("الرجاء ملء جميع الحقول الإلزامية");
      return;
    }
    
    setIsLoading(true);
    
    const newArticle = {
      id: Date.now().toString(),
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      image,
      category,
      date: new Date().toISOString().split("T")[0],
      featured,
      videoUrl: videoUrl || undefined
    };
    
    setTimeout(() => {
      addArticle(newArticle);
      setIsLoading(false);
      toast.success("تم إضافة المقال بنجاح");
      navigate("/admin/articles");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إضافة مقال جديد</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  عنوان المقال <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="أدخل عنوان المقال"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    القسم <span className="text-red-500">*</span>
                  </label>
                  <Select value={category} onValueChange={setCategory} required>
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
                  <label className="block mb-2 text-sm font-medium">
                    رابط الصورة
                  </label>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="أدخل رابط صورة المقال"
                  />
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  مقتطف المقال
                </label>
                <Input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="أدخل مقتطف المقال (اختياري)"
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  محتوى المقال <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب محتوى المقال هنا"
                  rows={10}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium">
                  رابط الفيديو (اختياري)
                </label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="أدخل رابط الفيديو (اختياري)"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked as boolean)}
                />
                <label 
                  htmlFor="featured" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-2"
                >
                  عرض في القسم المميز
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate("/admin/articles")}
                  className="ml-2"
                >
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  className="bg-news-accent hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "جاري الحفظ..." : "نشر المقال"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AdminNewArticle;
