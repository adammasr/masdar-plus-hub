import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

type VideoItem = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
};

const YOUTUBE_RSS_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCOsJ64U6e15Q1t64UK2FTgQ";

// نستخدم خدمة خارجية لتحويل RSS إلى JSON (حل عملي وسريع)
const parseYouTubeRSS = async (): Promise<VideoItem[]> => {
  try {
    // استخدم خدمة rss2json (مجانًا)
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(YOUTUBE_RSS_URL)}`
    );
    const data = await response.json();
    if (!data.items) return [];
    return data.items.map((item: any) => ({
      id: item.guid.split(":").pop(),
      title: item.title,
      publishedAt: item.pubDate,
      thumbnail: item.thumbnail,
      description: item.description,
    }));
  } catch {
    return [];
  }
};

const Videos = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    parseYouTubeRSS().then((videos) => {
      setVideos(videos);
      setLoading(false);
    });
  }, []);

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Video className="ml-2 text-news-accent" />
          فيديوهات
        </h1>
        <p className="text-gray-600">أحدث مقاطع الفيديو من قناة اليوتيوب</p>
      </div>
      {loading && <div>جاري التحميل...</div>}
      {!loading && videos.length === 0 && <div>لا توجد فيديوهات متاحة حالياً.</div>}
      {!loading && videos.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col"
            >
              <div className="relative aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <span className="bg-news-accent/10 text-news-accent text-xs py-1 px-2 rounded-full mb-2">
                  {new Date(video.publishedAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <h2 className="text-lg font-bold mb-2">{video.title}</h2>
                <div
                  className="text-gray-600 text-sm line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: video.description }}
                />
                <Button
                  className="mt-4 bg-news-accent hover:bg-red-700"
                  asChild
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    مشاهدة على يوتيوب
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Videos;
