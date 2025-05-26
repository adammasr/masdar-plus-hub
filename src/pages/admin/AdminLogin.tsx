
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Lock, KeyRound, UserRound } from "lucide-react";

// كود تشفير بسيط للكلمة السرية - في الإنتاج، يجب استخدام طرق أكثر أماناً
const generateToken = (username: string) => {
  return btoa(`masdar-plus-admin-${username}-${new Date().getTime()}`);
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // إزالة أي بيانات سابقة من التخزين المحلي
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    
    // التحقق من بيانات المستخدم
    setTimeout(() => {
      // استرجاع المستخدمين من التخزين المحلي (أو استخدام قيمة افتراضية)
      const savedUsersJson = localStorage.getItem("adminUsers");
      const savedUsers = savedUsersJson 
        ? JSON.parse(savedUsersJson) 
        : [{ username: "admin", password: "01208213342tozfek400" }];
      
      const user = savedUsers.find(
        (u: { username: string; password: string }) => 
          u.username === username && u.password === password
      );
      
      if (user) {
        // تخزين بيانات المستخدم
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminToken", generateToken(username));
        localStorage.setItem("adminUsername", username);
        
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/admin", { replace: true });
      } else {
        setError("اسم المستخدم أو كلمة المرور غير صحيحة");
        toast.error("فشل تسجيل الدخول");
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-xl rounded-lg border border-gray-200">
          <div className="text-center mb-6">
            <div className="bg-news-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-news-accent h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">لوحة تحكم المصدر بلس</h2>
            <p className="text-gray-600 text-sm mt-1">الرجاء تسجيل الدخول للوصول للوحة التحكم</p>
          </div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <UserRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pr-10 py-3 border-gray-300 focus:ring-news-accent focus:border-news-accent rounded-md shadow-sm"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 py-3 border-gray-300 focus:ring-news-accent focus:border-news-accent rounded-md shadow-sm"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-news-accent hover:bg-red-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-news-accent transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -mr-1 ml-3 h-5 w-5" />
                  جاري التسجيل...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              هذه الصفحة مخصصة لإدارة الموقع فقط
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
