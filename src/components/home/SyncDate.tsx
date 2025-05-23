
import { Calendar } from "lucide-react";

interface SyncDateProps {
  startSyncDate: Date;
}

const SyncDate = ({ startSyncDate }: SyncDateProps) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
      <Calendar className="h-5 w-5 text-blue-600" />
      <div className="text-blue-800">
        <p className="text-sm font-medium">
          ملاحظة: نظام جلب الأخبار نشط ويعمل بكفاءة منذ {startSyncDate.toLocaleDateString('ar-EG')}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          يتم تحديث المحتوى تلقائياً من مصادر متعددة باستخدام الذكاء الاصطناعي
        </p>
      </div>
    </div>
  );
};

export default SyncDate;
