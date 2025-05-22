import React, { createContext, useContext } from "react";

// يمكنك إضافة القيم الفعلية لاحقًا حسب الاستخدام في AdminSidebar
const AuthContext = createContext<{ user?: any }>({ user: undefined });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={{ user: undefined }}>
    {children}
  </AuthContext.Provider>
);

export default AuthContext;
