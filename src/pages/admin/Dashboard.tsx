import React, { useState, useEffect } from 'react';
import { useArticles } from '../context/ArticleContext';
import { NewsItem } from '../types/NewsItem';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  BarChart3,
  RefreshCw,
  Save,
  X,
  Eye,
  Calendar,
  Tag,
  Image,
  FileText,
  User,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'writer';
  lastLogin: string;
  status: 'active' | 'inactive';
}

const AdminDashboard: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle } = useArticles();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'users' | 'settings'>('dashboard');
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    todayArticles: 0,
    totalUsers: 0,
    activeUsers: 0
  });

  // نموذج مقال جديد
  const [newArticle, setNewArticle] = useState<Partial<NewsItem>>({
    title: '',
    content: '',
    excerpt: '',
    category: 'أخبار',
    image: '',
    featured: false
  });

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    loadStats();
    loadUsers();
  }, [articles]);

  const loadStats = () => {
    const today = new Date().toDateString();
    const todayArticles = articles.filter(article =>
      new Date(article.date).toDateString() === today
    ).length;

    setStats({
      totalArticles: articles.length,
      todayArticles,
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length
    });
  };

  const loadUsers = () => {
    // محاكاة بيانات المستخدمين
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'admin@masdarplus.com',
        role: 'admin',
        lastLogin: new Date().toISOString(),
        status: 'active'
      },
      {
        id: '2',
        name: 'فاطمة علي',
        email: 'editor@masdarplus.com',
        role: 'editor',
        lastLogin: new Date(Date.now() - 86400000).toISOString(),
        status: 'active'
      }
    ];
    setUsers(mockUsers);
  };

  const handleAddArticle = () => {
    if (!newArticle.title || !newArticle.content) {
      toast.error('يرجى ملء العنوان والمحتوى');
      return;
    }

    const article: NewsItem = {
      id: `manual-${Date.now()}`,
      title: newArticle.title!,
      content: newArticle.content!,
      excerpt: newArticle.excerpt || newArticle.content!.substring(0, 150) + '...',
      category: newArticle.category!,
      date: new Date().toISOString(),
      source: 'مصدر بلس - إدارة المحتوى',
      image: newArticle.image || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop&q=60',
      featured: newArticle.featured || false,
      readingTime: Math.ceil(newArticle.content!.split(' ' ).length / 200),
      tags: []
    };

    addArticle(article);
    setNewArticle({
      title: '',
      content: '',
      excerpt: '',
      category: 'أخبار',
      image: '',
      featured: false
    });
    setShowAddArticle(false);
    toast.success('تم إضافة المقال بنجاح');
  };

  const handleEditArticle = (article: NewsItem) => {
    setEditingArticle(article);
  };

  const handleUpdateArticle = () => {
    if (!editingArticle) return;

    updateArticle(editingArticle.id, editingArticle);
    setEditingArticle(null);
    toast.success('تم تحديث المقال بنجاح');
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقال؟')) {
      deleteArticle(id);
      toast.success('تم حذف المقال بنجاح');
    }
  };

  const categories = [
    'أخبار', 'سياسة', 'اقتصاد', 'رياضة', 'تكنولوجيا', 'فن وثقافة',
    'سيارات', 'علوم', 'جامعات وتعليم', 'حوادث', 'ذكاء اصطناعي',
    'عسكرية', 'العالم', 'محافظات'
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'writer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'editor': return <Edit className="w-4 h-4" />;
      case 'writer': return <FileText className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
              <span className="mr-2 text-sm text-gray-500">مصدر بلس</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <User className="w-8 h-8 text-gray-400" />
                <span className="mr-2 text-sm text-gray-700">المدير</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 space-x-reverse">
            {[
              { id: 'dashboard', label: 'الرئيسية', icon: BarChart3 },
              { id: 'articles', label: 'المقالات', icon: FileText },
              { id: 'users', label: 'المستخدمين', icon: Users },
              { id: 'settings', label: 'الإعدادات', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 ml-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي المقالات</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalArticles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-green-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">مقالات اليوم</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.todayArticles}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">المستخدمين</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-orange-500" />
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Articles */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">أحدث المقالات</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {articles.slice(0, 5).map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-12 h-12 rounded-lg object-cover ml-4"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{article.title}</h4>
                          <p className="text-sm text-gray-500">{article.category} • {new Date(article.date).toLocaleDateString('ar-EG')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">إدارة المقالات</h2>
              <button
                onClick={() => setShowAddArticle(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة مقال جديد
              </button>
            </div>

            {/* Articles List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المقال
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الفئة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاريخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((article) => (
                    <tr key={article.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-10 h-10 rounded-lg object-cover ml-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {article.title.substring(0, 50)}...
                            </div>
                            <div className="text-sm text-gray-500">{article.source}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">إدارة المستخدمين</h2>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستخدم جديد
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الدور
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      آخر دخول
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-10 h-10 text-gray-400 ml-4" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="mr-1">
                            {user.role === 'admin' ? 'مدير' : user.role === 'editor' ? 'محرر' : 'كاتب'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.lastLogin).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status === 'active' ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">إعدادات النظام</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات المزامنة التلقائية</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">فترة المزامنة (بالدقائق)</label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">الحد الأقصى للمقالات</label>
                    <input
                      type="number"
                      defaultValue={1000}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    حفظ الإعدادات
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">إعدادات الموقع</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">اسم الموقع</label>
                    <input
                      type="text"
                      defaultValue="مصدر بلس"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">وصف الموقع</label>
                    <textarea
                      defaultValue="موقع إخباري مصري يقدم آخر الأخبار بالذكاء الاصطناعي"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                    حفظ الإعدادات
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Article Modal */}
      {showAddArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">إضافة مقال جديد</h3>
                <button
                  onClick={() => setShowAddArticle(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">العنوان</label>
                  <input
                    type="text"
                    value={newArticle.title || ''}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="عنوان المقال"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">الفئة</label>
                  <select
                    value={newArticle.category || 'أخبار'}
                    onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">رابط الصورة</label>
                  <input
                    type="url"
                    value={newArticle.image || ''}
                    onChange={(e) => setNewArticle({...newArticle, image: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">المقتطف</label>
                  <textarea
                    value={newArticle.excerpt || ''}
                    onChange={(e ) => setNewArticle({...newArticle, excerpt: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="مقتطف قصير من المقال"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">المحتوى</label>
                  <textarea
                    value={newArticle.content || ''}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={8}
                    placeholder="محتوى المقال الكامل"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newArticle.featured || false}
                    onChange={(e) => setNewArticle({...newArticle, featured: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 block text-sm text-gray-900">
                    مقال مميز
                  </label>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    onClick={() => setShowAddArticle(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleAddArticle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    إضافة المقال
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">تحرير المقال</h3>
                <button
                  onClick={() => setEditingArticle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">العنوان</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">الفئة</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({...editingArticle, category: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">رابط الصورة</label>
                  <input
                    type="url"
                    value={editingArticle.image}
                    onChange={(e) => setEditingArticle({...editingArticle, image: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">المقتطف</label>
                  <textarea
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({...editingArticle, excerpt: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">المحتوى</label>
                  <textarea
                    value={editingArticle.content}
                    onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={8}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editingArticle.featured || false}
                    onChange={(e) => setEditingArticle({...editingArticle, featured: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 block text-sm text-gray-900">
                    مقال مميز
                  </label>
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse pt-4">
                  <button
                    onClick={() => setEditingArticle(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleUpdateArticle}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    حفظ التغييرات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
