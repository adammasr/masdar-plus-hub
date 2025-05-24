
import { useState, useEffect } from "react";
import { AutoSyncService } from "../../services/AutoSyncService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle, AlertCircle, Clock, TrendingUp, Database } from "lucide-react";
import { toast } from "sonner";

const AutoSyncStatus = () => {
  const [config, setConfig] = useState(AutoSyncService.getInstance().getConfig());
  const [lastSync, setLastSync] = useState<string | null>(
    localStorage.getItem('lastAutoSync')
  );
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [articleStats, setArticleStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0
  });

  useEffect(() => {
    const updateStats = () => {
      const articles = JSON.parse(localStorage.getItem('articles') || '[]');
      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      setArticleStats({
        total: articles.length,
        today: articles.filter((a: any) => a.date === today).length,
        thisWeek: articles.filter((a: any) => new Date(a.date) >= weekAgo).length
      });
    };

    updateStats();

    const handleArticlesUpdate = (event: any) => {
      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('lastAutoSync', now);
      updateStats();
      
      if (event.detail?.newCount > 0) {
        toast.success(`تم إضافة ${event.detail.newCount} مقال جديد`, {
          description: "تم تحديث الموقع تلقائياً",
        });
      }
    };

    window.addEventListener('articlesUpdated', handleArticlesUpdate);
    
    return () => {
      window.removeEventListener('articlesUpdated', handleArticlesUpdate);
    };
  }, []);

  const handleConfigChange = (newConfig: any) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    AutoSyncService.getInstance().updateConfig(updatedConfig);
    
    toast.success('تم تحديث إعدادات المزامنة');
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setSyncProgress(0);
    
    // محاكاة تقدم المزامنة
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);

    try {
      AutoSyncService.getInstance().manualSync();
      
      setTimeout(() => {
        const now = new Date().toISOString();
        setLastSync(now);
        localStorage.setItem('lastAutoSync', now);
        
        clearInterval(progressInterval);
        setSyncProgress(100);
        
        toast.success('تم تحديث الأخبار يدوياً بنجاح');
      }, 3000);
      
    } catch (error) {
      clearInterval(progressInterval);
      toast.error('فشل في تحديث الأخبار');
    } finally {
      setTimeout(() => {
        setIsManualSyncing(false);
        setSyncProgress(0);
      }, 3500);
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return 'لم يتم التحديث بعد';
    
    const date = new Date(lastSync);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'منذ أقل من دقيقة';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `منذ ${diffDays} يوم`;
  };

  const getNextSyncTime = () => {
    if (!config.enabled || !lastSync) return 'غير محدد';
    
    const lastSyncDate = new Date(lastSync);
    const nextSync = new Date(lastSyncDate.getTime() + config.interval * 60 * 1000);
    const now = new Date();
    
    if (nextSync <= now) return 'الآن';
    
    const diffMs = nextSync.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `بعد ${diffMins} دقيقة`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `بعد ${hours} ساعة ${mins > 0 ? `و ${mins} دقيقة` : ''}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            حالة المزامنة التلقائية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* حالة المزامنة */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">المزامنة التلقائية</span>
            <div className="flex items-center gap-2">
              <Switch
                checked={config.enabled}
                onCheckedChange={(enabled) => handleConfigChange({ enabled })}
              />
              <Badge variant={config.enabled ? "default" : "secondary"}>
                {config.enabled ? "مفعلة" : "معطلة"}
              </Badge>
            </div>
          </div>

          {/* فترة المزامنة */}
          {config.enabled && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">فترة التحديث</span>
              <Select
                value={config.interval.toString()}
                onValueChange={(value) => handleConfigChange({ interval: parseInt(value) })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 دقائق</SelectItem>
                  <SelectItem value="10">10 دقائق</SelectItem>
                  <SelectItem value="15">15 دقيقة</SelectItem>
                  <SelectItem value="30">30 دقيقة</SelectItem>
                  <SelectItem value="60">ساعة واحدة</SelectItem>
                  <SelectItem value="120">ساعتان</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* المصادر */}
          <div className="space-y-2">
            <span className="text-sm font-medium">المصادر المفعلة:</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={config.sources.rss}
                  onCheckedChange={(rss) => 
                    handleConfigChange({ sources: { ...config.sources, rss } })
                  }
                />
                RSS Feeds
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={config.sources.facebook}
                  onCheckedChange={(facebook) => 
                    handleConfigChange({ sources: { ...config.sources, facebook } })
                  }
                />
                صفحات فيسبوك
              </label>
            </div>
          </div>

          {/* شريط التقدم أثناء المزامنة */}
          {isManualSyncing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>جاري المزامنة...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          )}

          {/* آخر تحديث */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">آخر تحديث: {formatLastSync()}</span>
              </div>
              {config.enabled && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-600">التحديث التالي: {getNextSyncTime()}</span>
                </div>
              )}
            </div>
            <Button
              size="sm"
              onClick={handleManualSync}
              disabled={isManualSyncing}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isManualSyncing ? 'animate-spin' : ''}`} />
              {isManualSyncing ? 'جاري التحديث...' : 'تحديث يدوي'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات المقالات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            إحصائيات المقالات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{articleStats.total}</div>
              <div className="text-sm text-blue-600">إجمالي المقالات</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{articleStats.today}</div>
              <div className="text-sm text-green-600">اليوم</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{articleStats.thisWeek}</div>
              <div className="text-sm text-purple-600">هذا الأسبوع</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoSyncStatus;
