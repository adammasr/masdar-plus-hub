
import { useState, useMemo, useEffect } from "react";
import { useArticles } from "../context/ArticleContext";

// Import the new components
import NewsHeader from "../components/news/NewsHeader";
import FilterSection from "../components/news/FilterSection";
import NewsGrid from "../components/news/NewsGrid";
import PaginationControls from "../components/news/PaginationControls";

const PAGE_SIZE = 8; // عدد الأخبار في كل صفحة

const News = () => {
  const { articles } = useArticles();

  // التاريخ المعتمد لبدء عرض الأخبار
  const startSyncDate = new Date("2025-05-21T00:00:00");

  // البحث والفلترة
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);

  // فلترة الأخبار حسب التصنيف والتاريخ
  const newsArticles = useMemo(
    () =>
      articles
        .filter((a) => a.category === "أخبار" && new Date(a.date) >= startSyncDate)
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [articles]
  );

  // قائمة المصادر
  const sources = useMemo(
    () =>
      [...new Set(newsArticles.map((article) => article.source).filter(Boolean))],
    [newsArticles]
  );

  // تطبيق الفلترة والبحث
  const filteredArticles = useMemo(() => {
    let result = newsArticles;
    if (sourceFilter) result = result.filter((a) => a.source === sourceFilter);
    if (search.trim())
      result = result.filter(
        (a) =>
          a.title?.toLowerCase().includes(search.toLowerCase()) ||
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

  // تحسين SEO: تغيير عنوان الصفحة
  useEffect(() => {
    document.title = "الأخبار | مصدر بلس";
  }, []);

  return (
    <div className="py-6 px-2 sm:px-0 max-w-5xl mx-auto">
      <NewsHeader 
        startSyncDate={startSyncDate} 
        latestNewsTitle={newsArticles.length > 0 ? newsArticles[0].title : undefined}
      />

      <FilterSection 
        search={search}
        setSearch={setSearch}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        sources={sources}
      />

      {/* عرض الأخبار */}
      <div className="mt-8">
        <NewsGrid articles={pagedArticles} />
      </div>

      {/* ترقيم الصفحات */}
      <PaginationControls 
        page={page}
        pageCount={pageCount}
        setPage={setPage}
      />
    </div>
  );
};

export default News;
