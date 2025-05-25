
import { useEffect, useMemo, useState } from "react";
import { useArticles } from "../context/ArticleContext";
import FeaturedArticles from "../components/articles/FeaturedArticles";
import { TrendingUp, PieChart, Video, Brain, Shield, Globe } from "lucide-react";

// Import refactored components
import Navigation from "../components/home/Navigation";
import SearchBar from "../components/home/SearchBar";
import BreakingNews from "../components/home/BreakingNews";
import SyncDate from "../components/home/SyncDate";
import LatestNews from "../components/home/LatestNews";
import CategorySection from "../components/home/CategorySection";
import VideoSection from "../components/home/VideoSection";

// وقت بداية الأخبار (يفضل وضعها في إعدادات عامة أو ملف ثابت)
const startSyncDate = new Date("2025-05-21T00:00:00");

const Home = () => {
  const { articles } = useArticles();
  const [search, setSearch] = useState("");

  // أحدث الأخبار العاجلة (الأخبار التي تم نشرها في آخر 6 ساعات)
  const breakingNews = useMemo(
    () => {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
      return articles
        .filter((a) => new Date(a.date) >= startSyncDate && new Date(a.date) >= sixHoursAgo)
        .filter((a) => a.category === "أخبار" || a.category === "سياسة")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5); // أحدث 5 أخبار عاجلة
    },
    [articles]
  );

  // أحدث الأخبار مع البحث
  const latestNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "أخبار" && new Date(a.date) >= startSyncDate
        )
        .filter(
          (a) =>
            !search ||
            a.title?.toLowerCase().includes(search.toLowerCase()) ||
            (a.excerpt?.toLowerCase().includes(search.toLowerCase()) ?? false)
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6),
    [articles, search]
  );

  const politicsNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "سياسة" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );
  
  const economyNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "اقتصاد" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const aiNews = useMemo(
    () =>
      articles
        .filter(
          (a) => (a.category === "ذكاء اصطناعي" || a.title.toLowerCase().includes("ذكاء اصطناعي") || a.title.toLowerCase().includes("ai")) && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const militaryNews = useMemo(
    () =>
      articles
        .filter(
          (a) => (a.category === "عسكرية" || a.title.toLowerCase().includes("عسكري") || a.title.toLowerCase().includes("دفاع")) && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const worldNews = useMemo(
    () =>
      articles
        .filter(
          (a) => (a.category === "العالم" || a.category === "دولية") && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );
  
  const videoArticles = useMemo(
    () =>
      articles
        .filter((a) => !!a.videoUrl && new Date(a.date) >= startSyncDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2),
    [articles]
  );

  // تحسين SEO
  useEffect(() => {
    document.title = "الرئيسية | مصدر بلس";
  }, []);

  return (
    <div className="container mx-auto py-6 px-2">
      {/* Navigation */}
      <Navigation />

      {/* Breaking News - Only show if there are recent breaking news */}
      {breakingNews.length > 0 && <BreakingNews breakingNews={breakingNews} />}

      {/* Search Bar */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Sync Date */}
      <SyncDate startSyncDate={startSyncDate} />

      {/* Featured Articles */}
      <FeaturedArticles />

      {/* Latest News */}
      <LatestNews latestNews={latestNews} />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Politics */}
        <CategorySection 
          title="السياسة" 
          icon={TrendingUp} 
          articles={politicsNews} 
          linkPath="/politics" 
        />
        
        {/* Economy */}
        <CategorySection 
          title="الاقتصاد" 
          icon={PieChart} 
          articles={economyNews} 
          linkPath="/economy" 
        />
        
        {/* Videos */}
        <VideoSection videoArticles={videoArticles} />
      </div>

      {/* New Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* AI News */}
        <CategorySection 
          title="الذكاء الاصطناعي" 
          icon={Brain} 
          articles={aiNews} 
          linkPath="/ai" 
        />
        
        {/* Military News */}
        <CategorySection 
          title="الأخبار العسكرية" 
          icon={Shield} 
          articles={militaryNews} 
          linkPath="/military" 
        />
        
        {/* World News */}
        <CategorySection 
          title="أخبار العالم" 
          icon={Globe} 
          articles={worldNews} 
          linkPath="/world" 
        />
      </div>
    </div>
  );
};

export default Home;
