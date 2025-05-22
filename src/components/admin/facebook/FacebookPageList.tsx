
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, RefreshCw, ExternalLink, Clock, Alarm } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FacebookPage } from "../../../types/facebook";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateFacebookArticles } from "../../../hooks/useSimulateSources";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FacebookPageListProps {
  facebookPages: FacebookPage[];
  setFacebookPages: React.Dispatch<React.SetStateAction<FacebookPage[]>>;
  autoSync: boolean;
  setAutoSync: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  startSyncDate: Date;
}

// حماية مكون قائمة صفحات فيسبوك: السماح فقط لمن لديه isAdmin = "true"
const isAdmin = () => {
  return window?.localStorage?.getItem("isAdmin") === "true";
};

const FacebookPageList = ({
  facebookPages,
  setFacebookPages,
  autoSync,
  setAutoSync,
  isLoading,
  setIsLoading,
  startSyncDate
}: FacebookPageListProps) => {
  // منع غير الأدمن من الدخول (حماية واجهة فقط)
  if (!isAdmin()) {
    return (
      <div className="text-center py-16 text-red-600 font-bold">
        ليس لديك صلاحية الوصول إلى لوحة التحكم.
      </div>
    );
  }

  const [newPageName, setNewPageName] = useState("");
  const [newPageUrl, setNewPageUrl] = useState("");
  const { addBatchArticles } = useArticles();
  const { simulateFacebookArticles } = useSimulateFacebookArticles();
  const [syncInterval, setSyncInterval] = useState("60"); // الفترة بين عمليات التحديث التلقائي بالدقائق (افتراضي: 60 دقيقة)
  const [lastAutoSyncTime, setLastAutoSyncTime] = useState<Date | null>(null);
  const [nextSyncTime, setNextSyncTime] = useState<Date | null>(null);

  // Function to simulate fetching from Facebook page
  const handleFacebookPageSync = async (pageId: string) => {
    setIsLoading(true);

    try {
      const page = facebookPages.find(p => p.id === pageId);
      if (!page) throw new Error("الصفحة غير موجودة");

      // Simulate fetching posts with respect to the startSyncDate
      const articles = await simulateFacebookArticles(page.name);

      // Filter articles to only include those from startSyncDate or newer
      const filteredArticles = articles.filter(article =>
        new Date(article.date) >= startSyncDate
      );

      if (filteredArticles.length > 0) {
        addBatchArticles(filteredArticles);

        // Update last synced time
        setFacebookPages(prev => prev.map(p =>
          p.id === pageId ? { ...p, lastUpdated: new Date().toISOString() } : p
        ));

        toast.success(`تم مزامنة ${filteredArticles.length} منشورات من ${page.name} (بداية من ${startSyncDate.toLocaleDateString('ar-EG')})`);
      } else {
        toast.info(`لم يتم العثور على منشورات جديدة من ${page.name} منذ ${startSyncDate.toLocaleDateString('ar-EG')}`);
      }
    } catch (error) {
      console.error("Error syncing Facebook page:", error);
      toast.error("حدث خطأ أثناء مزامنة الصفحة");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add new Facebook page
  const handleAddFacebookPage = () => {
    if (!newPageName || !newPageUrl) {
      toast.error("الرجاء إدخال اسم ورابط الصفحة");
      return;
    }

    const newPage = {
      id: Date.now().toString(),
      name: newPageName,
      url: newPageUrl,
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    };

    setFacebookPages([...facebookPages, newPage]);
    setNewPageName("");
    setNewPageUrl("");
    toast.success("تمت إضافة الصفحة بنجاح");
  };

  // Function to remove Facebook page
  const handleRemoveFacebookPage = (id: string) => {
    setFacebookPages(facebookPages.filter(page => page.id !== id));
    toast.success("تم حذف الصفحة بنجاح");
  };

  // Function to toggle auto-sync for Facebook page
  const togglePageAutoSync = (pageId: string) => {
    setFacebookPages(prev => prev.map(page =>
      page.id === pageId ? { ...page, autoUpdate: !page.autoUpdate } : page
    ));
  };

  // Function to format date string
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // إضافة تأثير لجدولة عمليات التحديث التلقائي بناءً على الفاصل الزمني المُحدد
  useEffect(() => {
    if (!autoSync) return;
    
    const now = new Date();
    setLastAutoSyncTime(now);
    
    // حساب وقت المزامنة التالي
    const nextSync = new Date(now.getTime() + parseInt(syncInterval) * 60 * 1000);
    setNextSyncTime(nextSync);
    
    const syncPages = async () => {
      const pagesToSync = facebookPages.filter(page => page.autoUpdate);
      
      if (pagesToSync.length > 0) {
        console.log(`[${new Date().toLocaleTimeString()}] بدء المزامنة التلقائية لـ ${pagesToSync.length} صفحات فيسبوك`);
        
        for (const page of pagesToSync) {
          try {
            const articles = await simulateFacebookArticles(page.name);
            
            // Filter articles to only include those from startSyncDate or newer
            const filteredArticles = articles.filter(article =>
              new Date(article.date) >= startSyncDate
            );
            
            if (filteredArticles.length > 0) {
              addBatchArticles(filteredArticles);
              
              // Update last synced time
              setFacebookPages(prev => prev.map(p =>
                p.id === page.id ? { ...p, lastUpdated: new Date().toISOString() } : p
              ));
              
              console.log(`[${new Date().toLocaleTimeString()}] تم مزامنة ${filteredArticles.length} منشورات من ${page.name}`);
            }
          } catch (error) {
            console.error(`خطأ في مزامنة صفحة ${page.name}:`, error);
          }
        }
        
        const currentTime = new Date();
        setLastAutoSyncTime(currentTime);
        
        // تحديث وقت المزامنة التالي
        const nextSyncTime = new Date(currentTime.getTime() + parseInt(syncInterval) * 60 * 1000);
        setNextSyncTime(nextSyncTime);
        
        toast.success(`تم تحديث ${pagesToSync.length} صفحات فيسبوك تلقائيًا`);
      }
    };
    
    // تشغيل المزامنة مباشرة عند التنشيط الأول
    syncPages();
    
    // إعداد مؤقت للمزامنة الدورية
    const intervalId = setInterval(syncPages, parseInt(syncInterval) * 60 * 1000);
    
    // تنظيف عند إلغاء تحميل المكون
    return () => clearInterval(intervalId);
  }, [autoSync, syncInterval, facebookPages, simulateFacebookArticles, addBatchArticles, startSyncDate]);
  
  // تنسيق وعرض وقت المزامنة القادمة
  const formatNextSyncTime = () => {
    if (!nextSyncTime) return "غير محدد";
    
    // حساب الوقت المتبقي
    const now = new Date();
    const diffMs = nextSyncTime.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins <= 0) return "قريبًا";
    
    if (diffMins < 60) {
      return `بعد ${diffMins} دقيقة`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `بعد ${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Page Form */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <h3 className="text-sm font-medium mb-3">إضافة صفحة جديدة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="اسم الصفحة"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
          />
          <Input
            placeholder="رابط الصفحة"
            value={newPageUrl}
            onChange={(e) => setNewPageUrl(e.target.value)}
            className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
          />
        </div>
        <Button
          onClick={handleAddFacebookPage}
          className="bg-blue-600 hover:bg-blue-700 mt-3"
        >
          إضافة صفحة
        </Button>
      </div>

      {/* Auto-Sync Toggle and Settings */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">الصفحات المضافة</h3>
          <Badge variant="outline" className="bg-gray-100">
            {facebookPages.length}
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Switch
              id="auto-sync"
              checked={autoSync}
              onCheckedChange={setAutoSync}
            />
            <Label htmlFor="auto-sync" className="text-sm font-medium mr-2 flex items-center gap-1 text-blue-800">
              <Clock className="h-4 w-4 text-blue-600" />
              مزامنة تلقائية
            </Label>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="sync-interval" className="text-sm whitespace-nowrap text-blue-800">
              كل:
            </Label>
            <Select
              value={syncInterval}
              onValueChange={setSyncInterval}
              disabled={!autoSync}
            >
              <SelectTrigger id="sync-interval" className="w-[110px] text-sm border-blue-200 focus:ring-blue-300 bg-white">
                <SelectValue placeholder="اختر الفترة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 دقيقة</SelectItem>
                <SelectItem value="30">30 دقيقة</SelectItem>
                <SelectItem value="60">ساعة</SelectItem>
                <SelectItem value="120">ساعتين</SelectItem>
                <SelectItem value="360">6 ساعات</SelectItem>
                <SelectItem value="720">12 ساعة</SelectItem>
                <SelectItem value="1440">يوميًا</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {autoSync && nextSyncTime && (
            <div className="text-sm flex items-center gap-1 text-blue-800">
              <Alarm className="h-4 w-4 text-blue-600" />
              <span>التحديث التالي: {formatNextSyncTime()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Facebook Pages List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {facebookPages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{page.name}</p>
                {page.autoUpdate && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                    مزامنة تلقائية
                  </Badge>
                )}
              </div>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
              >
                <ExternalLink className="h-3 w-3" />
                {page.url}
              </a>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                آخر تحديث: {formatLastUpdated(page.lastUpdated)}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center space-x-2 space-x-reverse ml-2">
                <Switch
                  id={`page-auto-${page.id}`}
                  checked={!!page.autoUpdate}
                  onCheckedChange={() => togglePageAutoSync(page.id)}
                  className="data-[state=checked]:bg-blue-600"
                />
                <Label htmlFor={`page-auto-${page.id}`} className="sr-only">
                  مزامنة تلقائية
                </Label>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleFacebookPageSync(page.id)}
                disabled={isLoading}
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
                مزامنة
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRemoveFacebookPage(page.id)}
                className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none"
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacebookPageList;
