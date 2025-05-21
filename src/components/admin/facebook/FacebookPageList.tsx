
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, RefreshCw, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FacebookPage } from "../../../types/facebook";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateFacebookArticles } from "../../../hooks/useSimulateSources";

interface FacebookPageListProps {
  facebookPages: FacebookPage[];
  setFacebookPages: React.Dispatch<React.SetStateAction<FacebookPage[]>>;
  autoSync: boolean;
  setAutoSync: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  startSyncDate: Date;
}

const FacebookPageList = ({
  facebookPages,
  setFacebookPages,
  autoSync,
  setAutoSync,
  isLoading,
  setIsLoading,
  startSyncDate
}: FacebookPageListProps) => {
  const [newPageName, setNewPageName] = useState("");
  const [newPageUrl, setNewPageUrl] = useState("");
  const { addBatchArticles } = useArticles();
  const { simulateFacebookArticles } = useSimulateFacebookArticles();

  // Function to simulate fetching from Facebook page
  const handleFacebookPageSync = async (pageId: string) => {
    setIsLoading(true);
    
    try {
      const page = facebookPages.find(p => p.id === pageId);
      if (!page) throw new Error("الصفحة غير موجودة");
      
      // Simulate fetching posts with respect to the startSyncDate
      const articles = await simulateFacebookArticles(page.name);
      
      // Filter articles to only include those from startSyncDate or newer
      const filteredArticles = articles.filter(article => 
        new Date(article.date) >= startSyncDate
      );
      
      if (filteredArticles.length > 0) {
        addBatchArticles(filteredArticles);
        
        // Update last synced time
        setFacebookPages(prev => prev.map(p => 
          p.id === pageId ? { ...p, lastUpdated: new Date().toISOString() } : p
        ));
        
        toast.success(`تم مزامنة ${filteredArticles.length} منشورات من ${page.name} (بداية من ${startSyncDate.toLocaleDateString('ar-EG')})`);
      } else {
        toast.info(`لم يتم العثور على منشورات جديدة من ${page.name} منذ ${startSyncDate.toLocaleDateString('ar-EG')}`);
      }
    } catch (error) {
      console.error("Error syncing Facebook page:", error);
      toast.error("حدث خطأ أثناء مزامنة الصفحة");
    } finally {
      setIsLoading(false);
    }
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
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
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
                <RefreshCw className={`h-4 w-4 ml-1 ${isLoading ? 'animate-spin' : ''}`} />
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
  );
};

export default FacebookPageList;
