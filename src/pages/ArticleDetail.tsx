
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
  Tag,
  Eye,
  MapPin,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ArticleCard from "../components/articles/ArticleCard";
import { estimateReadingTime } from "../utils/newsFormatter";
import { toast } from "sonner";

const LOGO_SRC = "/logo.png";

const ArticleDetail = () => {
  const { articleId, id } = useParams<{ articleId?: string; id?: string }>();
  const { articles } = useArticles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const currentId = articleId || id;
  const article = articles.find(a => a.id === currentId);
  
  // الحصول على مقالات ذات صلة
  const relatedArticles = articles
    .filter(a => {
      if (a.id === currentId) return false;
      
      if (article?.tags && a.tags) {
        const sharedTags = article.tags.filter(tag => a.tags?.includes(tag));
        if (sharedTags.length > 0) return true;
      }
      
      return a.category === article?.category;
    })
    .slice(0, 3);
  
  const readingTime = article ? estimateReadingTime(article.content) : 0;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", { 
      year: "numeric", 
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  
  // تحسين مشاركة المقال
  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = article?.title || "مقال من مصدر بلس";
    
    try {
      switch(platform) {
        case "facebook":
          const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
          window.open(fbUrl, "_blank", "width=600,height=400");
          toast.success("تم فتح فيسبوك للمشاركة");
          break;
          
        case "twitter":
          const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&via=MasdarPlus`;
          window.open(twitterUrl, "_blank", "width=600,height=400");
          toast.success("تم فتح تويتر للمشاركة");
          break;
          
        case "copy":
          await navigator.clipboard.writeText(url);
          toast.success("تم نسخ رابط المقال!");
          break;
          
        default:
          if (navigator.share) {
            await navigator.share({ 
              title, 
              url,
              text: article?.excerpt || "اقرأ هذا المقال من مصدر بلس"
            });
            toast.success("تم مشاركة المقال");
          } else {
            await navigator.clipboard.writeText(url);
            toast.success("تم نسخ رابط المقال!");
          }
      }
    } catch (error) {
      console.error("خطأ في المشاركة:", error);
      toast.error("فشل في المشاركة، يرجى المحاولة مرة أخرى");
    }
  };
  
  // إنشاء محتوى مفصل للمقال مع تحليل شامل
  const generateDetailedContent = (article: any) => {
    let detailedContent = article.content;
    
    // إضافة معلومات تفصيلية وسياق أوسع حسب الفئة
    const categoryContext: Record<string, string> = {
      'أخبار': `تأتي هذه التطورات في إطار الأحداث الجارية التي تشهدها البلاد، والتي تعكس التحولات المهمة في مختلف القطاعات. 
      
      وتشير التقارير إلى أن هذا الحدث له تداعيات واسعة على المستوى المحلي والإقليمي، حيث يُتوقع أن يؤثر على مسار الأحداث في الفترة القادمة.
      
      من جانبهم، أكد الخبراء والمختصون أن متابعة هذه التطورات أمر ضروري لفهم التوجهات المستقبلية وتقييم التأثيرات المحتملة على المجتمع والاقتصاد.`,
      
      'سياسة': `يأتي هذا التطور السياسي في إطار الجهود المستمرة لتطوير الأداء الحكومي وتحسين الخدمات المقدمة للمواطنين.
      
      ويعكس هذا القرار التوجه الحكومي نحو تطبيق أفضل الممارسات الدولية في مجال الإدارة العامة، بما يتماشى مع رؤية مصر 2030 للتنمية المستدامة.
      
      وفي هذا السياق، أشار المراقبون السياسيون إلى أن هذه الخطوة تُعد جزءاً من استراتيجية شاملة لتعزيز الشفافية والمساءلة في العمل الحكومي.`,
      
      'اقتصاد': `يُتوقع أن يكون لهذا القرار الاقتصادي تأثير إيجابي على الاقتصاد المصري والأسواق المحلية في الفترة القادمة.
      
      وتشير التوقعات الاقتصادية إلى أن هذا الإجراء سيساهم في تحفيز النمو الاقتصادي وخلق فرص عمل جديدة، خاصة في القطاعات الحيوية.
      
      كما يُتوقع أن يعزز هذا القرار من قدرة الاقتصاد المصري على مواجهة التحديات العالمية والتكيف مع التطورات الدولية في مجال التجارة والاستثمار.`,
      
      'محافظات': `تسعى المحافظات المختلفة إلى تطبيق مثل هذه المبادرات لتحسين جودة الحياة للمواطنين في جميع أنحاء الجمهورية.
      
      وتأتي هذه الجهود في إطار خطة الدولة الشاملة للتنمية المحلية وتطوير البنية التحتية في المحافظات، بما يضمن تحقيق التوازن التنموي بين المناطق المختلفة.
      
      ويُتوقع أن تُسهم هذه المبادرات في تعزيز دور المحافظات في تحقيق التنمية المستدامة ورفع مستوى المعيشة للمواطنين.`,
      
      'ذكاء اصطناعي': `تُعد هذه التطورات التقنية جزءاً من استراتيجية مصر للتحول الرقمي ومواكبة التطورات العالمية في مجال التكنولوجيا.
      
      وتهدف هذه الجهود إلى تعزيز القدرات التقنية المحلية وبناء اقتصاد معرفي قادر على المنافسة عالمياً، مع التركيز على تطوير المهارات الرقمية للشباب المصري.
      
      كما تسعى مصر من خلال هذه المبادرات إلى ترسيخ مكانتها كمركز إقليمي للتكنولوجيا والابتكار في المنطقة العربية والإفريقية.`,
      
      'عسكرية': `تأتي هذه التطورات العسكرية في إطار تعزيز الأمن القومي المصري والحفاظ على الاستقرار في المنطقة.
      
      وتعكس هذه الخطوات الحرص على مواكبة التطورات الأمنية الإقليمية والدولية، مع التأكيد على أن مصر تسعى دائماً للسلام والاستقرار.
      
      ويُشير الخبراء العسكريون إلى أن هذه التطورات تُعزز من قدرة مصر على حماية أمنها القومي ومصالحها الاستراتيجية في المنطقة.`,
      
      'العالم': `يحمل هذا الحدث العالمي تأثيرات مهمة على المنطقة العربية ومصر بشكل خاص، نظراً لموقعها الاستراتيجي ودورها الإقليمي المحوري.
      
      وتُظهر التحليلات الدولية أن مثل هذه الأحداث تؤثر على التوازنات الإقليمية والعلاقات الدولية، مما يتطلب متابعة دقيقة لتداعياتها.
      
      في هذا السياق، تؤكد مصر على أهمية التعاون الدولي والحوار البناء لمواجهة التحديات العالمية المشتركة.`,
      
      'رياضة': `يُعد هذا الإنجاز الرياضي مصدر فخر للرياضة المصرية والعربية، ويعكس المستوى المتقدم الذي وصلت إليه الكوادر الرياضية المصرية.
      
      وتأتي هذه الإنجازات نتيجة للاستثمار المستمر في الرياضة وتطوير البنية التحتية الرياضية، بالإضافة إلى البرامج التدريبية المتطورة.
      
      كما تُسهم هذه النجاحات في تحفيز الشباب المصري لممارسة الرياضة وتحقيق المزيد من الإنجازات على المستوى المحلي والدولي.`,
      
      'تكنولوجيا': `تمثل هذه التطورات التكنولوجية خطوة مهمة في مسيرة التحول الرقمي التي تشهدها مصر، والتي تهدف إلى بناء مجتمع معلوماتي متقدم.
      
      وتُسهم هذه الابتكارات في تحسين جودة الخدمات المقدمة للمواطنين وزيادة كفاءة العمليات في مختلف القطاعات الحكومية والخاصة.
      
      ويُتوقع أن تُحدث هذه التقنيات نقلة نوعية في أساليب العمل التقليدية وتفتح آفاقاً جديدة للنمو والتطوير.`
    };
    
    // إضافة السياق المناسب للفئة
    if (article.category && categoryContext[article.category]) {
      detailedContent += `\n\n${categoryContext[article.category]}`;
    }
    
    // إضافة تحليل عام شامل
    detailedContent += `\n\nوفي الختام، يُشير المحللون إلى أن متابعة هذه التطورات والتفاعل معها بصورة إيجابية يُعد أمراً ضرورياً لتحقيق المصلحة العامة والمساهمة في بناء مستقبل أفضل للوطن والمواطنين.
    
    كما يؤكد الخبراء على أهمية الوعي المجتمعي والمشاركة الفعالة في مثل هذه القضايا، لضمان تحقيق أقصى استفادة من الفرص المتاحة والتعامل الأمثل مع التحديات المحتملة.`;
    
    return detailedContent;
  };
  
  useEffect(() => {
    if (currentId) {
      setLoading(false);
    }
  }, [currentId]);
  
  useEffect(() => {
    if (!loading && !article) {
      navigate("/news", { replace: true });
    }
  }, [article, loading, navigate]);
  
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
    return null;
  }
  
  const detailedContent = generateDetailedContent(article);

  return (
    <div className="py-6 max-w-5xl mx-auto px-4">
      {/* مسار التنقل */}
      <nav className="mb-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-news-accent">الرئيسية</Link>
        <span className="mx-2">›</span>
        <Link to="/news" className="hover:text-news-accent">الأخبار</Link>
        <span className="mx-2">›</span>
        <Link to={`/news?category=${article.category}`} className="hover:text-news-accent">{article.category}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">{article.title.substring(0, 50)}...</span>
      </nav>

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
            onClick={() => handleShare("facebook")}
            title="مشاركة على فيسبوك"
          >
            <Facebook size={18} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("twitter")}
            title="مشاركة على تويتر"
          >
            <Twitter size={18} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare("copy")}
            title="نسخ الرابط"
          >
            <LinkIcon size={18} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare()}
            title="مشاركة"
          >
            <Share2 size={18} />
          </Button>
        </div>
      </div>
      
      {/* بطاقة المقال الرئيسية */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <div className="relative">
          <div className="w-full h-[300px] sm:h-[400px] md:h-[450px] relative">
            <img
              src={article.image || LOGO_SRC}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          </div>
          
          <div className="absolute bottom-0 right-0 w-full p-6 text-white">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-news-accent border-none px-3">{article.category}</Badge>
              {article.isTranslated && (
                <Badge variant="outline" className="bg-blue-500/80 border-none text-white">
                  مترجم
                </Badge>
              )}
              {article.source && (
                <Badge variant="outline" className="bg-white/10 border-white/20">
                  <ExternalLink className="w-3 h-3 ml-1" /> {article.source}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">{article.title}</h1>
            <div className="flex items-center text-gray-100 text-sm mt-2 flex-wrap gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-1" />
                <span>{formatDate(article.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 ml-1" />
                <span>{readingTime} دقائق للقراءة</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 ml-1" />
                <span>مصدر بلس</span>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 md:p-8">
          {/* المقدمة */}
          <div className="text-lg text-gray-600 border-r-4 border-news-accent pr-4 py-2 my-6 bg-gray-50 rounded">
            <p className="font-medium">{article.excerpt}</p>
          </div>

          {/* إبراز المصدر الأصلي */}
          {article.originalSource && (
            <div className="mb-6 p-4 bg-blue-50 border-r-4 border-blue-400 rounded">
              <p className="text-blue-800 text-sm">
                <strong>المصدر الأصلي:</strong> {article.originalSource}
                {article.isTranslated && <span className="mr-2">(تم الترجمة والتحرير)</span>}
              </p>
            </div>
          )}
          
          {/* محتوى المقال المفصل */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: detailedContent.replace(/\n/g, '<br />') }} />
          </div>
          
          {/* معلومات إضافية */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">معلومات إضافية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <strong>تاريخ النشر:</strong> {formatDate(article.date)}
              </div>
              <div>
                <strong>وقت القراءة:</strong> {readingTime} دقائق
              </div>
              <div>
                <strong>الفئة:</strong> {article.category}
              </div>
              <div>
                <strong>المصدر:</strong> {article.source || "مصدر بلس"}
              </div>
            </div>
          </div>
          
          {/* الكلمات المفتاحية */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="text-gray-400" size={18} />
              <span className="text-gray-500 font-medium">الكلمات المفتاحية:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link 
                to={`/news?category=${article.category}`}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
              >
                #{article.category}
              </Link>
              {article.tags && article.tags.map(tag => (
                <Link 
                  key={tag}
                  to={`/news?tag=${tag}`}
                  className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-sm text-blue-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
              {article.source && (
                <Link 
                  to={`/news?source=${article.source}`}
                  className="bg-green-100 hover:bg-green-200 px-3 py-1 rounded-full text-sm text-green-700 transition-colors"
                >
                  #{article.source.replace(/\s+/g, '_')}
                </Link>
              )}
            </div>
          </div>
          
          {/* سؤال للتفاعل */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <h3 className="font-bold text-purple-800 mb-2">ما رأيك؟</h3>
            <p className="text-purple-700">
              شاركنا رأيك حول هذا الموضوع. هل تعتقد أن هذا التطور سيؤثر على مستقبل المجال؟
            </p>
          </div>
          
          {/* أزرار المشاركة */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              className="bg-news-accent hover:bg-news-accent/90 text-white flex items-center gap-2"
              onClick={() => handleShare()}
            >
              <Share2 size={18} />
              <span>مشاركة المقال</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleShare("facebook")}
            >
              <Facebook size={18} />
              <span>فيسبوك</span>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleShare("twitter")}
            >
              <Twitter size={18} />
              <span>تويتر</span>
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
