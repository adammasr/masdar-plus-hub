
import { Button } from "@/components/ui/button";
import { Article } from "@/context/ArticleContext";
import { Trash2, Edit, Star } from "lucide-react";

interface ArticleActionsProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, featured: boolean) => void;
}

const ArticleActions = ({ 
  article, 
  onEdit, 
  onDelete, 
  onToggleFeatured 
}: ArticleActionsProps) => {
  return (
    <div className="flex gap-1">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onToggleFeatured(article.id, article.featured || false)}
        title={article.featured ? "إزالة من المميز" : "إضافة للمميز"}
      >
        <Star size={14} className={article.featured ? "fill-yellow-400 text-yellow-400" : ""} />
      </Button>
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => onEdit(article)}
      >
        <Edit size={14} />
      </Button>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={() => onDelete(article.id)}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
};

export default ArticleActions;
