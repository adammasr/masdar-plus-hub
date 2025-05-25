
import { Badge } from "@/components/ui/badge";
import FeedItem from "./FeedItem";

interface RssFeed {
  id: string;
  url: string;
  name: string;
  autoUpdate?: boolean;
  lastUpdated?: string;
}

interface FeedListProps {
  feeds: RssFeed[];
  isLoading: boolean;
  autoUpdateEnabled: boolean;
  autoSyncEnabled: boolean;
  onFetchFeed: (feed: RssFeed) => void;
  onRemoveFeed: (id: string) => void;
  onToggleAutoUpdate: (feedId: string) => void;
}

const FeedList = ({ 
  feeds, 
  isLoading, 
  autoUpdateEnabled, 
  autoSyncEnabled, 
  onFetchFeed, 
  onRemoveFeed, 
  onToggleAutoUpdate 
}: FeedListProps) => {
  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">الخلاصات المضافة</h3>
          <Badge variant="outline" className="bg-gray-100">
            {feeds.length}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        {feeds.length === 0 ? (
          <p className="text-gray-500 text-center py-8">لا توجد خلاصات مضافة</p>
        ) : (
          feeds.map((feed) => (
            <FeedItem
              key={feed.id}
              feed={feed}
              isLoading={isLoading}
              autoUpdateEnabled={autoUpdateEnabled}
              autoSyncEnabled={autoSyncEnabled}
              onFetchFeed={onFetchFeed}
              onRemoveFeed={onRemoveFeed}
              onToggleAutoUpdate={onToggleAutoUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FeedList;
