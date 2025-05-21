import { useState } from "react";
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

// حماية مكون فيسبوك: الظهور فقط للمستخدم adammasr
const isAdmin = () => {
  return window?.localStorage?.getItem("username") === "adammasr" || (window as any).currentUser === "adammasr";
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

  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([
    { id: "1", name: "المتحدث الرسمي للرئاسة", url: "https://www.facebook.com/example1", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "2", name: "القاهرة الإخبارية", url: "https://www.facebook.com/example2", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "3", name: "مجلس الوزراء المصري", url: "https://www.facebook.com/example3", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "4", name: "وزارة الداخلية", url: "https://www.facebook.com/MoiEgy", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "5", name: "المتحدث العسكري للقوات المسلحة", url: "https://www.facebook.com/EgyArmySpox", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "6", name: "وزارة المالية", url: "https://www.facebook.com/MOF.Egypt", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "7", name: "وزارة النقل", url: "https://www.facebook.com/MinistryTransportation", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "8", name: "وزارة الإسكان", url: "https://www.facebook.com/profile.php?id=100064535599158", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "9", name: "وزارة التضامن الاجتماعي", url: "https://www.facebook.com/MoSS.Egypt", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "10", name: "وزارة التربية والتعليم", url: "https://www.facebook.com/egypt.moe", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "11", name: "وزارة الصحة", url: "https://www.facebook.com/egypt.mohp", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "12", name: "وزارة التخطيط", url: "https://www.facebook.com/EgyptMOP", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "13", name: "إكسترا نيوز", url: "https://www.facebook.com/extranewstv", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "14", name: "محافظة القاهرة", url: "https://www.facebook.com/Cairo.Governorate", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "15", name: "محافظة الإسكندرية", url: "https://www.facebook.com/alexandria.gov.eg", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "16", name: "الإسكندرية", url: "https://www.facebook.com/Alex.Gov.Eg", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "17", name: "محافظة القليوبية", url: "https://www.facebook.com/qalyubiya.gov.org", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "18", name: "محافظة المنوفية", url: "https://www.facebook.com/monofeya.gov.eg", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "19", name: "محافظة الوادي الجديد", url: "https://www.facebook.com/wadycom", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "20", name: "محافظة دمياط", url: "https://www.facebook.com/Domyat.governorate", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "21", name: "محافظة المنيا", url: "https://www.facebook.com/minia.gov.eg", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "22", name: "مركز المعلومات ودعم اتخاذ القرار", url: "https://www.facebook.com/idsc.gov.eg", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "23", name: "وزارة الاتصالات", url: "https://www.facebook.com/profile.php?id=100069296826007", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "24", name: "وكالة الشرق الأوسط", url: "https://www.facebook.com/MENAArabic", autoUpdate: true, lastUpdated: new Date().toISOString() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const { addBatchArticles } = useArticles();
  const { simulateFacebookArticles } = useSimulateFacebookArticles();

  // Function to sync all Facebook pages
  const handleSyncAllPages = async () => {
    setIsLoading(true);

    try {
      const enabledPages = facebookPages.filter(page => page.autoUpdate);
      let totalSyncedArticles = 0;

      for (const page of enabledPages) {
        // For each page, get articles and filter by date
        const articles = await simulateFacebookArticles(page.name);
        const filteredArticles = articles.filter(article =>
          new Date(article.date) >= startSyncDate
        );

        if (filteredArticles.length > 0) {
          addBatchArticles(filteredArticles);
          totalSyncedArticles += filteredArticles.length;

          // Update last synced time
          setFacebookPages(prev => prev.map(p =>
            p.id === page.id ? { ...p, lastUpdated: new Date().toISOString() } : p
          ));
        }
      }

      if (totalSyncedArticles > 0) {
        toast.success(`تم مزامنة ${totalSyncedArticles} منشور من ${enabledPages.length} صفحة`);
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
            disabled={isLoading}
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
