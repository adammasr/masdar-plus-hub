
import RssFeedManager from "../../components/admin/RssFeedManager";

const AdminRssFeeds = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">إدارة خلاصات RSS</h1>
      <p className="text-gray-500">
        أضف وإدارة خلاصات RSS لاستيراد الأخبار تلقائيًا من مصادر مختلفة.
      </p>
      
      <RssFeedManager />
    </div>
  );
};

export default AdminRssFeeds;
