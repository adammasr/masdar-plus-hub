import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";
import SidebarAd from "../SidebarAd"; // استيراد الإعلان الجانبي

export interface LayoutProps {
  isAdmin?: boolean;
}

const Layout = ({ isAdmin = false }: LayoutProps) => {
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
        <div className="flex-1 pt-16 flex flex-row-reverse">
          <main className="flex-1">
            <Outlet />
          </main>
          <SidebarAd />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Layout;
