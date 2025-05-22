
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FacebookPage } from "../../../types/facebook";
import FacebookPageList from "./FacebookPageList";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateFacebookArticles } from "../../../hooks/useSimulateSources";
import { toast } from "sonner";

// تاريخ بداية سحب الأخبار (21 مايو 2025)
const startSyncDate = new Date('2025-05-21T00:00:00');

// حماية مكون فيسبوك: السماح فقط لمن لديه isAdmin = "true"
const isAdmin = () => {
  return window?.localStorage?.getItem("isAdmin") === "true";
};

const FacebookSection = () => {
  // منع غير الأدمن من الدخول (حماية واجهة فقط)
  if (!isAdmin()) {
    return (
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            صفحات فيسبوك
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-red-600 font-bold">
            ليس لديك صلاحية الوصول إلى لوحة التحكم.
          </div>
        </CardContent>
      </Card>
    );
  }

  // استرجاع الصفحات المحفوظة من localStorage
  const getSavedFacebookPages = (): FacebookPage[] => {
    try {
      const savedPages = localStorage.getItem('facebookPages');
      if (savedPages) {
        return JSON.parse(savedPages);
      }
    } catch (e) {
      console.error("خطأ في استرجاع بيانات صفحات فيسبوك:", e);
    }
    
    // صفحات افتراضية إذا لم توجد صفحات محفوظة
    return [
      {
        id: "1",
        name: "وزارة الداخلية",
        url: "https://www.facebook.com/MoiEgy",
        autoUpdate: true,
        lastUpdated: new Date().toISOString()
      },
      {
        id: "2",
        name: "وزارة الصحة والسكان المصرية",
        url: "https://www.facebook.com/egypt.mohp",
        autoUpdate: true,
        lastUpdated: new Date().toISOString()
      }
    ];
  };

  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>(getSavedFacebookPages());
  const [isLoading, setIsLoading] = useState(false);
  const [autoSync, setAutoSync] = useState(() => {
    const savedAutoSync = localStorage.getItem('facebookAutoSync');
    return savedAutoSync ? savedAutoSync === 'true' : true;
  });
  const { addBatchArticles } = useArticles();
  const { simulateFacebookArticles } = useSimulateFacebookArticles();

  // حفظ الصفحات والإعدادات عند تغييرها
  useEffect(() => {
    localStorage.setItem('facebookPages', JSON.stringify(facebookPages));
    localStorage.setItem('facebookAutoSync', String(autoSync));
  }, [facebookPages, autoSync]);

  const handleSyncAllPages = async () => {
    if (facebookPages.length === 0) {
      toast.info("لا توجد صفحات مضافة للمزامنة");
      return;
    }
    
    setIsLoading(true);
    
    try {
      let totalArticlesCount = 0;
      
      for (const page of facebookPages) {
        const articles = await simulateFacebookArticles(page.name);
        
        // Filter articles to only include those from startSyncDate or newer
        const filteredArticles = articles.filter(article =>
          new Date(article.date) >= startSyncDate
        );
        
        if (filteredArticles.length > 0) {
          addBatchArticles(filteredArticles);
          totalArticlesCount += filteredArticles.length;
          
          // Update last synced time
          setFacebookPages(prev => prev.map(p =>
            p.id === page.id ? { ...p, lastUpdated: new Date().toISOString() } : p
          ));
        }
      }
      
      if (totalArticlesCount > 0) {
        toast.success(`تم مزامنة ${totalArticlesCount} منشورات من جميع الصفحات (بداية من ${startSyncDate.toLocaleDateString('ar-EG')})`);
      } else {
        toast.info(`لم يتم العثور على منشورات جديدة منذ ${startSyncDate.toLocaleDateString('ar-EG')}`);
      }
    } catch (error) {
      console.error("Error syncing all Facebook pages:", error);
      toast.error("حدث خطأ أثناء مزامنة الصفحات");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-2 border-gray-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              صفحات فيسبوك
            </CardTitle>
            <CardDescription>
              مزامنة المنشورات من صفحات فيسبوك الرسمية (بداية من {startSyncDate.toLocaleDateString('ar-EG')})
            </CardDescription>
          </div>
          <Button
            onClick={handleSyncAllPages}
            disabled={isLoading || facebookPages.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            مزامنة جميع الصفحات
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <FacebookPageList
          facebookPages={facebookPages}
          setFacebookPages={setFacebookPages}
          autoSync={autoSync}
          setAutoSync={setAutoSync}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startSyncDate={startSyncDate}
        />
      </CardContent>
    </Card>
  );
};

export default FacebookSection;
