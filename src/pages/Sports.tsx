
import { useEffect, useMemo, useState } from "react";
import { useArticles } from "../context/ArticleContext";
import NewsGrid from "../components/news/NewsGrid";
import NewsHeader from "../components/news/NewsHeader";
import PaginationControls from "../components/news/PaginationControls";
import { AdSlot } from "../components/ads/AdService";
import { Search, Filter } from "lucide-react";

const Sports = () => {
  const { articles } = useArticles();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const articlesPerPage = 12;

  // تصفية أخبار الرياضة
  const sportsArticles = useMemo(() => {
    return articles
      .filter((article) => 
        article.category === "رياضة" || 
        article.title.toLowerCase().includes("رياضة") ||
        article.title.toLowerCase().includes("كرة") ||
        article.title.toLowerCase().includes("مباراة") ||
        article.title.toLowerCase().includes("بطولة")
      )
      .filter((article) =>
        !searchTerm ||
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      )
      .sort((a, b) => {
        if (sortBy === "date") {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        } else {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (sortOrder === "desc") {
            return titleB.localeCompare(titleA);
          } else {
            return titleA.localeCompare(titleB);
          }
        }
      });
  }, [articles, searchTerm, sortBy, sortOrder]);

  // حساب الأخبار للصفحة الحالية
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return sportsArticles.slice(startIndex, endIndex);
  }, [sportsArticles, currentPage]);

  const totalPages = Math.ceil(sportsArticles.length / articlesPerPage);

  useEffect(() => {
    document.title = "الرياضة | مصدر بلس";
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">أخبار الرياضة</h1>
        <p className="text-gray-600">آخر أخبار الرياضة المحلية والعالمية</p>
      </div>
      
      <AdSlot position="header" className="mb-6" />
      
      {/* فلترة البحث */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="search"
            placeholder="ابحث في أخبار الرياضة..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-10 py-2 w-full focus:outline-news-accent transition"
            dir="rtl"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as "date" | "title")}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700"
          >
            <option value="date">ترتيب حسب التاريخ</option>
            <option value="title">ترتيب حسب العنوان</option>
          </select>
          
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as "asc" | "desc")}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700"
          >
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-gray-600">
        تم العثور على <span className="font-semibold text-news-accent">{sportsArticles.length}</span> خبر رياضي
      </div>

      <NewsGrid articles={currentArticles} />

      <AdSlot position="article" className="my-8" />

      <PaginationControls
        page={currentPage}
        pageCount={totalPages}
        setPage={setCurrentPage}
      />

      <AdSlot position="footer" className="mt-8" />
    </div>
  );
};

export default Sports;
