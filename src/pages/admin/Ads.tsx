import { useState, useEffect } from "react";
import { PlusCircle, X, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Ad, AdPosition } from "@/components/ads/types";
import { mockAds } from "@/data/ads";

const AdPositionLabels: Record<AdPosition, string> = {
  "header": "أعلى الصفحة",
  "footer": "أسفل الصفحة",
  "sidebar": "الشريط الجانبي",
  "article": "داخل المقالات",
  "before-content": "قبل المحتوى",
  "after-content": "بعد المحتوى",
  "between-featured": "بين المقالات المميزة",
  "sidebar-top": "أعلى الشريط الجانبي",
  "sidebar-bottom": "أسفل الشريط الجانبي"
};

const Ads = () => {
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [currentAd, setCurrentAd] = useState<Ad>({
    id: "",
    title: "",
    imageUrl: "",
    linkUrl: "",
    position: "header",
    isActive: true
  });

  // Load ads from localStorage on component mount
  useEffect(() => {
    const savedAds = localStorage.getItem("masdar_plus_ads");
    if (savedAds) {
      try {
        setAds(JSON.parse(savedAds));
      } catch (error) {
        console.error("Error parsing ads from localStorage:", error);
      }
    }
  }, []);

  // Save ads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("masdar_plus_ads", JSON.stringify(ads));
  }, [ads]);

  // Create or update ad
  const handleSaveAd = () => {
    if (!currentAd.title || !currentAd.position) {
      toast.error("الرجاء إدخال العنوان والموضع على الأقل");
      return;
    }

    if (editingAd) {
      // Update existing ad
      setAds(ads.map(ad => (ad.id === editingAd.id ? { ...currentAd, id: editingAd.id } : ad)));
      toast.success("تم تحديث الإعلان بنجاح");
    } else {
      // Create new ad
      const newAd: Ad = {
        ...currentAd,
        id: crypto.randomUUID()
      };
      setAds([...ads, newAd]);
      toast.success("تم إضافة الإعلان بنجاح");
    }

    setIsModalOpen(false);
    setEditingAd(null);
    resetAdForm();
  };

  // Delete ad
  const handleDeleteAd = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      setAds(ads.filter(ad => ad.id !== id));
      toast.success("تم حذف الإعلان بنجاح");
    }
  };

  // Toggle ad status
  const toggleAdStatus = (id: string) => {
    setAds(ads.map(ad => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    ));
    toast.success("تم تغيير حالة الإعلان بنجاح");
  };

  // Open modal for editing
  const openEditModal = (ad: Ad) => {
    setEditingAd(ad);
    setCurrentAd({ ...ad });
    setIsModalOpen(true);
  };

  // Open modal for creating
  const openCreateModal = () => {
    setEditingAd(null);
    resetAdForm();
    setIsModalOpen(true);
  };

  // Reset form values
  const resetAdForm = () => {
    setCurrentAd({
      id: "",
      title: "",
      imageUrl: "",
      linkUrl: "",
      position: "header" as AdPosition,
      isActive: true
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">إدارة الإعلانات</h1>
        <Button onClick={openCreateModal}>
          <PlusCircle className="ml-2" /> إضافة إعلان جديد
        </Button>
      </div>

      {ads.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">لا توجد إعلانات حالياً</p>
            <Button onClick={openCreateModal}>إضافة إعلان جديد</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map(ad => (
            <Card key={ad.id} className={`overflow-hidden ${!ad.isActive ? 'opacity-60' : ''}`}>
              <div className="relative h-40 bg-gray-100">
                {ad.imageUrl ? (
                  <img 
                    src={ad.imageUrl} 
                    alt={ad.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    لا توجد صورة
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg font-medium">{ad.title}</CardTitle>
                  <div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => toggleAdStatus(ad.id)}
                    >
                      {ad.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">الموضع: </span>
                    <span className="font-medium">{AdPositionLabels[ad.position]}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">الحالة: </span>
                    <span className={`font-medium ${ad.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {ad.isActive ? 'نشط' : 'غير نشط'}
                    </span>
                  </div>
                  <div className="flex space-x-2 justify-end pt-2 ml-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditModal(ad)}
                      className="space-x-1 space-x-reverse"
                    >
                      <Edit2 size={16} />
                      <span>تعديل</span>
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteAd(ad.id)}
                      className="space-x-1 space-x-reverse"
                    >
                      <Trash2 size={16} />
                      <span>حذف</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAd ? 'تحرير الإعلان' : 'إضافة إعلان جديد'}</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الإعلان أدناه
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الإعلان</Label>
              <Input
                id="title"
                value={currentAd.title}
                onChange={(e) => setCurrentAd(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط الصورة</Label>
              <Input
                id="imageUrl"
                value={currentAd.imageUrl || ''}
                onChange={(e) => setCurrentAd(prev => ({ ...prev, imageUrl: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkUrl">رابط الإعلان</Label>
              <Input
                id="linkUrl"
                value={currentAd.linkUrl || ''}
                onChange={(e) => setCurrentAd(prev => ({ ...prev, linkUrl: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">موضع الإعلان</Label>
              <select
                id="position"
                value={currentAd.position}
                onChange={(e) => setCurrentAd(prev => ({ ...prev, position: e.target.value as AdPosition }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.entries(AdPositionLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch 
                id="isActive" 
                checked={currentAd.isActive}
                onCheckedChange={(checked) => setCurrentAd(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive" className="mr-2">الإعلان نشط</Label>
            </div>
            
            <div className="flex justify-end space-x-2 space-x-reverse pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSaveAd}>
                {editingAd ? 'تحديث' : 'إضافة'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ads;
