
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useArticles } from "../context/ArticleContext";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Share2, 
  Facebook, 
  Twitter, 
  Link as LinkIcon, 
  ExternalLink,
  Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ArticleCard from "../components/articles/ArticleCard";

// مسار اللوجو
const LOGO_SRC = "/logo.png";

const ArticleDetail = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const { articles } = useArticles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // الحصول على المقال الحالي
  const article = articles.find(a => a.id === articleId);
  
  // الحصول على مقالات ذات صلة من نفس الفئة
  const relatedArticles = articles
    .filter(a => a.category === article?.category && a.id !== articleId)
    .slice(0, 3);
  
  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", { 
      year: "numeric", 
      month: "long", 
      day: "numeric"
    });
  };
  
  // مشاركة المقال
  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const title = article?.title || "مقال من مصدر بلس";
    
    switch(platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard.writeText(url).then(() => {
          alert("تم نسخ الرابط!");
        });
        break;
      default:
        // المشاركة العامة
        if (navigator.share) {
          navigator.share({ title, url })
            .catch(err => console.error("حدث خطأ أثناء المشاركة:", err));
        } else {
          navigator.clipboard.writeText(url);
          alert("تم نسخ رابط المقال!");
        }
    }
  };
  
  // تحميل المقال
  useEffect(() => {
    if (articleId) {
      setLoading(false);
    }
  }, [articleId]);
  
  // إذا لم يوجد المقال
  useEffect(() => {
    if (!loading && !article) {
      navigate("/news", { replace: true });
    }
  }, [article, loading, navigate]);
  
  // تغيير عنوان الصفحة
  useEffect(() => {
    if (article) {
      document.title = `${article.title} | مصدر بلس`;
    }
    return () => {
      document.title = "مصدر بلس";
    };
  }, [article]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }
  
  if (!article) {
    return null; // سنتم إعادة التوجيه قبل ذلك بفضل useEffect
  }
  
  return (
    <div className="py-6 max-w-5xl mx-auto px-4">
      {/* زر العودة والمشاركة */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to="/news" 
          className="flex items-center text-gray-600 hover:text-news-accent transition-colors"
        >
          <ArrowRight className="h-5 w-5 ml-1" />
          <span>العودة للأخبار</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200"
            onClick={() => handleShare("facebook")}
            title="مشاركة على فيسبوك"
          >
            <Facebook size={18} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200"
            onClick={() => handleShare("twitter")}
            title="مشاركة على تويتر"
          >
            <Twitter size={18} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200"
            onClick={() => handleShare("copy")}
            title="نسخ الرابط"
          >
            <LinkIcon size={18} />
          </Button>
        </div>
      </div>
      
      {/* بطاقة المقال الرئيسية */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <div className="relative">
          {/* صورة المقال */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] relative">
            <img
              src={article.image || LOGO_SRC}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          {/* معلومات المقال فوق الصورة */}
          <div className="absolute bottom-0 right-0 w-full p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-news-accent border-none px-3">{article.category}</Badge>
              {article.source && (
                <Badge variant="outline" className="bg-white/10 border-white/20">
                  <ExternalLink className="w-3 h-3 ml-1" /> {article.source}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">{article.title}</h1>
            <div className="flex items-center text-gray-100 text-sm mt-2">
              <Calendar className="h-4 w-4 ml-1" />
              <span>{formatDate(article.date)}</span>
              <span className="mx-2">•</span>
              <Clock className="h-4 w-4 ml-1" />
              <span>5 دقائق للقراءة</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 md:p-8">
          {/* المقدمة */}
          <div className="text-lg text-gray-600 border-r-4 border-news-accent pr-4 py-2 my-6">
            <p>{article.excerpt}</p>
          </div>
          
          {/* محتوى المقال */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          
          {/* الكلمات المفتاحية */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Tag className="text-gray-400" size={18} />
              <span className="text-gray-500">الكلمات المفتاحية:</span>
              <div className="flex flex-wrap gap-2">
                <Link 
                  to={`/news?tag=${article.category}`}
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
                >
                  #{article.category}
                </Link>
                {article.source && (
                  <Link 
                    to={`/news?source=${article.source}`}
                    className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700"
                  >
                    #{article.source.replace(/\s+/g, '_')}
                  </Link>
                )}
              </div>
            </div>
          </div>
          
          {/* زر المشاركة */}
          <div className="mt-8">
            <Button
              className="bg-news-accent hover:bg-news-accent/90 text-white w-full sm:w-auto flex items-center gap-2 justify-center"
              onClick={() => handleShare()}
            >
              <Share2 size={18} />
              <span>مشاركة المقال</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* مقالات ذات صلة */}
      {relatedArticles.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <img src={LOGO_SRC} alt="مصدر بلس" className="w-8 h-8 ml-2" />
            <span>مقالات ذات صلة</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map(relatedArticle => (
              <ArticleCard 
                key={relatedArticle.id} 
                article={relatedArticle} 
                detailUrl={`/news/${relatedArticle.id}`} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
