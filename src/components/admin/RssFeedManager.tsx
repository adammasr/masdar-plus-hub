import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Trash2, RefreshCw, Clock, AlarmClock } from "lucide-react";
import { reformatArticleWithAI, extractImageFromContent, updateArticleDate } from "../../utils/newsFormatter";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface RssFeedManagerProps {
  autoSyncEnabled?: boolean;
}

const RssFeedManager = ({ autoSyncEnabled = true }: RssFeedManagerProps) => {
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
  const [syncInterval, setSyncInterval] = useState("60"); // الفترة بين عمليات التحديث التلقائي بالدقائق (افتراضي: 60 دقيقة)
  const [nextSyncTime, setNextSyncTime] = useState<Date | null>(null);

  // حفظ الإعدادات في التخزين المحلي
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rssFeeds');
    const savedAutoUpdate = localStorage.getItem('rssAutoUpdate');
    const savedSyncInterval = localStorage.getItem('rssFeedsSyncInterval');
    
    if (savedFeeds) {
      try {
        setFeeds(JSON.parse(savedFeeds));
      } catch (e) {
        console.error("خطأ في تحميل الخلاصات المحفوظة:", e);
      }
    }
    
    if (savedAutoUpdate) {
      setAutoUpdateEnabled(savedAutoUpdate === 'true');
    }
    
    if (savedSyncInterval) {
      setSyncInterval(savedSyncInterval);
    }
  }, []);
  
  // حفظ الخلاصات والإعدادات عند تغييرها
  useEffect(() => {
    localStorage.setItem('rssFeeds', JSON.stringify(feeds));
    localStorage.setItem('rssAutoUpdate', autoUpdateEnabled.toString());
    localStorage.setItem('rssFeedsSyncInterval', syncInterval);
  }, [feeds, autoUpdateEnabled, syncInterval]);

  // Auto update function
  useEffect(() => {
    if (!autoUpdateEnabled || !autoSyncEnabled) return;

    const now = new Date();
    
    // حساب وقت المزامنة التالي
    const nextSync = new Date(now.getTime() + parseInt(syncInterval) * 60 * 1000);
    setNextSyncTime(nextSync);
    
    const updateFeeds = async () => {
      console.log("مزامنة خلاصات RSS...");
      const feedsToUpdate = feeds.filter(feed => feed.autoUpdate);
      
      if (feedsToUpdate.length > 0) {
        setIsLoading(true);
        
        try {
          await Promise.all(feedsToUpdate.map(feed => fetchFeedContent(feed, false)));
          
          // تحديث آخر وقت تحديث لكل خلاصة
          setFeeds(prev => prev.map(feed => 
            feed.autoUpdate ? { ...feed, lastUpdated: new Date().toISOString() } : feed
          ));
          
          // تحديث وقت المزامنة التالي
          const currentTime = new Date();
          const nextSyncTime = new Date(currentTime.getTime() + parseInt(syncInterval) * 60 * 1000);
          setNextSyncTime(nextSyncTime);
        } catch (error) {
          console.error("خطأ أثناء التحديث التلقائي:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    // تشغيل التحديث الأول فور تحميل المكون إذا كان التحديث التلقائي مفعلًا
    updateFeeds();
    
    const intervalId = setInterval(updateFeeds, parseInt(syncInterval) * 60 * 1000);
    
    // الاستماع للحدث المرسل من صفحة RssFeeds للتزامن
    const handleAutoSync = () => {
      console.log("استلام حدث مزامنة من الصفحة الرئيسية");
      updateFeeds();
    };
    
    window.addEventListener('rssAutoSync', handleAutoSync);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('rssAutoSync', handleAutoSync);
    };
  }, [feeds, autoUpdateEnabled, autoSyncEnabled, syncInterval, addBatchArticles]);

  // Fetch feed content with AI processing
  const fetchFeedContent = async (feed: RssFeed, showToast = true) => {
    console.log(`Fetching content from ${feed.name}...`);
    
    // Simulate fetching RSS feed content with more realistic data
    const mockArticles: Article[] = [];
    
    // Generate more realistic articles based on feed source
    const articleCount = 2 + Math.floor(Math.random() * 3);
    const articleTemplates = getArticleTemplates(feed.name);
    
    for (let i = 0; i < articleCount; i++) {
      const template = articleTemplates[i % articleTemplates.length];
      const originalTitle = template.title;
      const originalContent = template.content;
      
      // Process with AI to get clean, professional title
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image with enhanced system
      const imageUrl = extractImageFromContent(originalContent);
      
      mockArticles.push({
        id: `rss-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.replace(/<[^>]*>/g, '').substring(0, 120) + "...",
        image: imageUrl,
        category: getCategoryFromContent(originalContent, originalTitle),
        date: new Date().toISOString().split("T")[0],
        source: feed.name,
        readingTime: estimateReadingTime(reformattedContent),
        tags: generateContentTags(originalContent, originalTitle)
      });
    }

    // Add the articles to the context
    addBatchArticles(mockArticles);
    
    if (showToast) {
      toast.success(`تم استيراد ${mockArticles.length} مقالات بنجاح من ${feed.name}`);
    }
    
    return mockArticles;
  };

  // Generate realistic article templates based on feed source
  const getArticleTemplates = (feedName: string): Array<{title: string, content: string}> => {
    const templates = {
      "القاهرة الإخبارية": [
        {
          title: "تطورات مهمة في الاقتصاد المصري والاستثمارات الجديدة",
          content: "شهد الاقتصاد المصري تطورات إيجابية مهمة خلال الأشهر الماضية، حيث أعلنت الحكومة عن حزمة استثمارات جديدة تهدف إلى تعزيز النمو الاقتصادي. وتشمل هذه الاستثمارات مشاريع في قطاعات الطاقة والنقل والتكنولوجيا، مما يؤكد التزام الدولة بدعم التنمية المستدامة."
        },
        {
          title: "قرارات حكومية جديدة لدعم المواطنين وتحسين الخدمات",
          content: "أصدرت الحكومة المصرية حزمة من القرارات الجديدة التي تهدف إلى تحسين مستوى الخدمات المقدمة للمواطنين. وتشمل هذه القرارات تطوير المرافق العامة وتحسين شبكات النقل، بالإضافة إلى برامج دعم جديدة للأسر المحتاجة."
        },
        {
          title: "مشاريع تنموية ضخمة في المدن الجديدة والعاصمة الإدارية",
          content: "تشهد المدن الجديدة في مصر نهضة تنموية شاملة، حيث يتم تنفيذ مشاريع ضخمة في مجالات الإسكان والتعليم والصحة. وتأتي هذه المشاريع في إطار خطة الدولة الشاملة لتحقيق التنمية المستدامة وتوفير حياة كريمة للمواطنين."
        }
      ],
      "المتحدث الرسمي للرئاسة": [
        {
          title: "بيان رئاسي حول السياسات الجديدة والتوجهات المستقبلية",
          content: "أصدرت الرئاسة المصرية بياناً مهماً حول السياسات الجديدة التي تتبناها الدولة في المرحلة القادمة. ويؤكد البيان على أهمية التنمية الشاملة والاستثمار في الإنسان المصري، مع التركيز على التعليم والصحة والتكنولوجيا."
        },
        {
          title: "توجيهات رئاسية لتطوير القطاعات الحيوية والخدمات العامة",
          content: "وجه رئيس الجمهورية بضرورة تطوير القطاعات الحيوية في الدولة، مع التركيز على تحسين الخدمات العامة ورفع كفاءة الأداء الحكومي. وشملت التوجيهات خططاً شاملة لتطوير البنية التحتية وتعزيز الاستثمار في التكنولوجيا."
        },
        {
          title: "مبادرات رئاسية جديدة لدعم الشباب وريادة الأعمال",
          content: "أطلقت الرئاسة المصرية مبادرات جديدة لدعم الشباب وتشجيع ريادة الأعمال، وذلك في إطار رؤية مصر 2030. وتشمل هذه المبادرات برامج تدريبية متخصصة وتمويل للمشاريع الناشئة، بهدف خلق فرص عمل جديدة وتعزيز الابتكار."
        }
      ]
    };

    return templates[feedName as keyof typeof templates] || [
      {
        title: "أخبار مهمة من المنطقة وتطورات جديدة",
        content: "تشهد المنطقة تطورات مهمة في مختلف المجالات، حيث تواصل الدول العربية جهودها لتحقيق التنمية والاستقرار. وتركز هذه الجهود على تعزيز التعاون الإقليمي ودعم الاستثمارات المشتركة."
      }
    ];
  };

  // Enhanced category detection
  const getCategoryFromContent = (content: string, title: string): string => {
    const combinedText = `${title} ${content}`.toLowerCase();
    
    if (combinedText.match(/(رئيس|وزير|حكومة|بيان|سياسة|دبلوماسي)/)) {
      return "سياسة";
    }
    
    if (combinedText.match(/(اقتصاد|استثمار|مالية|بنك|أسعار|تجارة)/)) {
      return "اقتصاد";
    }
    
    if (combinedText.match(/(رياضة|كرة|مباراة|فريق|بطولة)/)) {
      return "رياضة";
    }
    
    if (combinedText.match(/(تكنولوجيا|ذكاء اصطناعي|تقنية|رقمي)/)) {
      return "تكنولوجيا";
    }
    
    return "أخبار";
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">الخلاصات المضافة</h3>
                <Badge variant="outline" className="bg-gray-100">
                  {feeds.length}
                </Badge>
              </div>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Switch
                    id="auto-update"
                    checked={autoUpdateEnabled && autoSyncEnabled}
                    onCheckedChange={() => autoSyncEnabled && setAutoUpdateEnabled(!autoUpdateEnabled)}
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
                        onValueChange={setSyncInterval}
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
                  onClick={handleFetchAllFeeds} 
                  disabled={isLoading || feeds.length === 0}
                  variant="outline"
                  size="sm"
                  className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
                >
                  <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
                  تحديث جميع الخلاصات
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
                          onCheckedChange={() => toggleFeedAutoUpdate(feed.id)}
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
                        onClick={() => handleFetchFeed(feed)}
                        disabled={isLoading}
                        className="border-news-accent text-news-accent hover:bg-news-accent hover:text-white"
                      >
                        <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        تحديث
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleRemoveFeed(feed.id)}
                        className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none"
                      >
                        حذف
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
