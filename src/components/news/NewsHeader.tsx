
import { Newspaper, AlertCircle, Calendar } from "lucide-react";
import { AdSlot } from "../ads/AdService";

interface NewsHeaderProps {
  startSyncDate: Date;
  latestNewsTitle?: string;
}

const NewsHeader = ({ startSyncDate, latestNewsTitle }: NewsHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center">
        <Newspaper className="ml-2 text-news-accent" />
        الأخبار
      </h1>
      <p className="text-gray-600">
        آخر وأهم الأخبار المحلية والعالمية من مصادر موثوقة
      </p>

      {/* تاريخ البداية */}
      <div className="flex items-center mt-3 bg-blue-50 text-blue-800 px-4 py-2 rounded-md text-sm">
        <Calendar className="ml-2 text-blue-600" size={16} />
        تظهر الأخبار بدءًا من تاريخ {startSyncDate.toLocaleDateString("ar-EG")}
      </div>

      {/* شريط الأخبار العاجلة */}
      <div className="bg-news-accent text-white p-3 rounded-md mt-4 flex flex-col md:flex-row items-start md:items-center">
        <div className="flex items-center">
          <AlertCircle className="ml-2" />
          <span className="font-bold mr-1">آخر الأخبار:</span>
        </div>
        <div className="mr-0 md:mr-2 mt-2 md:mt-0 overflow-hidden whitespace-nowrap text-ellipsis w-full">
          {latestNewsTitle || "لا توجد أخبار جديدة"}
        </div>
      </div>
      
      {/* إعلان أعلى صفحة الأخبار */}
      <div className="mt-6">
        <AdSlot position="header" />
      </div>
    </div>
  );
};

export default NewsHeader;
