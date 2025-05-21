
import { Link } from "react-router-dom";
import { Article } from "../../context/ArticleContext";
import { Play } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  const { title, excerpt, image, category, date, videoUrl } = article;
  
  return (
    <div className={`news-card ${featured ? 'md:flex' : ''}`}>
      <div className={`relative ${featured ? 'md:w-2/5' : ''}`}>
        <img
          src={image}
          alt={title}
          className={`w-full h-48 object-cover ${featured ? 'md:h-full' : ''}`}
        />
        <span className="news-category absolute top-2 right-2">
          {category}
        </span>
        {videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-news-accent rounded-full p-2">
              <Play className="text-white" size={24} />
            </div>
          </div>
        )}
      </div>
      <div className={`p-4 ${featured ? 'md:w-3/5' : ''}`}>
        <h3 className={`news-title ${featured ? 'text-3xl' : 'text-xl'}`}>{title}</h3>
        <p className="news-excerpt">{excerpt}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="news-date">{date}</span>
          <Link
            to="#"
            className="text-news-accent hover:underline"
          >
            اقرأ المزيد
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
