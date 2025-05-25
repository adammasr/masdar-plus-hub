import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { NewsItem } from '../types/NewsItem';
import { GeminiService } from '../services/api/GeminiService';

/**
 * صفحة تحليل جودة البيانات
 * تستخدم لتقييم جودة إعادة الصياغة والتصنيف والصور
 */
const QualityAnalysis = () => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  useEffect(() => {
    // تحميل الأخبار من التخزين المحلي
    const storedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
    setArticles(storedArticles);
    
    // اختيار أول خبر تلقائياً إذا كان متاحاً
    if (storedArticles.length > 0) {
      setSelectedArticle(storedArticles[0]);
    }
  }, []);

  const analyzeArticleQuality = async (article: NewsItem) => {
    if (!article) return;
    
    setIsLoading(true);
    
    try {
      // تحليل جودة المحتوى
      const contentQuality = await analyzeContentQuality(article.content);
      
      // تحليل ملاءمة الصورة
      const imageRelevance = analyzeImageRelevance(article.image, article.category, article.title);
      
      // تحليل دقة التصنيف
      const categorizationAccuracy = analyzeCategorization(article.content, article.category);
      
      // حساب الدرجة الإجمالية
      const overallScore = (contentQuality + imageRelevance + categorizationAccuracy) / 3;
      
      setQualityScore(overallScore);
      setAnalysisResults({
        contentQuality,
        imageRelevance,
        categorizationAccuracy,
        details: {
          content: getQualityLevel(contentQuality),
          image: getQualityLevel(imageRelevance),
          categorization: getQualityLevel(categorizationAccuracy)
        }
      });
    } catch (error) {
      console.error('خطأ في تحليل جودة الخبر:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeContentQuality = async (content: string): Promise<number> => {
    // في التطبيق الحقيقي، يمكن استخدام Gemini لتقييم جودة المحتوى
    // هنا نستخدم تقييم بسيط بناءً على طول المحتوى وتنوع الكلمات
    
    if (!content) return 0;
    
    // طول المحتوى (0-5 نقاط)
    const lengthScore = Math.min(content.length / 200, 5);
    
    // تنوع الكلمات (0-3 نقاط)
    const words = content.split(/\s+/);
    const uniqueWords = new Set(words);
    const diversityScore = Math.min((uniqueWords.size / words.length) * 6, 3);
    
    // وجود فقرات (0-2 نقاط)
    const paragraphScore = content.split(/\n\s*\n/).length > 1 ? 2 : 0;
    
    return Math.min((lengthScore + diversityScore + paragraphScore) / 10 * 100, 100);
  };

  const analyzeImageRelevance = (imageUrl: string, category: string, title: string): number => {
    // في التطبيق الحقيقي، يمكن استخدام تحليل الصور للتحقق من ملاءمتها
    // هنا نفترض أن الصور ملائمة إذا كانت موجودة وصالحة
    
    if (!imageUrl) return 0;
    if (!imageUrl.startsWith('http')) return 30;
    
    // تحقق بسيط من صلاحية الصورة
    return 85; // افتراض أن الصورة جيدة إذا كان لها رابط صالح
  };

  const analyzeCategorization = (content: string, category: string): number => {
    // في التطبيق الحقيقي، يمكن إعادة تصنيف المحتوى والمقارنة مع التصنيف الحالي
    // هنا نفترض أن التصنيف دقيق بنسبة عالية
    
    if (!category || category === 'أخبار') return 70; // التصنيف العام أقل دقة
    
    // افتراض أن التصنيفات المحددة أكثر دقة
    const specificCategories = ['سياسة', 'اقتصاد', 'محافظات', 'ذكاء اصطناعي', 'عسكرية', 'العالم'];
    return specificCategories.includes(category) ? 90 : 75;
  };

  const getQualityLevel = (score: number): string => {
    if (score >= 90) return 'ممتاز';
    if (score >= 80) return 'جيد جداً';
    if (score >= 70) return 'جيد';
    if (score >= 60) return 'مقبول';
    return 'يحتاج تحسين';
  };

  const getQualityColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">تحليل جودة البيانات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>الأخبار المتاحة</CardTitle>
              <CardDescription>
                اختر خبراً لتحليل جودته
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto space-y-2">
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <div
                      key={article.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${
                        selectedArticle?.id === article.id
                          ? 'bg-news-accent/20 border border-news-accent/30'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setSelectedArticle(article)}
                    >
                      <h3 className="font-semibold truncate">{article.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {article.category} - {article.source}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    لا توجد أخبار متاحة للتحليل
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedArticle ? (
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">معاينة الخبر</TabsTrigger>
                <TabsTrigger value="analysis">تحليل الجودة</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedArticle.title}</CardTitle>
                    <CardDescription>
                      {selectedArticle.category} - {selectedArticle.source} - {selectedArticle.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedArticle.image && (
                      <div className="mb-4">
                        <img
                          src={selectedArticle.image}
                          alt={selectedArticle.title}
                          className="w-full h-64 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50' y='50' font-family='Arial' font-size='14' text-anchor='middle' alignment-baseline='middle' fill='%23999'%3Eالصورة غير متاحة%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    )}
                    <div className="prose max-w-none dark:prose-invert">
                      {selectedArticle.content.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => analyzeArticleQuality(selectedArticle)}
                      disabled={isLoading}
                      className="bg-news-accent hover:bg-news-accent/90"
                    >
                      {isLoading ? 'جاري التحليل...' : 'تحليل جودة الخبر'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>نتائج تحليل الجودة</CardTitle>
                    <CardDescription>
                      تقييم جودة المحتوى والصور والتصنيف
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {qualityScore !== null && analysisResults ? (
                      <div>
                        <div className="mb-6 text-center">
                          <div className="text-4xl font-bold mb-2 inline-block rounded-full bg-gray-100 dark:bg-gray-800 w-24 h-24 flex items-center justify-center">
                            <span className={getQualityColor(qualityScore)}>
                              {Math.round(qualityScore)}%
                            </span>
                          </div>
                          <p className={`text-lg font-semibold ${getQualityColor(qualityScore)}`}>
                            {getQualityLevel(qualityScore)}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                            <h3 className="font-semibold mb-2">جودة المحتوى</h3>
                            <div className={`text-xl font-bold ${getQualityColor(analysisResults.contentQuality)}`}>
                              {Math.round(analysisResults.contentQuality)}%
                            </div>
                            <p className="text-sm mt-1">{analysisResults.details.content}</p>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                            <h3 className="font-semibold mb-2">ملاءمة الصورة</h3>
                            <div className={`text-xl font-bold ${getQualityColor(analysisResults.imageRelevance)}`}>
                              {Math.round(analysisResults.imageRelevance)}%
                            </div>
                            <p className="text-sm mt-1">{analysisResults.details.image}</p>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                            <h3 className="font-semibold mb-2">دقة التصنيف</h3>
                            <div className={`text-xl font-bold ${getQualityColor(analysisResults.categorizationAccuracy)}`}>
                              {Math.round(analysisResults.categorizationAccuracy)}%
                            </div>
                            <p className="text-sm mt-1">{analysisResults.details.categorization}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">توصيات التحسين</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {analysisResults.contentQuality < 80 && (
                              <li>تحسين جودة المحتوى المعاد صياغته بإضافة المزيد من التفاصيل والفقرات</li>
                            )}
                            {analysisResults.imageRelevance < 80 && (
                              <li>استخدام صور أكثر ارتباطاً بموضوع الخبر</li>
                            )}
                            {analysisResults.categorizationAccuracy < 80 && (
                              <li>مراجعة تصنيف الخبر للتأكد من دقته</li>
                            )}
                            {(analysisResults.contentQuality >= 80 && 
                              analysisResults.imageRelevance >= 80 && 
                              analysisResults.categorizationAccuracy >= 80) && (
                              <li>جودة الخبر جيدة، لا توجد توصيات محددة للتحسين</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          {isLoading 
                            ? 'جاري تحليل جودة الخبر...' 
                            : 'اضغط على زر "تحليل جودة الخبر" لعرض النتائج'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-gray-500">
                  يرجى اختيار خبر من القائمة لتحليل جودته
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityAnalysis;
