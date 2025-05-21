import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";
import { useArticles } from "../../context/ArticleContext";
import { Link } from "react-router-dom";
import { TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- استيراد الإعلانات الديناميكية ومكون الإعلان ---
import { ads } from "../../data/ads";
import AdBanner from "../ads/AdBanner";

interface LayoutProps {
  admin?: boolean;
}

const Layout = ({ admin = false }: LayoutProps) => {
  const { articles } = useArticles();

  // Get the most recent articles
  const recentArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // --- إعلان مخصص بين المقالات الرئيسية ---
  const betweenFeaturedAds = ads.filter(
    (ad) => ad.position === "between-featured" && ad.isActive
  );

  return (
    <div className="min-h-screen flex flex-col rtl bg-gray-50">
      <Header />
      <div className="flex flex-1">
        {admin && <AdminSidebar />}
        <main className={`flex-1 p-4 ${admin ? "md:mr-64" : ""}`}>
          <div className={admin ? "" : "container mx-auto"}>
            <div className={admin ? "" : "grid grid-cols-1 lg:grid-cols-4 gap-6"}>
              <div className={`${admin ? "" : "lg:col-span-3"}`}>
                {/* --- Outlet هو مكان ظهور المحتوى الرئيسي --- */}
                <Outlet />

                {/* --- إعلان ديناميكي بين المقالات الرئيسية --- */}
                {!admin && betweenFeaturedAds.length > 0 && (
                  <div className="my-8">
                    {betweenFeaturedAds.map((ad) => (
                      <AdBanner ad={ad} key={ad.id} />
                    ))}
                  </div>
                )}
              </div>

              {!admin && (
                <div className="lg:col-span-1 space-y-6">
                  {/* --- إعلان ديناميكي أعلى الشريط الجانبي --- */}
                  {ads
                    .filter(
                      (ad) => ad.position === "sidebar-top" && ad.isActive
                    )
                    .map((ad) => (
                      <AdBanner ad={ad} key={ad.id} />
                    ))}

                  {/* Recent News Sidebar */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg flex items-center">
                        <Clock className="h-4 w-4 ml-2 text-news-accent" />
                        آخر الأخبار
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        {recentArticles.map((article) => (
                          <div
                            key={article.id}
                            className="border-b pb-4 last:border-0 last:pb-0"
                          >
                            <Link to="#" className="block group">
                              <h3 className="font-bold text-sm group-hover:text-news-accent transition-colors">
                                {article.title}
                              </h3>
                              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                <span>{formatDate(article.date)}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                  {article.category}
                                </span>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trending Topics */}
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3 border-b">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-4 w-4 ml-2 text-news-accent" />
                        مواضيع رائجة
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to="/news"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #مصر
                        </Link>
                        <Link
                          to="/politics"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #السياسة_المصرية
                        </Link>
                        <Link
                          to="/economy"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #الاقتصاد
                        </Link>
                        <Link
                          to="/news"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #الصحة
                        </Link>
                        <Link
                          to="/news"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #كأس_العالم
                        </Link>
                        <Link
                          to="/news"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #التعليم
                        </Link>
                        <Link
                          to="/news"
                          className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 transition-colors"
                        >
                          #المشروعات_القومية
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  {/* --- إعلان ديناميكي أسفل الشريط الجانبي --- */}
                  {ads
                    .filter(
                      (ad) => ad.position === "sidebar-bottom" && ad.isActive
                    )
                    .map((ad) => (
                      <AdBanner ad={ad} key={ad.id} />
                    ))}

                  {/* Banner Ad ثابت إذا لم يوجد إعلان ديناميكي */}
                  {ads.filter(
                    (ad) =>
                      (ad.position === "sidebar-top" ||
                        ad.position === "sidebar-bottom") &&
                      ad.isActive
                  ).length === 0 && (
                    <div className="bg-gray-200 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-500 mb-2">إعلان</p>
                      <div className="h-48 bg-gray-300 rounded flex items-center justify-center">
                        <p className="text-gray-600">مساحة إعلانية</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
