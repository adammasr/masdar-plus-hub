
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ArticleProvider } from "./context/ArticleContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import Home from "./pages/Home";
import News from "./pages/News";
import Politics from "./pages/Politics";
import Economy from "./pages/Economy";
import Videos from "./pages/Videos";
import Governorates from "./pages/Governorates";
import Contact from "./pages/Contact";
import ArticleDetail from "./pages/ArticleDetail";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Articles from "./pages/admin/Articles";
import Categories from "./pages/admin/Categories";
import NewArticle from "./pages/admin/NewArticle";
import Users from "./pages/admin/Users";
import RssFeeds from "./pages/admin/RssFeeds";
import NotFound from "./pages/NotFound";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ArticleProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="news" element={<News />} />
              <Route path="news/:articleId" element={<ArticleDetail />} />
              <Route path="politics" element={<Politics />} />
              <Route path="economy" element={<Economy />} />
              <Route path="videos" element={<Videos />} />
              <Route path="governorates" element={<Governorates />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/admin" element={<Layout admin />}>
              <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="articles" element={<ProtectedRoute><Articles /></ProtectedRoute>} />
              <Route path="articles/new" element={<ProtectedRoute><NewArticle /></ProtectedRoute>} />
              <Route path="categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
              <Route path="rss" element={<ProtectedRoute><RssFeeds /></ProtectedRoute>} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
          <SonnerToaster position="top-center" closeButton={true} />
        </ArticleProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
