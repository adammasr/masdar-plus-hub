import { useEffect, useMemo, useState } from "react";
import { useArticles } from "../context/ArticleContext";
import FeaturedArticles from "../components/articles/FeaturedArticles";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Newspaper,
  TrendingUp,
  PieChart,
  Video,
  Play,
  Calendar,
  Flame,
  Search,
  Share2,
  SunMoon,
} from "lucide-react";

// وقت بداية الأخبار (يفضل وضعها في إعدادات عامة أو ملف ثابت)
const startSyncDate = new Date("2025-05-21T00:00:00");

const Home = () => {
  const { articles } = useArticles();
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const today = new Date();

  // شريط الأخبار العاجلة
  const breakingNews = useMemo(
    () =>
      articles
        .filter((a) => new Date(a.date) >= startSyncDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3),
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
  const videoArticles = useMemo(
    () =>
      articles
        .filter((a) => !!a.videoUrl && new Date(a.date) >= startSyncDate)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2),
    [articles]
  );

  // دعم الوضع الليلي (تحسين: استخدم class على html بدلاً من body إذا كان عندك darkMode: "class" في tailwind)
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // تحسين SEO
  useEffect(() => {
    document.title = "الرئيسية | مصدر بلس";
  }, []);

  // شارة جديد
  const isNew = (date: string) =>
    today.getTime() - new Date(date).getTime() < 24 * 60 * 60 * 1000;

  // مشاركة رابط الخبر
  const handleShare = (url: string) => {
    if (navigator.share) {
      navigator.share({ url });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("تم نسخ رابط الخبر!");
    } else {
      window.prompt("انسخ الرابط:", url);
    }
  };

  return (
    <div className="container mx-auto py-6 px-2">
      {/* شريط التنقل */}
      <nav className="flex items-center justify-between mb-4 py-2 px-2 md:px-6 rounded-lg bg-white/80 dark:bg-gray-900/70 shadow">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-news-accent">
            مصدر بلس
          </Link>
          <Link
            to="/news"
            className="hover:text-news-accent text-gray-600 font-medium"
          >
            الأخبار
          </Link>
          <Link
            to="/politics"
            className="hover:text-news-accent text-gray-600 font-medium"
          >
            السياسة
          </Link>
          <Link
            to="/economy"
            className="hover:text-news-accent text-gray-600 font-medium"
          >
            الاقتصاد
          </Link>
          <Link
            to="/videos"
            className="hover:text-news-accent text-gray-600 font-medium"
          >
            فيديوهات
          </Link>
        </div>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-news-accent/10"
          title="تبديل الوضع الليلي"
          aria-label="تبديل الوضع الليلي"
        >
          <SunMoon />
        </button>
      </nav>

      {/* شريط الأخبار العاجلة */}
      <div className="mb-6">
        <div className="bg-news-accent text-white rounded-md py-2 px-4 flex items-center gap-2 animate-pulse">
          <Flame size={18} className="text-yellow-300" />
          <span className="font-bold">عاجل:</span>
          <div className="flex-1 overflow-x-hidden whitespace-nowrap">
            <span className="inline-block animate-marquee rtl:animate-marquee-rtl">
              {breakingNews.map((a) => a.title).join(" | ")}
            </span>
          </div>
        </div>
      </div>

      {/* مربع البحث */}
      <div className="flex items-center gap-2 mb-8 max-w-lg mx-auto">
        <div className="relative flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن خبر أو كلمة مفتاحية..."
            className="w-full border border-gray-300 rounded-md px-10 py-2 focus:outline-news-accent"
            aria-label="بحث"
            dir="rtl"
          />
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* تاريخ البداية */}
      <div className="flex items-center mb-4 bg-blue-50 text-blue-800 px-4 py-2 rounded-md">
        <Calendar className="ml-2 text-blue-600" size={18} />
        <span>
          تظهر الأخبار بدءًا من تاريخ{" "}
          {startSyncDate.toLocaleDateString("ar-EG")}
        </span>
      </div>

      {/* مقالات مميزة */}
      <FeaturedArticles />

      {/* أحدث الأخبار */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
          <h2 className="text-2xl font-bold flex items-center">
            <Newspaper size={24} />
            <span className="mr-2">أحدث الأخبار</span>
          </h2>
          <Link
            to="/news"
            className="text-news-accent hover:underline text-sm font-medium"
          >
            عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestNews.map((article) => (
            <div
              key={article.id}
              className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow hover:shadow-lg flex flex-col group transition"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  {isNew(article.date) && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      جديد
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(article.date).toLocaleDateString("ar-EG")}
                  </span>
                  {article.source && (
                    <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {article.source}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-news-accent transition">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex-1 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-auto">
                  <Link
                    to={article.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-news-accent text-xs hover:underline"
                  >
                    التفاصيل
                  </Link>
                  <button
                    onClick={() =>
                      handleShare(article.url || window.location.href)
                    }
                    title="مشاركة الخبر"
                    className="ml-auto text-gray-400 hover:text-news-accent text-xs flex items-center gap-1"
                  >
                    <Share2 size={16} /> مشاركة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أقسام السياسة والاقتصاد والفيديوهات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* السياسة */}
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp size={22} />
                <span className="mr-2">السياسة</span>
              </h2>
              <Link
                to="/politics"
                className="text-news-accent hover:underline text-sm font-medium"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {politicsNews.length > 0 ? (
                politicsNews.map((article) => (
                  <div
                    key={article.id}
                    className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0"
                  >
                    <Link to={article.url || "#"} className="block group">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-news-accent transition">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">
                          {new Date(article.date).toLocaleDateString("ar-EG")}
                        </span>
                        {article.source && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {article.source}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  لا توجد أخبار سياسية حالياً
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        {/* الاقتصاد */}
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
              <h2 className="text-2xl font-bold flex items-center">
                <PieChart size={22} />
                <span className="mr-2">الاقتصاد</span>
              </h2>
              <Link
                to="/economy"
                className="text-news-accent hover:underline text-sm font-medium"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-4">
              {economyNews.length > 0 ? (
                economyNews.map((article) => (
                  <div
                    key={article.id}
                    className="border-b pb-3 mb-3 last:border-0 last:mb-0 last:pb-0"
                  >
                    <Link to={article.url || "#"} className="block group">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-news-accent transition">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-2 text-sm line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-xs">
                          {new Date(article.date).toLocaleDateString("ar-EG")}
                        </span>
                        {article.source && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {article.source}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  لا توجد أخبار اقتصادية حالياً
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        {/* الفيديوهات */}
        <Card className="h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-news-accent">
              <h2 className="text-2xl font-bold flex items-center">
                <Video size={22} />
                <span className="mr-2">فيديوهات</span>
              </h2>
              <Link
                to="/videos"
                className="text-news-accent hover:underline text-sm font-medium"
              >
                عرض الكل
              </Link>
            </div>
            <div className="space-y-6">
              {videoArticles.length > 0 ? (
                videoArticles.map((article) => (
                  <div key={article.id} className="relative group">
                    <div className="relative">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                        <div className="bg-news-accent/80 rounded-full p-3 group-hover:scale-110 transition-transform">
                          <Play className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-2 font-bold group-hover:text-news-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(article.date).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">
                  لا توجد فيديوهات حالياً
                </p>
              )}
              <div className="text-center pt-2">
                <Link
                  to="/videos"
                  className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md text-sm transition-colors w-full"
                >
                  مشاهدة المزيد من الفيديوهات
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
