import { useEffect, useMemo, useState } from "react";
import { useArticles } from "../context/ArticleContext";
import FeaturedArticles from "../components/articles/FeaturedArticles";
import { TrendingUp, PieChart, Video, Brain, Shield, Globe, Car, Cpu, Palette, FlaskConical, GraduationCap, AlertTriangle } from "lucide-react";
import { AdSlot } from "../components/ads/AdService";

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

  // الأقسام الجديدة
  const sportsNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "رياضة" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const artNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "فن وثقافة" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const carNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "سيارات" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const techNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "تكنولوجيا" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const scienceNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "علوم" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const universityNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "جامعات وتعليم" && new Date(a.date) >= startSyncDate
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 4),
    [articles]
  );

  const accidentNews = useMemo(
    () =>
      articles
        .filter(
          (a) => a.category === "حوادث" && new Date(a.date) >= startSyncDate
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

      {/* إعلان أعلى الصفحة */}
      <AdSlot position="header" className="mb-6" />

      {/* Breaking News - Only show if there are recent breaking news */}
      {breakingNews.length > 0 && <BreakingNews breakingNews={breakingNews} />}

      {/* Search Bar */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Sync Date */}
      <SyncDate startSyncDate={startSyncDate} />

      {/* Featured Articles */}
      <FeaturedArticles />

      {/* إعلان بين الأقسام */}
      <AdSlot position="article" className="my-8" />

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

      {/* إعلان بين الأقسام */}
      <AdSlot position="article" className="my-8" />

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

      {/* إعلان بين الأقسام */}
      <AdSlot position="article" className="my-8" />

      {/* Additional Categories Grid - Sports, Arts, Cars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Sports News */}
        {sportsNews.length > 0 && (
          <CategorySection 
            title="الرياضة" 
            icon={TrendingUp} 
            articles={sportsNews} 
            linkPath="/sports" 
          />
        )}
        
        {/* Art & Culture News */}
        {artNews.length > 0 && (
          <CategorySection 
            title="فن وثقافة" 
            icon={Palette} 
            articles={artNews} 
            linkPath="/art" 
          />
        )}
        
        {/* Car News */}
        {carNews.length > 0 && (
          <CategorySection 
            title="سيارات" 
            icon={Car} 
            articles={carNews} 
            linkPath="/cars" 
          />
        )}
      </div>

      {/* إعلان بين الأقسام */}
      <AdSlot position="article" className="my-8" />

      {/* Technology, Science, Education Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Technology News */}
        {techNews.length > 0 && (
          <CategorySection 
            title="تكنولوجيا" 
            icon={Cpu} 
            articles={techNews} 
            linkPath="/technology" 
          />
        )}
        
        {/* Science News */}
        {scienceNews.length > 0 && (
          <CategorySection 
            title="علوم" 
            icon={FlaskConical} 
            articles={scienceNews} 
            linkPath="/science" 
          />
        )}
        
        {/* University & Education News */}
        {universityNews.length > 0 && (
          <CategorySection 
            title="جامعات وتعليم" 
            icon={GraduationCap} 
            articles={universityNews} 
            linkPath="/education" 
          />
        )}
      </div>

      {/* إعلان بين الأقسام */}
      <AdSlot position="article" className="my-8" />

      {/* Accidents Section */}
      {accidentNews.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <CategorySection 
            title="حوادث" 
            icon={AlertTriangle} 
            articles={accidentNews} 
            linkPath="/accidents" 
          />
        </div>
      )}

      {/* إعلان أسفل الصفحة */}
      <AdSlot position="footer" className="mt-8" />
    </div>
  );
};

export default Home;
