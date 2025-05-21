
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { reformatArticleWithAI, extractImageFromContent } from "../../utils/newsFormatter";
import { Clock, ExternalLink, RefreshCw, Facebook } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const WebhookSetup = () => {
  const [webhookUrl, setWebhookUrl] = useState("https://hook.eu1.make.com/example123456");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("https://docs.google.com/spreadsheets/d/example");
  const [facebookPages, setFacebookPages] = useState([
    { id: "1", name: "المتحدث الرسمي للرئاسة", url: "https://www.facebook.com/example1", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "2", name: "القاهرة الإخبارية", url: "https://www.facebook.com/example2", autoUpdate: true, lastUpdated: new Date().toISOString() },
    { id: "3", name: "مجلس الوزراء المصري", url: "https://www.facebook.com/example3", autoUpdate: true, lastUpdated: new Date().toISOString() }
  ]);
  const { addBatchArticles } = useArticles();
  const [isLoading, setIsLoading] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [newPageName, setNewPageName] = useState("");
  const [newPageUrl, setNewPageUrl] = useState("");

  // Function to simulate fetching from webhook
  const handleWebhookTest = async () => {
    if (!webhookUrl) {
      toast.error("الرجاء إدخال عنوان Webhook");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate receiving articles from the webhook
      const articles = await simulateWebhookArticles();
      addBatchArticles(articles);
      toast.success("تم استيراد المقالات بنجاح من Webhook");
    } catch (error) {
      console.error("Error in webhook test:", error);
      toast.error("حدث خطأ أثناء استيراد المقالات");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate articles from webhook
  const simulateWebhookArticles = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const categories = ["أخبار", "سياسة", "اقتصاد"];
    const mockArticles: Article[] = [];
    
    // Generate 2-5 mock articles
    const articleCount = 2 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < articleCount; i++) {
      const originalTitle = `مقال تجريبي ${i+1} من Webhook`;
      const originalContent = `هذا محتوى تجريبي لمقال تم استيراده عبر Webhook. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الـ webhook.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=Webhook");
      
      mockArticles.push({
        id: `webhook-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date().toISOString().split("T")[0],
        source: "Webhook"
      });
    }
    
    return mockArticles;
  };

  // Function to simulate importing from Google Sheet
  const handleGoogleSheetImport = async () => {
    if (!googleSheetUrl) {
      toast.error("الرجاء إدخال رابط Google Sheet");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate importing from Google Sheet
      const articles = await simulateGoogleSheetArticles();
      addBatchArticles(articles);
      toast.success("تم استيراد المقالات بنجاح من Google Sheet");
    } catch (error) {
      console.error("Error importing from Google Sheet:", error);
      toast.error("حدث خطأ أثناء استيراد المقالات من Google Sheet");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate articles from Google Sheet
  const simulateGoogleSheetArticles = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const categories = ["أخبار", "سياسة", "اقتصاد", "تكنولوجيا"];
    const mockArticles: Article[] = [];
    
    // Generate 3-6 mock articles
    const articleCount = 3 + Math.floor(Math.random() * 4);
    
    for (let i = 0; i < articleCount; i++) {
      const originalTitle = `مقال تجريبي ${i+1} من Google Sheet`;
      const originalContent = `هذا محتوى تجريبي لمقال تم استيراده من Google Sheet. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الجدول.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=Google+Sheet");
      
      mockArticles.push({
        id: `sheet-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date().toISOString().split("T")[0],
        source: "Google Sheets"
      });
    }
    
    return mockArticles;
  };

  // Function to simulate fetching from Facebook page
  const handleFacebookPageSync = async (pageId: string) => {
    setIsLoading(true);
    
    try {
      const page = facebookPages.find(p => p.id === pageId);
      if (!page) throw new Error("الصفحة غير موجودة");
      
      // Simulate fetching posts
      const articles = await simulateFacebookArticles(page.name);
      addBatchArticles(articles);
      
      // Update last synced time
      setFacebookPages(prev => prev.map(p => 
        p.id === pageId ? { ...p, lastUpdated: new Date().toISOString() } : p
      ));
      
      toast.success(`تم مزامنة ${articles.length} منشورات من ${page.name}`);
    } catch (error) {
      console.error("Error syncing Facebook page:", error);
      toast.error("حدث خطأ أثناء مزامنة الصفحة");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to simulate articles from Facebook
  const simulateFacebookArticles = async (pageName: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const categories = ["أخبار", "سياسة"];
    const mockArticles: Article[] = [];
    
    // Generate 1-3 mock articles
    const articleCount = 1 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < articleCount; i++) {
      const originalTitle = `منشور من صفحة ${pageName} - ${i+1}`;
      const originalContent = `هذا محتوى تجريبي لمنشور تم استيراده من صفحة ${pageName} على فيسبوك. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الصفحة.`;
      
      // Process with AI
      const { reformattedTitle, reformattedContent } = await reformatArticleWithAI(originalContent, originalTitle);
      
      // Extract image
      const imageUrl = extractImageFromContent(originalContent, "https://placehold.co/600x400/news-accent/white?text=Facebook");
      
      mockArticles.push({
        id: `fb-${Date.now()}-${i}`,
        title: reformattedTitle,
        content: reformattedContent,
        excerpt: reformattedContent.substring(0, 120) + "...",
        image: imageUrl,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date().toISOString().split("T")[0],
        source: pageName
      });
    }
    
    return mockArticles;
  };

  // Function to add new Facebook page
  const handleAddFacebookPage = () => {
    if (!newPageName || !newPageUrl) {
      toast.error("الرجاء إدخال اسم ورابط الصفحة");
      return;
    }
    
    const newPage = {
      id: Date.now().toString(),
      name: newPageName,
      url: newPageUrl,
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    };
    
    setFacebookPages([...facebookPages, newPage]);
    setNewPageName("");
    setNewPageUrl("");
    toast.success("تمت إضافة الصفحة بنجاح");
  };

  // Function to remove Facebook page
  const handleRemoveFacebookPage = (id: string) => {
    setFacebookPages(facebookPages.filter(page => page.id !== id));
    toast.success("تم حذف الصفحة بنجاح");
  };

  // Function to toggle auto-sync for Facebook page
  const togglePageAutoSync = (pageId: string) => {
    setFacebookPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, autoUpdate: !page.autoUpdate } : page
    ));
  };

  // Function to format date string
  const formatLastUpdated = (dateString: string) => {
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
    <div className="grid grid-cols-1 gap-6">
      {/* Facebook Pages Section */}
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            صفحات فيسبوك
          </CardTitle>
          <CardDescription>
            مزامنة المنشورات من صفحات فيسبوك الرسمية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Page Form */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <h3 className="text-sm font-medium mb-3">إضافة صفحة جديدة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="اسم الصفحة"
                  value={newPageName}
                  onChange={(e) => setNewPageName(e.target.value)}
                  className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
                />
                <Input
                  placeholder="رابط الصفحة"
                  value={newPageUrl}
                  onChange={(e) => setNewPageUrl(e.target.value)}
                  className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
                />
              </div>
              <Button 
                onClick={handleAddFacebookPage} 
                className="bg-blue-600 hover:bg-blue-700 mt-3"
              >
                إضافة صفحة
              </Button>
            </div>
            
            {/* Auto-Sync Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">الصفحات المضافة</h3>
                <Badge variant="outline" className="bg-gray-100">
                  {facebookPages.length}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Switch
                  id="auto-sync"
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
                <Label htmlFor="auto-sync" className="text-sm font-medium mr-2 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  مزامنة تلقائية
                </Label>
              </div>
            </div>
            
            {/* Facebook Pages List */}
            <div className="space-y-3">
              {facebookPages.map((page) => (
                <div 
                  key={page.id} 
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800">{page.name}</p>
                      {page.autoUpdate && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                          مزامنة تلقائية
                        </Badge>
                      )}
                    </div>
                    <a 
                      href={page.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {page.url}
                    </a>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> 
                      آخر تحديث: {formatLastUpdated(page.lastUpdated)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center space-x-2 space-x-reverse ml-2">
                      <Switch
                        id={`page-auto-${page.id}`}
                        checked={!!page.autoUpdate}
                        onCheckedChange={() => togglePageAutoSync(page.id)}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Label htmlFor={`page-auto-${page.id}`} className="sr-only">
                        مزامنة تلقائية
                      </Label>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleFacebookPageSync(page.id)}
                      disabled={isLoading}
                      className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      مزامنة
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleRemoveFacebookPage(page.id)}
                      className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border-none"
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhook and Google Sheets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webhook Section */}
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-lg text-gray-800">استيراد المقالات من Webhook</CardTitle>
            <CardDescription>
              استخدم Make.com أو Zapier لإرسال المقالات تلقائيًا
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  عنوان Webhook
                </label>
                <Input
                  placeholder="أدخل عنوان Webhook"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
                />
              </div>
              <Button 
                onClick={handleWebhookTest} 
                disabled={isLoading}
                className="bg-news-accent hover:bg-red-700 w-full"
              >
                {isLoading ? "جاري الاستيراد..." : "اختبار الاستيراد"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Google Sheets Section */}
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-lg text-gray-800">استيراد من Google Sheet</CardTitle>
            <CardDescription>
              استيراد المقالات من جدول Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  رابط جدول Google
                </label>
                <Input
                  placeholder="أدخل رابط Google Sheet"
                  value={googleSheetUrl}
                  onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
                />
              </div>
              <Button 
                onClick={handleGoogleSheetImport} 
                disabled={isLoading}
                className="bg-news-accent hover:bg-red-700 w-full"
              >
                {isLoading ? "جاري الاستيراد..." : "استيراد المقالات"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebhookSetup;
