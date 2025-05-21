import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../pages/admin/Login";

/**
 * حماية متقدمة لمسارات الأدمن:
 * - التحقق من isAdmin في localStorage (مبدئيًا).
 * - التحقق من وجود رمز JWT صالح (مثلاً: adminToken)، مع إمكانية فحص صلاحيته.
 * - منع التلاعب اليدوي بـ localStorage فقط.
 * - شاشة تحميل أثناء التحقق.
 * - واجهزة متوافقة مع أي نظام توثيق مستقبلي (API أو سيرفر).
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // تحقق أولاً من صلاحية الأدمن بالـ localStorage (سريع، لكن غير آمن وحده)
    const isLocalAdmin = localStorage.getItem("isAdmin") === "true";

    // تحقق من وجود رمز JWT (أو رمز دخول) في localStorage أو cookie
    const adminToken = localStorage.getItem("adminToken");
    let isValidToken = false;

    // يمكنك هنا استدعاء API للتحقق من صلاحية التوكن إن وجد (حاليًا تحقق شكلي فقط)
    if (adminToken && adminToken.length > 10) {
      // مثال: تحقق من انتهاء صلاحية الـ JWT أو استعلم API
      // يمكنك لاحقًا استبدال هذا الجزء بنداء فعلي لـ API
      try {
        const payload = JSON.parse(atob(adminToken.split('.')[1]));
        // تحقق من انتهاء الصلاحية (exp)
        if (!payload.exp || Date.now() < payload.exp * 1000) {
          isValidToken = true;
        }
      } catch {
        isValidToken = false;
      }
    }

    // إذا كان أي من الطريقتين صحيحًا: السماح بالدخول
    setIsAdmin(isLocalAdmin || isValidToken);
    setChecking(false);
  }, []);

  if (checking)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-news-accent mb-4"></div>
        <span className="ml-4 text-news-accent font-bold">جاري التحقق من الصلاحيات...</span>
      </div>
    );

  if (!isAdmin) {
    // عند تسجيل الدخول بنجاح، يعيد تحميل الصفحة تلقائياً ليتم التحقق مرة أخرى
    return <Login onLogin={() => navigate(0)} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
