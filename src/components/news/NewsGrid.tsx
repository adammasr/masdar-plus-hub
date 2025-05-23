
import React from "react";
import { Article } from "../../context/ArticleContext";
import ArticleCard from "../articles/ArticleCard";
import { AdSlot } from "../ads/AdService";

interface NewsGridProps {
  articles: Article[];
}

const NewsGrid = ({ articles }: NewsGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-gray-400 text-lg">
        لا توجد أخبار مطابقة للبحث أو الفلترة.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* إعلان أعلى قائمة الأخبار */}
      <AdSlot position="header" className="mb-6" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article, index) => {
          // إضافة إعلان بعد كل 4 أخبار
          const showAdAfter = (index > 0 && (index + 1) % 4 === 0);
          
          return (
            <React.Fragment key={article.id}>
              <ArticleCard 
                article={article} 
                detailUrl={`/news/${article.id}`}
              />
              
              {showAdAfter && (
                <div className="col-span-full my-4">
                  <AdSlot position="article" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* إعلان أسفل قائمة الأخبار */}
      <AdSlot position="footer" className="mt-6" />
    </div>
  );
};

export default NewsGrid;
