
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";

const WebhookSetup = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const { addBatchArticles } = useArticles();
  const [isLoading, setIsLoading] = useState(false);

  const handleWebhookTest = () => {
    if (!webhookUrl) {
      toast.error("الرجاء إدخال عنوان Webhook");
      return;
    }

    setIsLoading(true);
    // Simulate receiving articles from the webhook
    setTimeout(() => {
      const mockArticles: Article[] = [
        {
          id: `webhook-${Date.now()}`,
          title: "مقال تجريبي من Webhook",
          content: "هذا محتوى تجريبي لمقال تم استيراده عبر Webhook. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الـ webhook.",
          excerpt: "هذا محتوى تجريبي لمقال تم استيراده عبر Webhook...",
          image: "https://placehold.co/600x400/news-accent/white?text=Webhook",
          category: "تكنولوجيا",
          date: new Date().toISOString().split("T")[0],
          source: "Webhook"
        }
      ];

      addBatchArticles(mockArticles);
      setIsLoading(false);
      toast.success("تم استيراد المقالات بنجاح من Webhook");
    }, 1500);
  };

  const handleGoogleSheetImport = () => {
    if (!googleSheetUrl) {
      toast.error("الرجاء إدخال رابط Google Sheet");
      return;
    }

    setIsLoading(true);
    // Simulate importing from Google Sheet
    setTimeout(() => {
      const mockArticles: Article[] = [
        {
          id: `sheet-${Date.now()}`,
          title: "مقال تجريبي من Google Sheet",
          content: "هذا محتوى تجريبي لمقال تم استيراده من Google Sheet. في الإصدار الحقيقي، سيتم استبدال هذا بمحتوى حقيقي من الجدول.",
          excerpt: "هذا محتوى تجريبي لمقال تم استيراده من Google Sheet...",
          image: "https://placehold.co/600x400/news-accent/white?text=Google+Sheet",
          category: "أخبار",
          date: new Date().toISOString().split("T")[0],
          source: "Google Sheets"
        }
      ];

      addBatchArticles(mockArticles);
      setIsLoading(false);
      toast.success("تم استيراد المقالات بنجاح من Google Sheet");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>استيراد المقالات من Webhook</CardTitle>
          <CardDescription>
            قم بإعداد Webhook لاستيراد المقالات تلقائيًا
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

      <Card>
        <CardHeader>
          <CardTitle>استيراد من Google Sheet</CardTitle>
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
  );
};

export default WebhookSetup;
