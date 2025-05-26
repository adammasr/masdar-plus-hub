
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useArticles } from "../context/ArticleContext";
import { Search } from "lucide-react";
import NewsGrid from "../components/news/NewsGrid";
import PaginationControls from "../components/news/PaginationControls";
import { AdSlot } from "../components/ads/AdService";
import { Card } from "@/components/ui/card";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { articles } = useArticles();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;
  
  const query = searchParams.get("q") || "";

  // تصفية الأخبار بناءً على البحث
  const searchResults = useMemo(() => {
    if (!query) return [];
    
    const searchTerm = query.toLowerCase();
    return articles
      .filter((article) => 
        article.title.toLowerCase().includes(searchTerm) ||
        (article.excerpt?.toLowerCase().includes(searchTerm) ?? false) ||
        (article.content?.toLowerCase().includes(searchTerm) ?? false)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, query]);

  // حساب الأخبار للصفحة الحالية
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    return searchResults.slice(startIndex, endIndex);
  }, [searchResults, currentPage]);

  const totalPages = Math.ceil(searchResults.length / articlesPerPage);

  useEffect(() => {
    document.title = query ? `البحث عن: ${query} | مصدر بلس` : "نتائج البحث | مصدر بلس";
  }, [query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  return (
    <div className="container mx-auto py-6 px-4">
      <AdSlot position="header" className="mb-6" />
      
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-6 w-6 text-news-accent" />
          <h1 className="text-2xl font-bold text-gray-800">نتائج البحث</h1>
        </div>
        
        {query ? (
          <div className="space-y-3">
            <p className="text-gray-600">
              البحث عن: <span className="font-semibold text-gray-800">"{query}"</span>
            </p>
            <p className="text-gray-600">
              تم العثور على <span className="font-semibold text-news-accent">{searchResults.length}</span> نتيجة
            </p>
          </div>
        ) : (
          <p className="text-gray-600">الرجاء إدخال كلمة للبحث</p>
        )}
      </Card>

      {query && searchResults.length > 0 ? (
        <>
          <NewsGrid articles={currentArticles} />
          
          <AdSlot position="article" className="my-8" />
          
          {totalPages > 1 && (
            <PaginationControls
              page={currentPage}
              pageCount={totalPages}
              setPage={setCurrentPage}
            />
          )}
        </>
      ) : query ? (
        <Card className="p-8 text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">لم يتم العثور على نتائج</h2>
          <p className="text-gray-500">جرب استخدام كلمات مختلفة أو تحقق من الإملاء</p>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">ابدأ البحث</h2>
          <p className="text-gray-500">استخدم شريط البحث في الأعلى للعثور على الأخبار التي تهمك</p>
        </Card>
      )}

      <AdSlot position="footer" className="mt-8" />
    </div>
  );
};

export default SearchResults;
