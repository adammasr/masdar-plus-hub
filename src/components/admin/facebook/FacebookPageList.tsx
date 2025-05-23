
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, RefreshCw, ExternalLink, Clock } from "lucide-react";
import { FacebookPage } from "../../../types/facebook";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateFacebookArticles } from "../../../hooks/useSimulateSources";
import { toast } from "sonner";

interface FacebookPageListProps {
  facebookPages: FacebookPage[];
  setFacebookPages: (pages: FacebookPage[]) => void;
  autoSync: boolean;
  setAutoSync: (auto: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  startSyncDate: Date;
}

const FacebookPageList = ({ 
  facebookPages, 
  setFacebookPages, 
  autoSync, 
  setAutoSync, 
  isLoading, 
  setIsLoading,
  startSyncDate 
}: FacebookPageListProps) => {
  const [newPageName, setNewPageName] = useState("");
  const [newPageUrl, setNewPageUrl] = useState("");
  const { addBatchArticles } = useArticles();
  const { simulateFacebookArticles } = useSimulateFacebookArticles();

  const addFacebookPage = () => {
    if (!newPageName.trim() || !newPageUrl.trim()) {
      toast.error("الرجاء إدخال اسم الصفحة والرابط");
      return;
    }

    const newPage: FacebookPage = {
      id: crypto.randomUUID(),
      name: newPageName.trim(),
      url: newPageUrl.trim(),
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    };

    setFacebookPages([...facebookPages, newPage]);
    setNewPageName("");
    setNewPageUrl("");
    toast.success("تم إضافة الصفحة بنجاح");
  };

  const deletePage = (pageId: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الصفحة؟")) {
      setFacebookPages(facebookPages.filter(page => page.id !== pageId));
      toast.success("تم حذف الصفحة بنجاح");
    }
  };

  const syncSinglePage = async (page: FacebookPage) => {
    setIsLoading(true);
    try {
      const articles = await simulateFacebookArticles(page.name);
      
      // Filter articles to only include those from startSyncDate or newer
      const filteredArticles = articles.filter(article =>
        new Date(article.date) >= startSyncDate
      );
      
      if (filteredArticles.length > 0) {
        // تحديث المقالات في الموقع
        addBatchArticles(filteredArticles);
        
        // Update last synced time
        setFacebookPages(prev => prev.map(p =>
          p.id === page.id ? { ...p, lastUpdated: new Date().toISOString() } : p
        ));
        
        toast.success(`تم مزامنة ${filteredArticles.length} منشورات من ${page.name} وإضافتها للموقع`);
      } else {
        toast.info(`لم يتم العثور على منشورات جديدة من ${page.name} منذ ${startSyncDate.toLocaleDateString('ar-EG')}`);
      }
    } catch (error) {
      console.error("Error syncing Facebook page:", error);
      toast.error(`حدث خطأ أثناء مزامنة ${page.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePageAutoUpdate = (pageId: string) => {
    setFacebookPages(prev => prev.map(page =>
      page.id === pageId ? { ...page, autoUpdate: !page.autoUpdate } : page
    ));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Add new page form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">إضافة صفحة جديدة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="page-name">اسم الصفحة</Label>
              <Input
                id="page-name"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="مثال: وزارة الداخلية"
              />
            </div>
            <div>
              <Label htmlFor="page-url">رابط الصفحة</Label>
              <Input
                id="page-url"
                value={newPageUrl}
                onChange={(e) => setNewPageUrl(e.target.value)}
                placeholder="https://www.facebook.com/..."
              />
            </div>
          </div>
          <Button onClick={addFacebookPage} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 ml-2" />
            إضافة الصفحة
          </Button>
        </CardContent>
      </Card>

      {/* Auto sync settings */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-sync" className="text-base font-medium">
                المزامنة التلقائية لجميع الصفحات
              </Label>
              <p className="text-sm text-gray-500 mt-1">
                تفعيل المزامنة التلقائية لجلب المنشورات الجديدة من جميع الصفحات
              </p>
            </div>
            <Switch
              id="auto-sync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pages list */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">الصفحات المضافة ({facebookPages.length})</h3>
        
        {facebookPages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              لا توجد صفحات مضافة حالياً
            </CardContent>
          </Card>
        ) : (
          facebookPages.map((page) => (
            <Card key={page.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-lg">{page.name}</h4>
                      <Badge variant={page.autoUpdate ? "default" : "secondary"}>
                        {page.autoUpdate ? "تلقائي" : "يدوي"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <ExternalLink className="h-4 w-4 ml-1" />
                      <a 
                        href={page.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 truncate max-w-xs"
                      >
                        {page.url}
                      </a>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 ml-1" />
                      <span>آخر مزامنة: {formatDateTime(page.lastUpdated)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePageAutoUpdate(page.id)}
                      title={page.autoUpdate ? "إيقاف التحديث التلقائي" : "تفعيل التحديث التلقائي"}
                    >
                      {page.autoUpdate ? "إيقاف" : "تفعيل"}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => syncSinglePage(page)}
                      disabled={isLoading}
                      title="مزامنة الآن"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePage(page.id)}
                      title="حذف الصفحة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FacebookPageList;
