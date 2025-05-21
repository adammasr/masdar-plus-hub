import ProtectedRoute from "./components/layout/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import News from "./pages/News";
import Politics from "./pages/Politics";
import Economy from "./pages/Economy";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import Governorates from "./pages/Governorates"; // تم إضافة الاستيراد هنا
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/Articles";
import AdminNewArticle from "./pages/admin/NewArticle";
import AdminRssFeeds from "./pages/admin/RssFeeds";
import AdminCategories from "./pages/admin/Categories";
import NotFound from "./pages/NotFound";
import { ArticleProvider } from "./context/ArticleContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ArticleProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="news" element={<News />} />
              <Route path="politics" element={<Politics />} />
              <Route path="economy" element={<Economy />} />
              <Route path="videos" element={<Videos />} />
              <Route path="contact" element={<Contact />} />
              <Route path="governorates" element={<Governorates />} /> {/* إضافة الراوت الخاص بالمحافظات */}
            </Route>
            <Route path="/admin" element={<Layout admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="articles/new" element={<AdminNewArticle />} />
              <Route path="rss-feeds" element={<AdminRssFeeds />} />
              <Route path="categories" element={<AdminCategories />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ArticleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
