
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Plus, Save, Eye } from 'lucide-react';

interface AdData {
  id: string;
  position: 'header' | 'sidebar' | 'article' | 'footer';
  type: 'image' | 'text' | 'html';
  title?: string;
  description?: string;
  url?: string;
  link?: string;
  buttonText?: string;
  html?: string;
  active: boolean;
}

const AdminAds = () => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [newAd, setNewAd] = useState<Partial<AdData>>({
    position: 'header',
    type: 'image',
    active: true
  });
  const [isEditing, setIsEditing] = useState<string | null>(null);

  // تحميل الإعلانات عند بدء التطبيق
  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = () => {
    try {
      const savedAds = localStorage.getItem('websiteAds');
      if (savedAds) {
        setAds(JSON.parse(savedAds));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعلانات:', error);
    }
  };

  const saveAds = (updatedAds: AdData[]) => {
    try {
      localStorage.setItem('websiteAds', JSON.stringify(updatedAds));
      
      // تحديث إعلانات الموقع
      const siteAds: Record<string, any> = {};
      updatedAds.forEach(ad => {
        if (ad.active) {
          siteAds[ad.position] = ad;
        }
      });
      localStorage.setItem('siteAds', JSON.stringify(siteAds));
      
      setAds(updatedAds);
      toast.success('تم حفظ الإعلانات بنجاح');
    } catch (error) {
      console.error('خطأ في حفظ الإعلانات:', error);
      toast.error('فشل في حفظ الإعلانات');
    }
  };

  const addAd = () => {
    if (!newAd.position || !newAd.type) {
      toast.error('الرجاء اختيار الموضع ونوع الإعلان');
      return;
    }

    const ad: AdData = {
      id: Date.now().toString(),
      position: newAd.position as AdData['position'],
      type: newAd.type as AdData['type'],
      title: newAd.title || '',
      description: newAd.description || '',
      url: newAd.url || '',
      link: newAd.link || '',
      buttonText: newAd.buttonText || '',
      html: newAd.html || '',
      active: true
    };

    const updatedAds = [...ads, ad];
    saveAds(updatedAds);
    
    // إعادة تعيين النموذج
    setNewAd({
      position: 'header',
      type: 'image',
      active: true
    });
  };

  const updateAd = (id: string, updates: Partial<AdData>) => {
    const updatedAds = ads.map(ad => 
      ad.id === id ? { ...ad, ...updates } : ad
    );
    saveAds(updatedAds);
  };

  const deleteAd = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      const updatedAds = ads.filter(ad => ad.id !== id);
      saveAds(updatedAds);
    }
  };

  const toggleAdStatus = (id: string) => {
    const ad = ads.find(a => a.id === id);
    if (ad) {
      updateAd(id, { active: !ad.active });
    }
  };

  const getPositionName = (position: string) => {
    const names = {
      header: 'أعلى الصفحة',
      sidebar: 'الشريط الجانبي',
      article: 'بين الأخبار',
      footer: 'أسفل الصفحة'
    };
    return names[position as keyof typeof names] || position;
  };

  const renderAdForm = (ad: Partial<AdData>, isNew: boolean = false) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {isNew ? 'إضافة إعلان جديد' : 'تعديل الإعلان'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">الموضع</label>
            <Select 
              value={ad.position} 
              onValueChange={(value) => 
                isNew 
                  ? setNewAd({ ...newAd, position: value as AdData['position'] })
                  : updateAd(ad.id!, { position: value as AdData['position'] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الموضع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="header">أعلى الصفحة</SelectItem>
                <SelectItem value="sidebar">الشريط الجانبي</SelectItem>
                <SelectItem value="article">بين الأخبار</SelectItem>
                <SelectItem value="footer">أسفل الصفحة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">نوع الإعلان</label>
            <Select 
              value={ad.type} 
              onValueChange={(value) => 
                isNew 
                  ? setNewAd({ ...newAd, type: value as AdData['type'] })
                  : updateAd(ad.id!, { type: value as AdData['type'] })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">صورة</SelectItem>
                <SelectItem value="text">نص</SelectItem>
                <SelectItem value="html">HTML مخصص</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">العنوان</label>
          <Input
            value={ad.title || ''}
            onChange={(e) => 
              isNew 
                ? setNewAd({ ...newAd, title: e.target.value })
                : updateAd(ad.id!, { title: e.target.value })
            }
            placeholder="عنوان الإعلان"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الوصف</label>
          <Textarea
            value={ad.description || ''}
            onChange={(e) => 
              isNew 
                ? setNewAd({ ...newAd, description: e.target.value })
                : updateAd(ad.id!, { description: e.target.value })
            }
            placeholder="وصف الإعلان"
            rows={3}
          />
        </div>

        {ad.type === 'image' && (
          <div>
            <label className="block text-sm font-medium mb-2">رابط الصورة</label>
            <Input
              value={ad.url || ''}
              onChange={(e) => 
                isNew 
                  ? setNewAd({ ...newAd, url: e.target.value })
                  : updateAd(ad.id!, { url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {ad.type === 'html' && (
          <div>
            <label className="block text-sm font-medium mb-2">كود HTML</label>
            <Textarea
              value={ad.html || ''}
              onChange={(e) => 
                isNew 
                  ? setNewAd({ ...newAd, html: e.target.value })
                  : updateAd(ad.id!, { html: e.target.value })
              }
              placeholder="<div>كود HTML مخصص</div>"
              rows={5}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">رابط الإعلان</label>
          <Input
            value={ad.link || ''}
            onChange={(e) => 
              isNew 
                ? setNewAd({ ...newAd, link: e.target.value })
                : updateAd(ad.id!, { link: e.target.value })
            }
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">نص الزر</label>
          <Input
            value={ad.buttonText || ''}
            onChange={(e) => 
              isNew 
                ? setNewAd({ ...newAd, buttonText: e.target.value })
                : updateAd(ad.id!, { buttonText: e.target.value })
            }
            placeholder="اقرأ المزيد"
          />
        </div>

        <div className="flex gap-2">
          {isNew ? (
            <Button onClick={addAd} className="bg-green-500 hover:bg-green-600">
              <Plus size={16} className="ml-2" />
              إضافة الإعلان
            </Button>
          ) : (
            <Button 
              onClick={() => setIsEditing(null)} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Save size={16} className="ml-2" />
              حفظ التعديلات
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة الإعلانات</h1>
        <div className="text-sm text-gray-500">
          إجمالي الإعلانات: {ads.length} | النشطة: {ads.filter(ad => ad.active).length}
        </div>
      </div>

      {/* نموذج إضافة إعلان جديد */}
      {renderAdForm(newAd, true)}

      {/* قائمة الإعلانات الحالية */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">الإعلانات الحالية</h2>
        
        {ads.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">لا توجد إعلانات محفوظة</p>
            </CardContent>
          </Card>
        ) : (
          ads.map(ad => (
            <Card key={ad.id} className={`${!ad.active ? 'opacity-50' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ad.title || 'إعلان بدون عنوان'}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {getPositionName(ad.position)} - {ad.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={ad.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAdStatus(ad.id)}
                    >
                      <Eye size={16} />
                      {ad.active ? 'مفعل' : 'معطل'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(isEditing === ad.id ? null : ad.id)}
                    >
                      تعديل
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {isEditing === ad.id && (
                <CardContent>
                  {renderAdForm(ad)}
                </CardContent>
              )}
              
              {isEditing !== ad.id && (
                <CardContent>
                  <div className="space-y-2">
                    {ad.description && (
                      <p className="text-gray-700">{ad.description}</p>
                    )}
                    {ad.url && (
                      <p className="text-sm text-blue-600">صورة: {ad.url}</p>
                    )}
                    {ad.link && (
                      <p className="text-sm text-green-600">رابط: {ad.link}</p>
                    )}
                    {ad.html && (
                      <p className="text-sm text-purple-600">HTML مخصص محدد</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAds;
