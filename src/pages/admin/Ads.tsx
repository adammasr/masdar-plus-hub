
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Ad } from "../../components/ads/types";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ImagePlus, Plus, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";

const defaultAd: Ad = {
  id: "",
  title: "",
  imageUrl: "",
  linkUrl: "",
  position: "header",
  isActive: true
};

const AdsManager = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAd, setCurrentAd] = useState<Ad>(defaultAd);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // استرجاع الإعلانات من التخزين المحلي
  useEffect(() => {
    const savedAds = localStorage.getItem("siteAds");
    if (savedAds) {
      setAds(JSON.parse(savedAds));
    } else {
      // إنشاء إعلانات افتراضية إذا لم تكن موجودة
      const defaultAds = [
        {
          id: "1",
          title: "إعلان الصفحة الرئيسية",
          imageUrl: "https://via.placeholder.com/728x90?text=الصفحة+الرئيسية",
          linkUrl: "https://masdarplus.com",
          position: "header",
          isActive: true
        },
        {
          id: "2",
          title: "إعلان الأخبار",
          imageUrl: "https://via.placeholder.com/300x250?text=إعلان+الأخبار",
          linkUrl: "https://masdarplus.com/news",
          position: "sidebar",
          isActive: true
        }
      ];
      setAds(defaultAds);
      localStorage.setItem("siteAds", JSON.stringify(defaultAds));
    }
  }, []);

  // حفظ الإعلانات في التخزين المحلي
  const saveAds = (newAds: Ad[]) => {
    setAds(newAds);
    localStorage.setItem("siteAds", JSON.stringify(newAds));
  };

  const handleAddAd = () => {
    setCurrentAd({
      ...defaultAd,
      id: crypto.randomUUID()
    });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const handleEditAd = (ad: Ad) => {
    setCurrentAd(ad);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleDeleteAd = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      const newAds = ads.filter((ad) => ad.id !== id);
      saveAds(newAds);
      toast.success("تم حذف الإعلان بنجاح");
    }
  };

  const handleToggleStatus = (id: string) => {
    const newAds = ads.map((ad) => 
      ad.id === id ? { ...ad, isActive: !ad.isActive } : ad
    );
    saveAds(newAds);
    toast.success(`تم ${newAds.find(a => a.id === id)?.isActive ? 'تفعيل' : 'إلغاء تفعيل'} الإعلان`);
  };

  const handleSaveAd = () => {
    if (!currentAd.title) {
      toast.error("يرجى إدخال عنوان الإعلان");
      return;
    }

    let newAds: Ad[];
    if (isEditing) {
      newAds = ads.map((ad) => (ad.id === currentAd.id ? currentAd : ad));
    } else {
      newAds = [...ads, currentAd];
    }

    saveAds(newAds);
    setDialogOpen(false);
    toast.success(`تم ${isEditing ? 'تعديل' : 'إضافة'} الإعلان بنجاح`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentAd((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setCurrentAd((prev) => ({ ...prev, isActive: checked }));
  };

  const positions = [
    { value: "header", label: "أعلى الصفحة" },
    { value: "sidebar", label: "الشريط الجانبي" },
    { value: "article", label: "داخل المقالات" },
    { value: "footer", label: "أسفل الصفحة" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الإعلانات</h1>
        <Button onClick={handleAddAd} className="bg-news-accent hover:bg-red-700">
          <Plus className="ml-2" size={16} />
          إضافة إعلان جديد
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">قائمة الإعلانات</CardTitle>
        </CardHeader>
        <CardContent>
          {ads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا توجد إعلانات مضافة. اضغط على "إضافة إعلان جديد" لإضافة إعلان.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">العنوان</TableHead>
                    <TableHead className="text-right">الموقع</TableHead>
                    <TableHead className="text-right">الصورة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <Switch
                          checked={ad.isActive}
                          onCheckedChange={() => handleToggleStatus(ad.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{ad.title}</TableCell>
                      <TableCell>
                        {positions.find(p => p.value === ad.position)?.label || ad.position}
                      </TableCell>
                      <TableCell>
                        {ad.imageUrl ? (
                          <img
                            src={ad.imageUrl}
                            alt={ad.title}
                            className="h-10 w-20 object-contain rounded border"
                          />
                        ) : (
                          <span className="text-gray-400">لا توجد صورة</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAd(ad)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAd(ad.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "تعديل إعلان" : "إضافة إعلان جديد"}</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الإعلان أدناه ثم اضغط على حفظ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان الإعلان</Label>
              <Input
                id="title"
                name="title"
                value={currentAd.title}
                onChange={handleChange}
                placeholder="أدخل عنوان الإعلان"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">رابط الصورة</Label>
              <div className="flex gap-2">
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={currentAd.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <Button variant="outline" size="icon">
                  <ImagePlus className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">رابط الإعلان</Label>
              <Input
                id="linkUrl"
                name="linkUrl"
                value={currentAd.linkUrl}
                onChange={handleChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">موقع الإعلان</Label>
              <select
                id="position"
                name="position"
                value={currentAd.position}
                onChange={(e) => setCurrentAd(prev => ({ ...prev, position: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="isActive"
                checked={currentAd.isActive}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="isActive" className="mr-2">تفعيل الإعلان</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="ml-2">
              إلغاء
            </Button>
            <Button onClick={handleSaveAd} className="bg-news-accent hover:bg-red-700">
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdsManager;
