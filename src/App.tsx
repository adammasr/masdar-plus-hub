import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import News from "./pages/News";
import Politics from "./pages/Politics";
import Economy from "./pages/Economy";
import AI from "./pages/AI";
import Military from "./pages/Military";
import World from "./pages/World";
import Videos from "./pages/Videos";
import Governorates from "./pages/Governorates";
import Sports from "./pages/Sports";
import Technology from "./pages/Technology";
import Cars from "./pages/Cars";
import Art from "./pages/Art";
import Science from "./pages/Science";
import Education from "./pages/Education";
import Accidents from "./pages/Accidents";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import ArticleDetail from "./pages/ArticleDetail";
import SearchResults from "./pages/SearchResults";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/Articles";
import AdminNewArticle from "./pages/admin/NewArticle";
import AdminAds from "./pages/admin/Ads";
import AdminDashboard from "./pages/AdminDashboard";
import RssFeedManager from "./components/admin/RssFeedManager";
import { ArticleProvider } from "./context/ArticleContext";
import useEnhancedAutoSync from "./hooks/useEnhancedAutoSync";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  useEnhancedAutoSync();

  return (
    <QueryClientProvider client={queryClient}>
      <ArticleProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="news" element={<News />} />
              <Route path="news/:id" element={<ArticleDetail />} />
              <Route path="politics" element={<Politics />} />
              <Route path="economy" element={<Economy />} />
              <Route path="ai" element={<AI />} />
              <Route path="military" element={<Military />} />
              <Route path="world" element={<World />} />
              <Route path="videos" element={<Videos />} />
              <Route path="governorates" element={<Governorates />} />
              <Route path="sports" element={<Sports />} />
              <Route path="technology" element={<Technology />} />
              <Route path="cars" element={<Cars />} />
              <Route path="art" element={<Art />} />
              <Route path="science" element={<Science />} />
              <Route path="education" element={<Education />} />
              <Route path="accidents" element={<Accidents />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="search" element={<SearchResults />} />
            </Route>

            {/* Enhanced Admin Dashboard */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Layout isAdmin />}>
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="articles/new" element={<AdminNewArticle />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="rss-feeds" element={<RssFeedManager />} />
              <Route path="categories" element={<div>إدارة الأقسام</div>} />
              <Route path="users" element={<div>إدارة المستخدمين</div>} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ArticleProvider>
    </QueryClientProvider>
  );
}

export default App;
