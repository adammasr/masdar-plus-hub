
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      
      // التحقق من مطابقة الرمز السري للإدارة (لمزيد من الأمان)
      const adminToken = localStorage.getItem("adminToken");
      const hasValidToken = adminToken && 
        // توقيع بسيط للتحقق من صلاحية الرمز (يمكن تحسينه لاحقاً)
        atob(adminToken).includes("masdar-plus-admin-");
        
      if (!isAdmin || !hasValidToken) {
        navigate("/admin/login", { replace: true });
      } else {
        setIsVerifying(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-news-accent" />
          <p className="mt-2 text-gray-600">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
