
import { useEffect, useMemo, useState } from "react";
import { useArticles } from "../context/ArticleContext";
import NewsGrid from "../components/news/NewsGrid";
import NewsHeader from "../components/news/NewsHeader";
import FilterSection from "../components/news/FilterSection";
import PaginationControls from "../components/news/PaginationControls";
import { AdSlot } from "../components/ads/AdService";

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
      <NewsHeader title="أخبار الرياضة" />
      
      <AdSlot position="header" className="mb-6" />
      
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        totalArticles={sportsArticles.length}
      />

      <NewsGrid articles={currentArticles} />

      <AdSlot position="article" className="my-8" />

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AdSlot position="footer" className="mt-8" />
    </div>
  );
};

export default Sports;
