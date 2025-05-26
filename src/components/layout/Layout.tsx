
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";
import { SidebarAd } from "../ads/AdService";

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
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-4 mr-0 md:mr-64 min-h-screen bg-gray-50">
            <div className="pt-4">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <div className="flex-1 flex flex-row-reverse">
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
