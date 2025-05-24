
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Politics from "./pages/Politics";
import Economy from "./pages/Economy";
import Governorates from "./pages/Governorates";
import News from "./pages/News";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ArticleDetail from "./pages/ArticleDetail";
import { ArticleProvider } from "./context/ArticleContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { AutoSyncService } from "./services/AutoSyncService";
import { useEffect } from "react";

// Admin routes
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import RssFeeds from "./pages/admin/RssFeeds";
import Categories from "./pages/admin/Categories";
import Articles from "./pages/admin/Articles";
import NewArticle from "./pages/admin/NewArticle";
import Users from "./pages/admin/Users";
import Ads from "./pages/admin/Ads";

import "./App.css";
import { Toaster } from "sonner";

function App() {
  useEffect(() => {
    // تهيئة خدمة المزامنة التلقائية
    const autoSync = AutoSyncService.getInstance();
    
    return () => {
      // تنظيف الخدمة عند إغلاق التطبيق
      autoSync.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      <ArticleProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="politics" element={<Politics />} />
              <Route path="economy" element={<Economy />} />
              <Route path="governorates" element={<Governorates />} />
              <Route path="news" element={<News />} />
              <Route path="videos" element={<Videos />} />
              <Route path="contact" element={<Contact />} />
              <Route path="news/:id" element={<ArticleDetail />} />
              <Route path="article/:id" element={<ArticleDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin login route - public but hidden */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout isAdmin={true} />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<Articles />} />
              <Route path="articles/new" element={<NewArticle />} />
              <Route path="rss-feeds" element={<RssFeeds />} />
              <Route path="categories" element={<Categories />} />
              <Route path="users" element={<Users />} />
              <Route path="ads" element={<Ads />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </Router>
      </ArticleProvider>
    </AuthProvider>
  );
}

export default App;
