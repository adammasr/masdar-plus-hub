import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // إذا لم يكن isAdmin صحيحًا سيتم التوجيه ولن يعرض children
  return <>{children}</>;
};

export default ProtectedRoute;
