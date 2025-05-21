
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminSidebar from "./AdminSidebar";

interface LayoutProps {
  admin?: boolean;
}

const Layout = ({ admin = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col rtl">
      <Header />
      <div className="flex flex-1">
        {admin && <AdminSidebar />}
        <main className={`flex-1 p-4 ${admin ? 'md:mr-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
