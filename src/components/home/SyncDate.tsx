
import { Calendar } from "lucide-react";

interface SyncDateProps {
  startSyncDate: Date;
}

const SyncDate = ({ startSyncDate }: SyncDateProps) => {
  return (
    <div className="flex items-center mb-4 bg-blue-50 text-blue-800 px-4 py-2 rounded-md">
      <Calendar className="ml-2 text-blue-600" size={18} />
      <span>
        تظهر الأخبار بدءًا من تاريخ{" "}
        {startSyncDate.toLocaleDateString("ar-EG")}
      </span>
    </div>
  );
};

export default SyncDate;
