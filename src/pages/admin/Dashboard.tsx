
import { useArticles } from "../../context/ArticleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebhookSetup from "../../components/admin/WebhookSetup";

const AdminDashboard = () => {
  const { articles } = useArticles();

  // Count articles by category
  const categoryCounts: Record<string, number> = {};
  articles.forEach(article => {
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              إجمالي المقالات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              مقالات السياسة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categoryCounts["سياسة"] || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              مقالات الاقتصاد
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{categoryCounts["اقتصاد"] || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              الفيديوهات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {articles.filter(a => a.videoUrl).length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-8">استيراد المقالات</h2>
      <WebhookSetup />

      <h2 className="text-2xl font-bold mt-8">آخر المقالات المضافة</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">العنوان</th>
                <th className="px-6 py-3">القسم</th>
                <th className="px-6 py-3">التاريخ</th>
                <th className="px-6 py-3">المصدر</th>
              </tr>
            </thead>
            <tbody>
              {articles.slice(0, 5).map((article) => (
                <tr key={article.id} className="border-b">
                  <td className="px-6 py-4 font-medium">{article.title}</td>
                  <td className="px-6 py-4">{article.category}</td>
                  <td className="px-6 py-4">{article.date}</td>
                  <td className="px-6 py-4">{article.source || "محرر يدويًا"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [articlesCount, setArticlesCount] = useState(0);

  useEffect(() => {
    // عدّل هذا حسب طريقة جلب الأخبار عندك (مثلاً من localStorage أو API)
    const articles = JSON.parse(localStorage.getItem("articles") || "[]");
    setArticlesCount(articles.length);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">لوحة التحكم</h2>
      <div className="bg-white rounded shadow p-4 mb-4">
        <span className="font-semibold">عدد الأخبار:</span> {articlesCount}
      </div>
      {/* يمكنك إضافة المزيد من الإحصائيات هنا */}
    </div>
  );
};

export default Dashboard;
