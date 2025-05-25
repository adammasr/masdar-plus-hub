
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RssFeed {
  id: string;
  url: string;
  name: string;
  autoUpdate?: boolean;
  lastUpdated?: string;
}

interface FeedFormProps {
  onAddFeed: (feed: RssFeed) => void;
}

const FeedForm = ({ onAddFeed }: FeedFormProps) => {
  const [feedUrl, setFeedUrl] = useState("");
  const [feedName, setFeedName] = useState("");

  const handleAddFeed = () => {
    if (!feedUrl || !feedName) {
      toast.error("الرجاء إدخال اسم وعنوان الخلاصة");
      return;
    }

    const newFeed: RssFeed = {
      id: Date.now().toString(),
      url: feedUrl,
      name: feedName,
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    };

    onAddFeed(newFeed);
    setFeedUrl("");
    setFeedName("");
    toast.success("تمت إضافة الخلاصة بنجاح");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-4">إضافة خلاصة جديدة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium">
            اسم الخلاصة
          </label>
          <Input
            placeholder="أدخل اسم الخلاصة"
            value={feedName}
            onChange={(e) => setFeedName(e.target.value)}
            className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium">
            عنوان الخلاصة (URL)
          </label>
          <Input
            placeholder="أدخل عنوان RSS"
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            className="border-gray-300 focus:border-news-accent focus:ring-news-accent"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleAddFeed} 
        className="bg-news-accent hover:bg-red-700 mt-4"
      >
        إضافة خلاصة جديدة
      </Button>
    </div>
  );
};

export default FeedForm;
