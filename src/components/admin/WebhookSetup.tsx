
import { toast } from "sonner";
import FacebookSection from "./facebook/FacebookSection";
import WebhookSection from "./integrations/WebhookSection";
import GoogleSheetSection from "./integrations/GoogleSheetSection";

const WebhookSetup = () => {
  // تاريخ بداية سحب الأخبار (21 مايو 2025)
  const startSyncDate = new Date('2025-05-21T00:00:00');

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Facebook Pages Section */}
      <FacebookSection />

      {/* Webhook and Google Sheets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webhook Section */}
        <WebhookSection />

        {/* Google Sheets Section */}
        <GoogleSheetSection />
      </div>
    </div>
  );
};

export default WebhookSetup;
