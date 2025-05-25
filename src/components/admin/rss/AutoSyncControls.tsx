
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, AlarmClock, RefreshCw } from "lucide-react";

interface AutoSyncControlsProps {
  autoUpdateEnabled: boolean;
  autoSyncEnabled: boolean;
  syncInterval: string;
  nextSyncTime: Date | null;
  isLoading: boolean;
  feedsCount: number;
  onToggleAutoUpdate: (enabled: boolean) => void;
  onChangeSyncInterval: (interval: string) => void;
  onFetchAllFeeds: () => void;
}

const AutoSyncControls = ({
  autoUpdateEnabled,
  autoSyncEnabled,
  syncInterval,
  nextSyncTime,
  isLoading,
  feedsCount,
  onToggleAutoUpdate,
  onChangeSyncInterval,
  onFetchAllFeeds
}: AutoSyncControlsProps) => {
  const formatNextSyncTime = () => {
    if (!nextSyncTime) return "غير محدد";
    
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
    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-center space-x-2 space-x-reverse">
        <Switch
          id="auto-update"
          checked={autoUpdateEnabled && autoSyncEnabled}
          onCheckedChange={() => autoSyncEnabled && onToggleAutoUpdate(!autoUpdateEnabled)}
          disabled={!autoSyncEnabled}
        />
        <Label htmlFor="auto-update" className="text-sm font-medium mr-2 flex items-center gap-1 text-blue-800">
          <Clock className="h-4 w-4 text-blue-600" />
          تحديث تلقائي للخلاصات
        </Label>
      </div>
      
      {autoUpdateEnabled && autoSyncEnabled && (
        <>
          <div className="flex items-center gap-2">
            <Label htmlFor="feed-sync-interval" className="text-sm whitespace-nowrap text-blue-800">
              كل:
            </Label>
            <Select
              value={syncInterval}
              onValueChange={onChangeSyncInterval}
            >
              <SelectTrigger id="feed-sync-interval" className="w-[110px] text-sm border-blue-200 focus:ring-blue-300 bg-white">
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
            <div className="text-sm flex items-center gap-1 text-blue-800 whitespace-nowrap">
              <AlarmClock className="h-4 w-4 text-blue-600" />
              <span>التحديث التالي: {formatNextSyncTime()}</span>
            </div>
          )}
        </>
      )}
      
      <Button 
        onClick={onFetchAllFeeds} 
        disabled={isLoading || feedsCount === 0}
        variant="outline"
        size="sm"
        className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
      >
        <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
        تحديث جميع الخلاصات
      </Button>
    </div>
  );
};

export default AutoSyncControls;
