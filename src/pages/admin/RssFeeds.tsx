
import { useState, useEffect } from "react";
import RssFeedManager from "../../components/admin/RssFeedManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useArticles } from "../../context/ArticleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminRssFeeds = () => {
  const { toast } = useToast();
  const { articles } = useArticles();
  const [autoImportEnabled, setAutoImportEnabled] = useState(true);
  const [lastImportTime, setLastImportTime] = useState<string | null>(null);
  
  // Simulate auto import on component mount
  useEffect(() => {
    if (autoImportEnabled) {
      const now = new Date();
      setLastImportTime(now.toISOString());
      
      toast({
        title: "تحديث تلقائي",
        description: "تم تحديث الأخبار تلقائيًا من جميع المصادر",
        duration: 5000,
      });
    }
    
    // Set up interval for auto-import (every hour in a real app)
    const interval = setInterval(() => {
      if (autoImportEnabled) {
        const now = new Date();
        setLastImportTime(now.toISOString());
        
        toast({
          title: "تحديث تلقائي",
          description: "تم تحديث الأخبار تلقائيًا من جميع المصادر",
          duration: 5000,
        });
      }
    }, 3600000); // Every hour
    
    return () => clearInterval(interval);
  }, [autoImportEnabled, toast]);
  
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة خلاصات RSS</h1>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 ml-2">التحديث التلقائي:</span>
          <Button 
            variant={autoImportEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoImportEnabled(!autoImportEnabled)}
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
      </div>
      
      {lastImportTime && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-5 w-5 text-blue-600" />
          <AlertTitle className="text-blue-800">آخر تحديث تلقائي</AlertTitle>
          <AlertDescription className="text-blue-700">
            تم آخر تحديث تلقائي للأخبار في {formatDateTime(lastImportTime)}
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
              <div className="text-3xl font-bold text-gray-800">{articles.length}</div>
              <div className="text-gray-500">إجمالي المقالات</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {new Set(articles.map(a => a.source).filter(Boolean)).size}
              </div>
              <div className="text-gray-500">المصادر</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {articles.filter(a => a.category === "أخبار").length}
              </div>
              <div className="text-gray-500">أخبار</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
              <div className="text-3xl font-bold text-gray-800">
                {articles.filter(a => a.videoUrl).length}
              </div>
              <div className="text-gray-500">فيديوهات</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-gray-500">
        أضف وإدارة خلاصات RSS لاستيراد الأخبار تلقائيًا من مصادر مختلفة. يتم معالجة الأخبار وإعادة صياغتها باستخدام الذكاء الاصطناعي ليلائم أسلوب موقعك.
      </p>
      
      <RssFeedManager />
      
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
