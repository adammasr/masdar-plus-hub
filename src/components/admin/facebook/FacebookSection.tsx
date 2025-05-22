import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Facebook, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FacebookPage } from "../../../types/facebook";
import FacebookPageList from "./FacebookPageList";
import { useArticles } from "../../../context/ArticleContext";
import { useSimulateFacebookArticles } from "../../../hooks/useSimulateSources";
import { toast } from "sonner";

// تاريخ بداية سحب الأخبار (21 مايو 2025)
const startSyncDate = new Date('2025-05-21T00:00:00');

// حماية مكون فيسبوك: السماح فقط لمن لديه isAdmin = "true"
const isAdmin = () => {
  return window?.localStorage?.getItem("isAdmin") === "true";
};

const FacebookSection = () => {
  // منع غير الأدمن من الدخول (حماية واجهة فقط)
  if (!isAdmin()) {
    return (
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            صفحات فيسبوك
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

  // ... باقي الكود كما هو ...
  // لا تغييرات على الكود بعد هذا السطر
  const [facebookPages, setFacebookPages] = useState<FacebookPage[]>([
    // ... كما هو ...
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const { addBatchArticles } = useArticles();
  const { simulateFacebookArticles } = useSimulateFacebookArticles();

  const handleSyncAllPages = async () => {
    // ... كما هو ...
  };

  return (
    <Card className="border-2 border-gray-100 shadow-lg">
      {/* ... كما هو ... */}
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Facebook className="h-5 w-5 text-blue-600" />
              صفحات فيسبوك
            </CardTitle>
            <CardDescription>
              مزامنة المنشورات من صفحات فيسبوك الرسمية (بداية من {startSyncDate.toLocaleDateString('ar-EG')})
            </CardDescription>
          </div>
          <Button
            onClick={handleSyncAllPages}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            مزامنة جميع الصفحات
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <FacebookPageList
          facebookPages={facebookPages}
          setFacebookPages={setFacebookPages}
          autoSync={autoSync}
          setAutoSync={setAutoSync}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          startSyncDate={startSyncDate}
        />
      </CardContent>
    </Card>
  );
};

export default FacebookSection;
