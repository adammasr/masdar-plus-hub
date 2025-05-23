
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Key, Users, Shield } from "lucide-react";
import { toast } from "sonner";

type User = {
  username: string;
  password: string;
  role?: string;
  createdAt?: string;
};

const USERS_KEY = "adminUsers";

const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [{ 
    username: "admin", 
    password: "01208213342tozfek400",
    role: "مدير رئيسي",
    createdAt: new Date().toISOString()
  }];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("يرجى إدخال اسم المستخدم وكلمة المرور");
      return;
    }
    if (users.find(u => u.username === username)) {
      toast.error("اسم المستخدم موجود بالفعل");
      return;
    }
    
    const newUser: User = {
      username: username.trim(),
      password: password.trim(),
      role: "مدير",
      createdAt: new Date().toISOString()
    };
    
    const newUsers = [...users, newUser];
    saveUsers(newUsers);
    setUsers(newUsers);
    setUsername("");
    setPassword("");
    toast.success("تمت إضافة المستخدم بنجاح");
  };

  const deleteUser = (usernameToDelete: string) => {
    if (usernameToDelete === "admin") {
      toast.error("لا يمكن حذف المدير الرئيسي");
      return;
    }
    
    if (confirm(`هل أنت متأكد من حذف المستخدم "${usernameToDelete}"؟`)) {
      const newUsers = users.filter(u => u.username !== usernameToDelete);
      saveUsers(newUsers);
      setUsers(newUsers);
      toast.success("تم حذف المستخدم بنجاح");
    }
  };

  const changePassword = (username: string) => {
    if (!newPassword.trim()) {
      toast.error("يرجى إدخال كلمة المرور الجديدة");
      return;
    }
    
    const newUsers = users.map(u => 
      u.username === username 
        ? { ...u, password: newPassword.trim() }
        : u
    );
    
    saveUsers(newUsers);
    setUsers(newUsers);
    setEditingUser(null);
    setNewPassword("");
    toast.success("تم تغيير كلمة المرور بنجاح");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
      </div>

      {/* بيانات تسجيل الدخول الحالية */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Key className="h-5 w-5" />
            بيانات تسجيل الدخول الحالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
            <div>
              <strong>اسم المستخدم:</strong> admin
            </div>
            <div>
              <strong>كلمة المرور:</strong> 01208213342tozfek400
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">
            يمكنك تغيير كلمة المرور من قائمة المستخدمين أدناه
          </p>
        </CardContent>
      </Card>

      {/* إضافة مستخدم جديد */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            إضافة مستخدم جديد
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={addUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <UserPlus className="h-4 w-4 ml-2" />
              إضافة المستخدم
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* قائمة المستخدمين */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            قائمة المستخدمين ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.username} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <Badge variant={user.username === "admin" ? "default" : "secondary"}>
                        {user.role || "مدير"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      تاريخ الإنشاء: {formatDate(user.createdAt)}
                    </p>
                    
                    {editingUser === user.username ? (
                      <div className="flex items-center gap-2 mt-3">
                        <Input
                          type="password"
                          placeholder="كلمة المرور الجديدة"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="max-w-xs"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => changePassword(user.username)}
                        >
                          حفظ
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingUser(null);
                            setNewPassword("");
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingUser(user.username)}
                        >
                          <Key className="h-4 w-4 ml-1" />
                          تغيير كلمة المرور
                        </Button>
                        
                        {user.username !== "admin" && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deleteUser(user.username)}
                          >
                            <Trash2 className="h-4 w-4 ml-1" />
                            حذف
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
