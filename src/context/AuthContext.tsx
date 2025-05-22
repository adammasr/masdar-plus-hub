
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// نوع المستخدم (يمكنك تخصيصه حسب خصائص المستخدم في مشروعك)
export interface User {
  id: string;
  name: string;
  email: string;
  role: string; // إضافة خاصية role
  // ... يمكنك إضافة المزيد من الحقول مثل token, avatar ...
}

interface AuthContextType {
  user?: User | null;
  setUser: (user: User | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setUser: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // مثال: تحميل المستخدم من localStorage (يمكن استبداله باستدعاء API أو JWT)
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // حفظ المستخدم في localStorage عند التغيير
  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  // تسجيل الخروج
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    // يمكنك إضافة أي منطق إضافي هنا مثل إعادة التوجيه
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
