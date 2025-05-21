import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateWebhook } from "../../../hooks/useSimulateSources";

// حماية الواجهة: السماح فقط للأدمن adammasr
const isAdmin = () => {
  return window?.localStorage?.getItem("username") === "adammasr" || (window as any).currentUser === "adammasr";
};

const WebhookSection = () => {
  if (!isAdmin()) {
    return (
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-lg text-gray-800">استيراد المقالات من Webhook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-red-600 font-bold">
            ليس لديك صلاحية الوصول إلى لوحة التحكم.
          </div>
        </CardContent>
      </Card>
    );
  }

  const [webhookUrl, setWebhookUrl] = useState("https://hook.eu1.make.com/example123456");
  const [isLoading, setIsLoading] = useState(false);
  const { addBatchArticles } = useArticles();
  const { simulateWebhookArticles } = useSimulateWebhook();

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

  return (
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
  );
};

export default WebhookSection;
