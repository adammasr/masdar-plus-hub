
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Trash2 } from "lucide-react";

interface RssFeed {
  id: string;
  url: string;
  name: string;
}

const RssFeedManager = () => {
  const [feedUrl, setFeedUrl] = useState("");
  const [feedName, setFeedName] = useState("");
  const [feeds, setFeeds] = useState<RssFeed[]>([
    { id: "1", url: "https://feed.informer.com/digests/7HUZFNOFWB/feeder.rss", name: "القاهرة الإخبارية" },
    { id: "2", url: "https://feed.informer.com/digests/ITT2WR6G42/feeder.rss", name: "المتحدث الرسمي للرئاسة" }
  ]);
  const { addBatchArticles } = useArticles();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddFeed = () => {
    if (!feedUrl || !feedName) {
      toast.error("الرجاء إدخال اسم وعنوان الخلاصة");
      return;
    }

    const newFeed: RssFeed = {
      id: Date.now().toString(),
      url: feedUrl,
      name: feedName
    };

    setFeeds([...feeds, newFeed]);
    setFeedUrl("");
    setFeedName("");
    toast.success("تمت إضافة الخلاصة بنجاح");
  };

  const handleRemoveFeed = (id: string) => {
    setFeeds(feeds.filter(feed => feed.id !== id));
    toast.success("تم حذف الخلاصة بنجاح");
  };

  const handleFetchFeed = (feed: RssFeed) => {
    setIsLoading(true);
    
    // Simulate fetching from RSS
    setTimeout(() => {
      const mockArticles: Article[] = [
        {
          id: `rss-${Date.now()}`,
          title: `مقال تجريبي من ${feed.name}`,
          content: `هذا محتوى تجريبي لمقال تم استيراده من خلاصة ${feed.name}. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الخلاصة.`,
          excerpt: `هذا محتوى تجريبي لمقال تم استيراده من خلاصة ${feed.name}...`,
          image: "https://placehold.co/600x400/news-accent/white?text=RSS",
          category: "أخبار",
          date: new Date().toISOString().split("T")[0],
          source: feed.name
        }
      ];

      addBatchArticles(mockArticles);
      setIsLoading(false);
      toast.success(`تم استيراد المقالات بنجاح من ${feed.name}`);
    }, 1500);
  };

  const handleFetchAllFeeds = () => {
    setIsLoading(true);
    
    // Simulate fetching from all RSS feeds
    setTimeout(() => {
      const mockArticles: Article[] = feeds.map((feed) => ({
        id: `rss-all-${Date.now()}-${feed.id}`,
        title: `مقال تجريبي من ${feed.name}`,
        content: `هذا محتوى تجريبي لمقال تم استيراده من خلاصة ${feed.name}. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الخلاصة.`,
        excerpt: `هذا محتوى تجريبي لمقال تم استيراده من خلاصة ${feed.name}...`,
        image: "https://placehold.co/600x400/news-accent/white?text=RSS",
        category: "أخبار",
        date: new Date().toISOString().split("T")[0],
        source: feed.name
      }));

      addBatchArticles(mockArticles);
      setIsLoading(false);
      toast.success("تم استيراد المقالات بنجاح من جميع الخلاصات");
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>إدارة خلاصات RSS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                اسم الخلاصة
              </label>
              <Input
                placeholder="أدخل اسم الخلاصة"
                value={feedName}
                onChange={(e) => setFeedName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                عنوان الخلاصة (URL)
              </label>
              <Input
                placeholder="أدخل عنوان RSS"
                value={feedUrl}
                onChange={(e) => setFeedUrl(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleAddFeed} 
            className="bg-news-accent hover:bg-red-700"
          >
            إضافة خلاصة جديدة
          </Button>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">الخلاصات المضافة</h3>
              <Button 
                onClick={handleFetchAllFeeds} 
                disabled={isLoading || feeds.length === 0}
                variant="outline"
              >
                {isLoading ? "جاري التحديث..." : "تحديث جميع الخلاصات"}
              </Button>
            </div>
            
            <div className="space-y-3">
              {feeds.length === 0 ? (
                <p className="text-gray-500">لا توجد خلاصات مضافة</p>
              ) : (
                feeds.map((feed) => (
                  <div 
                    key={feed.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{feed.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-xs">{feed.url}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleFetchFeed(feed)}
                        disabled={isLoading}
                      >
                        تحديث
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleRemoveFeed(feed.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RssFeedManager;
