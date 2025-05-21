
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateGoogleSheet } from "../../../hooks/useSimulateSources";

const GoogleSheetSection = () => {
  const [googleSheetUrl, setGoogleSheetUrl] = useState("https://docs.google.com/spreadsheets/d/example");
  const [isLoading, setIsLoading] = useState(false);
  const { addBatchArticles } = useArticles();
  const { simulateGoogleSheetArticles } = useSimulateGoogleSheet();

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

  return (
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
  );
};

export default GoogleSheetSection;
