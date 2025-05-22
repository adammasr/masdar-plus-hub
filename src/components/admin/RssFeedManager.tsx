import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Article, useArticles } from "../../context/ArticleContext";
import { Trash2, RefreshCw, Clock } from "lucide-react";
import { reformatArticleWithAI, extractImageFromContent, updateArticleDate } from "../../utils/newsFormatter";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// الحماية: السماح فقط لمن لديه isAdmin = "true"
const isAdmin = () => {
  return window?.localStorage?.getItem("isAdmin") === "true";
};

interface RssFeed {
  id: string;
  url: string;
  name: string;
  autoUpdate?: boolean;
  lastUpdated?: string;
}

const RssFeedManager = () => {
  if (!isAdmin()) {
    return (
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-2xl text-gray-800 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-news-accent" />
            إدارة خلاصات RSS
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

  const [feedUrl, setFeedUrl] = useState("");
  const [feedName, setFeedName] = useState("");
  const [feeds, setFeeds] = useState<RssFeed[]>([
    { 
      id: "1", 
      url: "https://feed.informer.com/digests/7HUZFNOFWB/feeder.rss", 
      name: "القاهرة الإخبارية", 
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    },
    { 
      id: "2", 
      url: "https://feed.informer.com/digests/ITT2WR6G42/feeder.rss", 
      name: "المتحدث الرسمي للرئاسة",
      autoUpdate: true,
      lastUpdated: new Date().toISOString()
    }
  ]);
  const { addBatchArticles } = useArticles();
  const [isLoading, setIsLoading] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  // Auto update function
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const updateInterval = setInterval(() => {
      console.log("Auto-updating RSS feeds...");
      const feedsToUpdate = feeds.filter(feed => feed.autoUpdate);
      
      if (feedsToUpdate.length > 0) {
        Promise.all(feedsToUpdate.map(feed => fetchFeedContent(feed, false)))
          .then(() => {
            console.log("All auto-update feeds refreshed");
            setFeeds(prev => prev.map(feed => 
              feed.autoUpdate ? { ...feed, lastUpdated: new Date().toISOString() } : feed
            ));
          })
          .catch(error => console.error("Error during auto-update:", error));
      }
    }, 
