import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Trash2, RefreshCw, Clock } from "lucide-react";
import { reformatArticleWithAI, extractImageFromContent, updateArticleDate } from "../../utils/newsFormatter";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// الحماية: السماح فقط لمن لديه isAdmin = "true"
const isAdmin = () => {
  return window?.localStorage?.getItem("isAdmin") === "true";
};

interface RssFeed {
  id: string;
  url: string;
  name: string;
  autoUpdate?: boolean;
  lastUpdated?: string;
}

const RssFeedManager = () => {
  if (!isAdmin()) {
    return (
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-news-accent" />
            إدارة خلاصات RSS
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

  const [feedUrl, setFeedUrl] = useState("");
  const [feedName, setFeedName] = useState("");
  const [feeds, setFeeds] = useState<RssFeed[]>([
    { 
      id: "1", 
      url: "https://feed.informer.com/digests/7HUZFNOFWB/feeder.rss", 
      name: "القاهرة الإخبارية", 
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    },
    { 
      id: "2", 
      url: "https://feed.informer.com/digests/ITT2WR6G42/feeder.rss", 
      name: "المتحدث الرسمي للرئاسة",
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    }
  ]);
  const { addBatchArticles } = useArticles();
  const [isLoading, setIsLoading] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  // Auto update function
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const updateInterval = setInterval(() => {
      console.log("Auto-updating RSS feeds...");
      const feedsToUpdate = feeds.filter(feed => feed.autoUpdate);
      
      if (feedsToUpdate.length > 0) {
        Promise.all(feedsToUpdate.map(feed => fetchFeedContent(feed, false)))
          .then(() => {
            console.log("All auto-update feeds refreshed");
            setFeeds(prev => prev.map(feed => 
              feed.autoUpdate ? { ...feed, lastUpdated: new Date().toISOString() } : feed
            ));
          })
          .catch(error => console.error("Error during auto-update:", error));
      }
    }, 3600000); // Check every hour (3600000 ms)
    
    // In a real implementation, you would use a shorter interval for development
    // and implement proper feed change detection
    
    return () => clearInterval(updateInterval);
  }, [feeds, autoUpdateEnabled, addBatchArticles]);

  // Fetch feed content with AI processing
  const fetchFeedContent = async (feed: RssFeed, showToast = true) => {
    console.log(`Fetching content from ${feed.name}...`);
    
    // Simulate fetching RSS feed content
    // In production, replace with actual RSS fetching code
    const mockArticles: Article[] = [];
    
    // Simulate 2-4 articles from this feed
    const articleCount = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < articleCount; i++) {
      const originalTitle = `خبر جديد من ${feed.name} - ${i + 1}`;
      const originalContent = `هذا محتوى تجريبي لمقال تم استيراده من خلاصة ${feed.name}. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الخلاصة.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=المصدر+بلس");
      
      mockArticles.push({
        id: `rss-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: getRandomCategory(),
        date: new Date().toISOString().split("T")[0],
        source: feed.name
      });
    }

    // Add the articles to the context
    addBatchArticles(mockArticles);
    
    if (showToast) {
      toast.success(`تم استيراد ${mockArticles.length} مقالات بنجاح من ${feed.name}`);
    }
    
    return mockArticles;
  };

  const getRandomCategory = () => {
    const categories = ["أخبار", "سياسة", "اقتصاد"];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const handleAddFeed = () => {
    if (!feedUrl || !feedName) {
      toast.error("الرجاء إدخال اسم وعنوان الخلاصة");
      return;
    }

    const newFeed: RssFeed = {
      id: Date.now().toString(),
      url: feedUrl,
      name: feedName,
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
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

  const handleFetchFeed = async (feed: RssFeed) => {
    setIsLoading(true);
    
    try {
      await fetchFeedContent(feed);
      // Update last updated timestamp
      setFeeds(prev => prev.map(f => 
        f.id === feed.id ? { ...f, lastUpdated: new Date().toISOString() } : f
      ));
    } catch (error) {
      console.error("Error fetching feed:", error);
      toast.error(`فشل تحديث خلاصة ${feed.name}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchAllFeeds = async () => {
    setIsLoading(true);
    
    try {
      await Promise.all(feeds.map(feed => fetchFeedContent(feed, false)));
      toast.success("تم استيراد المقالات بنجاح من جميع الخلاصات");
      
      // Update all last updated timestamps
      setFeeds(prev => prev.map(f => ({ ...f, lastUpdated: new Date().toISOString() })));
    } catch (error) {
      console.error("Error fetching all feeds:", error);
      toast.error("فشل تحديث بعض الخلاصات");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFeedAutoUpdate = (feedId: string) => {
    setFeeds(prev => prev.map(feed => 
      feed.id === feedId ? { ...feed, autoUpdate: !feed.autoUpdate } : feed
    ));
  };

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
    <Card className="border-2 border-gray-100 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
        <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-news-accent" />
          إدارة خلاصات RSS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-4">إضافة خلاصة جديدة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  اسم الخلاصة
                </label>
                <Input
                  placeholder="أدخل اسم الخلاصة"
                  value={feedName}
                  onChange={(e) => setFeedName(e.target.value)}
                  className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
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
                  className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleAddFeed} 
              className="bg-news-accent hover:bg-red-700 mt-4"
            >
              إضافة خلاصة جديدة
            </Button>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">الخلاصات المضافة</h3>
                <Badge variant="outline" className="bg-gray-100">
                  {feeds.length}
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="auto-update"
                    checked={autoUpdateEnabled}
                    onCheckedChange={setAutoUpdateEnabled}
                  />
                  <Label htmlFor="auto-update" className="text-sm font-medium mr-2 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    تحديث تلقائي
                  </Label>
                </div>
                <Button 
                  onClick={handleFetchAllFeeds} 
                  disabled={isLoading || feeds.length === 0}
                  variant="outline"
                  className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
                >
                  {isLoading ? "جاري التحديث..." : "تحديث جميع الخلاصات"}
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {feeds.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا توجد خلاصات مضافة</p>
              ) : (
                feeds.map((feed) => (
                  <div 
                    key={feed.id} 
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{feed.name}</p>
                        {feed.autoUpdate && (
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
                          checked={!!feed.autoUpdate}
                          onCheckedChange={() => toggleFeedAutoUpdate(feed.id)}
                          className="data-[state=checked]:bg-news-accent"
                        />
                        <Label htmlFor={`feed-auto-${feed.id}`} className="sr-only">
                          تحديث تلقائي
                        </Label>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleFetchFeed(feed)}
                        disabled={isLoading}
                        className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        تحديث
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleRemoveFeed(feed.id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none"
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
