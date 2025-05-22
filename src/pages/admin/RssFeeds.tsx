
import { useState, useEffect } from "react";
import RssFeedManager from "../../components/admin/RssFeedManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, Settings, Calendar, Clock, Alarm } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useArticles } from "../../context/ArticleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AdminRssFeeds = () => {
  const { toast } = useToast();
  const { articles } = useArticles();
  const [autoImportEnabled, setAutoImportEnabled] = useState(true);
  const [lastImportTime, setLastImportTime] = useState<string | null>(null);
  const [syncInterval, setSyncInterval] = useState("60"); // الفترة بين عمليات التحديث التلقائي بالدقائق (افتراضي: 60 دقيقة)
  const [nextSyncTime, setNextSyncTime] = useState<Date | null>(null);
  
  // تاريخ بداية سحب الأخبار (21 مايو 2025)
  const startSyncDate = new Date('2025-05-21T00:00:00');
  
  // حفظ إعدادات التحديث التلقائي في localStorage
  useEffect(() => {
    const savedAutoImport = localStorage.getItem('rssAutoImport');
    const savedSyncInterval = localStorage.getItem('rssSyncInterval');
    
    if (savedAutoImport) {
      setAutoImportEnabled(savedAutoImport === 'true');
    }
    
    if (savedSyncInterval) {
      setSyncInterval(savedSyncInterval);
    }
  }, []);
  
  // حفظ الإعدادات عند تغييرها
  useEffect(() => {
    localStorage.setItem('rssAutoImport', autoImportEnabled.toString());
    localStorage.setItem('rssSyncInterval', syncInterval);
  }, [autoImportEnabled, syncInterval]);
  
  // تنفيذ المزامنة التلقائية بناءً على الفاصل الزمني المحدد
  useEffect(() => {
    if (!autoImportEnabled) return;
    
    const now = new Date();
    setLastImportTime(now.toISOString());
    
    // حساب وقت المزامنة التالي
    const nextSync = new Date(now.getTime() + parseInt(syncInterval) * 60 * 1000);
    setNextSyncTime(nextSync);
    
    const autoSyncFeeds = () => {
      const now = new Date();
      console.log(`[${now.toLocaleTimeString()}] تنفيذ المزامنة التلقائية لخلاصات RSS`);
      setLastImportTime(now.toISOString());
      
      toast({
        title: "تحديث تلقائي",
        description: `تم تحديث الأخبار تلقائيًا من جميع المصادر (بدءًا من ${startSyncDate.toLocaleDateString('ar-EG')})`,
        duration: 5000,
      });
      
      // حساب وقت المزامنة التالي
      const nextSync = new Date(now.getTime() + parseInt(syncInterval) * 60 * 1000);
      setNextSyncTime(nextSync);
      
      // إرسال حدث خاص للتنبيه بالتحديث
      const syncEvent = new CustomEvent('rssAutoSync', { detail: { timestamp: now.toISOString() } });
      window.dispatchEvent(syncEvent);
    };
    
    // تنفيذ أول مزامنة عند تفعيل التحديث التلقائي
    autoSyncFeeds();
    
    // إعداد مؤقت للمزامنة الدورية
    const intervalId = setInterval(autoSyncFeeds, parseInt(syncInterval) * 60 * 1000);
    
    // تنظيف عند إلغاء تحميل المكون
    return () => clearInterval(intervalId);
    
  }, [autoImportEnabled, syncInterval, toast, startSyncDate]);
  
  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "لم يتم التحديث بعد";
    
    const date = new Date(dateString);
    return date.toLocaleString('ar-EG', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // تنسيق وقت المزامنة القادمة
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

  // تبديل حالة التحديث التلقائي
  const toggleAutoImport = () => {
    setAutoImportEnabled(!autoImportEnabled);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة خلاصات RSS</h1>
        <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-800 ml-2">التحديث التلقائي:</span>
              <Button 
                variant={autoImportEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAutoImport}
                className={autoImportEnabled ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {autoImportEnabled ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 ml-1" /> مفعل
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 ml-1" /> معطل
                  </>
                )}
              </Button>
            </div>
            
            {autoImportEnabled && (
              <>
                <div className="mr-4 flex items-center gap-2">
                  <Label htmlFor="rss-sync-interval" className="text-sm whitespace-nowrap text-blue-800">
                    كل:
                  </Label>
                  <Select
                    value={syncInterval}
                    onValueChange={setSyncInterval}
                  >
                    <SelectTrigger id="rss-sync-interval" className="w-[110px] text-sm border-blue-200 focus:ring-blue-300 bg-white">
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
                
                {nextSyncTime && (
                  <div className="text-sm flex items-center gap-1 text-blue-800">
                    <Alarm className="h-4 w-4 text-blue-600" />
                    <span>التحديث التالي: {formatNextSyncTime()}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Date Filter Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Calendar className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800">تاريخ بداية سحب الأخبار</AlertTitle>
        <AlertDescription className="text-blue-700">
          يتم سحب الأخبار الجديدة فقط بدءًا من تاريخ {startSyncDate.toLocaleDateString('ar-EG')}
        </AlertDescription>
      </Alert>
      
      {lastImportTime && (
        <Alert className="bg-green-50 border-green-200">
          <Clock className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">آخر تحديث تلقائي</AlertTitle>
          <AlertDescription className="text-green-700">
            تم آخر تحديث تلقائي للأخبار في {formatDateTime(lastImportTime)}
            {autoImportEnabled && nextSyncTime && (
              <span className="block mt-1">
                التحديث التالي: {formatNextSyncTime()}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>إحصائيات الأخبار</CardTitle>
          <CardDescription>نظرة عامة على مصادر الأخبار والمقالات</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {articles.filter(article => new Date(article.date) >= startSyncDate).length}
              </div>
              <div className="text-gray-500">إجمالي المقالات</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {new Set(articles.filter(a => new Date(a.date) >= startSyncDate).map(a => a.source).filter(Boolean)).size}
              </div>
              <div className="text-gray-500">المصادر</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {articles.filter(a => a.category === "أخبار" && new Date(a.date) >= startSyncDate).length}
              </div>
              <div className="text-gray-500">أخبار</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {articles.filter(a => a.videoUrl && new Date(a.date) >= startSyncDate).length}
              </div>
              <div className="text-gray-500">فيديوهات</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-gray-500">
        أضف وإدارة خلاصات RSS لاستيراد الأخبار تلقائيًا من مصادر مختلفة. يتم معالجة الأخبار وإعادة صياغتها باستخدام الذكاء الاصطناعي ليلائم أسلوب موقعك.
      </p>
      
      <RssFeedManager autoSyncEnabled={autoImportEnabled} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>إعدادات إضافية</CardTitle>
          <CardDescription>تخصيص كيفية معالجة المقالات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium">إعادة صياغة تلقائية</h3>
              <p className="text-sm text-gray-500">استخدام الذكاء الاصطناعي لإعادة صياغة المقالات تلقائيًا</p>
            </div>
            <Button variant="default" className="bg-news-accent hover:bg-red-700">مفعل</Button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium">استخراج الصور</h3>
              <p className="text-sm text-gray-500">استخراج الصور تلقائيًا من المقالات</p>
            </div>
            <Button variant="default" className="bg-news-accent hover:bg-red-700">مفعل</Button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-medium">تصنيف تلقائي</h3>
              <p className="text-sm text-gray-500">تصنيف المقالات تلقائيًا بناءً على المحتوى</p>
            </div>
            <Button variant="default" className="bg-news-accent hover:bg-red-700">مفعل</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRssFeeds;
