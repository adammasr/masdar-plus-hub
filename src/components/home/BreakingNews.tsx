
import { Article } from "../../context/ArticleContext";
import { Flame } from "lucide-react";

interface BreakingNewsProps {
  breakingNews: Article[];
}

const BreakingNews = ({ breakingNews }: BreakingNewsProps) => {
  return (
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
  );
};

export default BreakingNews;
