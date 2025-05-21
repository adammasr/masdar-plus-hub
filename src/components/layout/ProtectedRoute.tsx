import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../pages/admin/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
    setChecking(false);
  }, []);

  if (checking) return null;

  if (!isAdmin) {
    return <Login onLogin={() => navigate(0)} />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
