
import { useState, useEffect } from "react";
import { AutoSyncService } from "../../services/AutoSyncService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

const AutoSyncStatus = () => {
  const [config, setConfig] = useState(AutoSyncService.getInstance().getConfig());
  const [lastSync, setLastSync] = useState<string | null>(
    localStorage.getItem('lastAutoSync')
  );
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    const handleArticlesUpdate = () => {
      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('lastAutoSync', now);
    };

    window.addEventListener('articlesUpdated', handleArticlesUpdate);
    return () => window.removeEventListener('articlesUpdated', handleArticlesUpdate);
  }, []);

  const handleConfigChange = (newConfig: any) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    AutoSyncService.getInstance().updateConfig(updatedConfig);
  };

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    try {
      // محاكاة المزامنة اليدوية
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const now = new Date().toISOString();
      setLastSync(now);
      localStorage.setItem('lastAutoSync', now);
      
      window.dispatchEvent(new CustomEvent('articlesUpdated'));
      
      toast.success('تم تحديث الأخبار بنجاح');
    } catch (error) {
      toast.error('فشل في تحديث الأخبار');
    } finally {
      setIsManualSyncing(false);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          حالة المزامنة التلقائية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
                <SelectItem value="15">15 دقيقة</SelectItem>
                <SelectItem value="30">30 دقيقة</SelectItem>
                <SelectItem value="60">ساعة واحدة</SelectItem>
                <SelectItem value="120">ساعتان</SelectItem>
                <SelectItem value="360">6 ساعات</SelectItem>
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

        {/* آخر تحديث */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">آخر تحديث: {formatLastSync()}</span>
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

        {/* إحصائيات */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {config.sources.rss && config.sources.facebook ? '2' : 
               config.sources.rss || config.sources.facebook ? '1' : '0'}
            </div>
            <div className="text-xs text-green-600">مصادر مفعلة</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {config.enabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-xs text-blue-600">حالة النظام</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoSyncStatus;
