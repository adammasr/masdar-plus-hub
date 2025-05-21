import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticleContext";
import ArticleGrid from "../components/articles/ArticleGrid";
import { Newspaper, AlertCircle, Calendar, Share2, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PAGE_SIZE = 8; // عدد الأخبار في كل صفحة

const News = () => {
  const { articles } = useArticles();

  // التاريخ المعتمد لبدء عرض الأخبار
  const startSyncDate = new Date("2025-05-21T00:00:00");
  const today = new Date();

  // البحث والفلترة
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);

  // فلترة الأخبار حسب التصنيف والتاريخ
  const newsArticles = useMemo(() =>
    articles
      .filter(a => a.category === "أخبار" && new Date(a.date) >= startSyncDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  , [articles]);

  // قائمة المصادر
  const sources = useMemo(
    () => [...new Set(newsArticles.map(article => article.source).filter(Boolean))],
    [newsArticles]
  );

  // تطبيق الفلترة والبحث
  const filteredArticles = useMemo(() => {
    let result = newsArticles;
    if (sourceFilter) result = result.filter(a => a.source === sourceFilter);
    if (search.trim())
      result = result.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        (a.excerpt?.toLowerCase().includes(search.toLowerCase()) ?? false)
      );
    return result;
  }, [newsArticles, search, sourceFilter]);

  // ترقيم الصفحات
  const pageCount = Math.ceil(filteredArticles.length / PAGE_SIZE);
  useEffect(() => {
    setPage(1); // رجوع للصفحة الأولى عند تغيير البحث/الفلترة
  }, [search, sourceFilter]);

  const pagedArticles = filteredArticles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // مشاركة رابط الخبر
  const handleShare = (url: string) => {
    if (navigator.share) {
      navigator.share({ url });
    } else {
      navigator.clipboard.writeText(url);
      alert("تم نسخ رابط الخبر!");
    }
  };

  // تحديد إذا كان الخبر جديد (آخر 24 ساعة)
  const isNew = (date: string) => {
    const diff = today.getTime() - new Date(date).getTime();
    return diff < 24 * 60 * 60 * 1000;
  };

  // تحسين SEO: تغيير عنوان الصفحة
  useEffect(() => {
    document.title = "الأخبار | مصدر بلس";
  }, []);

  return (
    <div className="py-6 px-2 sm:px-0 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Newspaper className="ml-2 text-news-accent" />
          الأخبار
        </h1>
        <p className="text-gray-600">
          آخر وأهم الأخبار المحلية والعالمية من مصادر موثوقة
        </p>

        {/* تاريخ البداية */}
        <div className="flex items-center mt-3 bg-blue-50 text-blue-800 px-4 py-2 rounded-md text-sm">
          <Calendar className="ml-2 text-blue-600" size={16} />
          تظهر الأخبار بدءًا من تاريخ {startSyncDate.toLocaleDateString("ar-EG")}
        </div>

        {/* شريط الأخبار العاجلة */}
        <div className="bg-news-accent text-white p-3 rounded-md mt-4 flex flex-col md:flex-row items-start md:items-center">
          <div className="flex items-center">
            <AlertCircle className="ml-2" />
            <span className="font-bold mr-1">آخر الأخبار:</span>
          </div>
          <div className="mr-0 md:mr-2 mt-2 md:mt-0 overflow-hidden whitespace-nowrap text-ellipsis w-full">
            {newsArticles.length > 0 ? newsArticles[0].title : "لا توجد أخبار جديدة"}
          </div>
        </div>

        {/* البحث والفلترة */}
        <div className="flex flex-col md:flex-row gap-2 mt-6 items-stretch md:items-end">
          <div className="relative flex-1">
            <input
              type="search"
              placeholder="ابحث عن خبر..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-9 py-2 w-full focus:outline-news-accent transition"
            />
            <Search size={18} className="absolute left-2 top-2.5 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700"
            >
              <option value="">كل المصادر</option>
              {sources.map((source, idx) => (
                <option key={idx} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* عرض الأخبار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {pagedArticles.length > 0 ? (
          pagedArticles.map(article => (
            <div key={article.id} className="border rounded-lg shadow-sm bg-white flex flex-col overflow-hidden group transition hover:shadow-md">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center mb-2 gap-2">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <span className="text-xs text-gray-400">{new Date(article.date).toLocaleDateString("ar-EG")}</span>
                  {isNew(article.date) && (
                    <Badge className="bg-green-100 text-green-700 ml-2">جديد</Badge>
                  )}
                </div>
                <h2 className="text-lg font-bold mb-1 group-hover:text-news-accent transition-colors text-ellipsis overflow-hidden whitespace-nowrap">
                  {article.title}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="mt-auto flex gap-2">
                  <a
                    href={article.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-news-accent text-sm font-medium hover:underline"
                  >
                    قراءة المزيد
                  </a>
                  <button
                    className="ml-auto flex items-center gap-1 text-gray-400 hover:text-news-accent text-xs"
                    title="مشاركة الخبر"
                    onClick={() => handleShare(article.url || window.location.href)}
                  >
                    <Share2 size={15} />
                    مشاركة
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-400 text-lg">
            لا توجد أخبار مطابقة للبحث أو الفلترة.
          </div>
        )}
      </div>

      {/* ترقيم الصفحات */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            السابق
          </button>
          {[...Array(pageCount)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded-md border ${page === i + 1 ? "bg-news-accent text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === pageCount}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-md border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
};

export default News;
