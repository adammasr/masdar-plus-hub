
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Edit, Save, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "أخبار", slug: "news" },
    { id: "2", name: "سياسة", slug: "politics" },
    { id: "3", name: "اقتصاد", slug: "economy" },
    { id: "4", name: "فيديوهات", slug: "videos" },
    { id: "5", name: "رياضة", slug: "sports" },
    { id: "6", name: "تكنولوجيا", slug: "technology" }
  ]);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = () => {
    if (!newCategoryName) {
      toast.error("الرجاء إدخال اسم القسم");
      return;
    }
    
    const newSlug = newCategoryName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
      
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      slug: newSlug
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    toast.success("تم إضافة القسم بنجاح");
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا القسم؟")) {
      setCategories(categories.filter(category => category.id !== id));
      toast.success("تم حذف القسم بنجاح");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    
    setCategories(categories.map(category => 
      category.id === editingCategory.id ? editingCategory : category
    ));
    
    setEditingCategory(null);
    toast.success("تم تحديث القسم بنجاح");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إدارة الأقسام</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>إضافة قسم جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="اسم القسم الجديد"
            />
            <Button
              onClick={handleAddCategory}
              className="bg-news-accent hover:bg-red-700"
            >
              إضافة
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>الأقسام الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد أقسام</p>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between border p-3 rounded-md"
                >
                  {editingCategory?.id === category.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleSaveEdit}>
                          <Save size={16} />
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{category.name}</p>
                        <p className="text-sm text-gray-500">/{category.slug}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={["أخبار", "سياسة", "اقتصاد", "فيديوهات"].includes(category.name)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCategories;
