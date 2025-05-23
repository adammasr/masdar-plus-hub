
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";

// Define the type for Layout props
export interface LayoutProps {
  isAdmin?: boolean;
}

const Layout = ({ isAdmin = false }: LayoutProps) => {
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {isAdmin ? (
        <div className="flex flex-1 pt-16">
          <AdminSidebar />
          <main className="flex-1 p-4 ml-0 md:ml-64">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="flex-1 pt-16">
          <Outlet />
        </main>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
