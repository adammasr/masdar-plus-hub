import React, { useEffect, useState } from 'react';
import { TestingService } from '../services/TestingService';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

/**
 * صفحة اختبار النظام
 * تستخدم لاختبار جميع وظائف النظام والتأكد من عملها بشكل صحيح
 */
const SystemTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // تنفيذ جميع الاختبارات
      const results = await TestingService.runAllTests();
      setTestResults(results);
    } catch (err) {
      console.error('خطأ في تنفيذ الاختبارات:', err);
      setError('حدث خطأ أثناء تنفيذ الاختبارات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // تنفيذ الاختبارات تلقائياً عند تحميل الصفحة
    runTests();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">اختبار نظام الأتمتة</h1>
      
      <div className="mb-6">
        <Button 
          onClick={runTests} 
          disabled={isLoading}
          className="bg-news-accent hover:bg-news-accent/90"
        >
          {isLoading ? 'جاري الاختبار...' : 'تشغيل الاختبارات مرة أخرى'}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {testResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.results.fetching ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                اختبار جلب الأخبار
              </CardTitle>
              <CardDescription>
                التحقق من جلب الأخبار من المصادر المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {testResults.results.fetching 
                  ? 'تم جلب الأخبار بنجاح من المصادر المختلفة' 
                  : 'فشل في جلب الأخبار من المصادر'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.results.rewriting ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                اختبار إعادة الصياغة
              </CardTitle>
              <CardDescription>
                التحقق من جودة المحتوى المعاد صياغته
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {testResults.results.rewriting 
                  ? 'تمت إعادة صياغة المحتوى بجودة عالية' 
                  : 'جودة إعادة الصياغة غير كافية'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.results.images ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                اختبار الصور
              </CardTitle>
              <CardDescription>
                التحقق من وجود صور صالحة للأخبار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {testResults.results.images 
                  ? 'الصور متوفرة وصالحة للعرض' 
                  : 'هناك مشكلة في صور الأخبار'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.results.categorization ? (
                  <CheckCircle className="text-green-500" />
                ) : (
                  <XCircle className="text-red-500" />
                )}
                اختبار التصنيف
              </CardTitle>
              <CardDescription>
                التحقق من تنوع تصنيفات الأخبار
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                {testResults.results.categorization 
                  ? 'تم تصنيف الأخبار بشكل صحيح ومتنوع' 
                  : 'هناك مشكلة في تصنيف الأخبار'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
      
      {testResults && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResults.success ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              النتيجة النهائية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-lg font-semibold ${testResults.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResults.success 
                ? 'جميع الاختبارات ناجحة! النظام يعمل بشكل صحيح.' 
                : 'بعض الاختبارات فشلت. يرجى مراجعة التفاصيل أعلاه.'}
            </p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">
              تم تنفيذ الاختبار في: {new Date().toLocaleString('ar-EG')}
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SystemTest;
