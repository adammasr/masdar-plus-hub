
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RefreshCw, Clock } from "lucide-react";

interface RssFeed {
  id: string;
  url: string;
  name: string;
  autoUpdate?: boolean;
  lastUpdated?: string;
}

interface FeedItemProps {
  feed: RssFeed;
  isLoading: boolean;
  autoUpdateEnabled: boolean;
  autoSyncEnabled: boolean;
  onFetchFeed: (feed: RssFeed) => void;
  onRemoveFeed: (id: string) => void;
  onToggleAutoUpdate: (feedId: string) => void;
}

const FeedItem = ({ 
  feed, 
  isLoading, 
  autoUpdateEnabled, 
  autoSyncEnabled, 
  onFetchFeed, 
  onRemoveFeed, 
  onToggleAutoUpdate 
}: FeedItemProps) => {
  const formatLastUpdated = (dateString?: string) => {
    if (!dateString) return "لم يتم التحديث بعد";
    
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
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-800">{feed.name}</p>
          {feed.autoUpdate && autoUpdateEnabled && autoSyncEnabled && (
            <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
              تحديث تلقائي
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate max-w-xs mt-1">{feed.url}</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Clock className="h-3 w-3" /> 
          آخر تحديث: {formatLastUpdated(feed.lastUpdated)}
        </p>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center space-x-2 space-x-reverse ml-2">
          <Switch
            id={`feed-auto-${feed.id}`}
            checked={!!feed.autoUpdate && autoUpdateEnabled && autoSyncEnabled}
            onCheckedChange={() => onToggleAutoUpdate(feed.id)}
            disabled={!autoUpdateEnabled || !autoSyncEnabled}
            className="data-[state=checked]:bg-news-accent"
          />
          <Label htmlFor={`feed-auto-${feed.id}`} className="sr-only">
            تحديث تلقائي
          </Label>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => onFetchFeed(feed)}
          disabled={isLoading}
          className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          تحديث
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={() => onRemoveFeed(feed.id)}
          className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none"
        >
          حذف
        </Button>
      </div>
    </div>
  );
};

export default FeedItem;
