import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Shield,
  Mail,
  Edit,
  Save,
  X,
  Loader2,
  AlertCircle,
  UserPlus,
  Users,
  Plus,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  CreditCard,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  searchUsers,
  updateUser,
  setSearchTerm,
  clearSearchResults,
  listAdmins,
  addAdmin,
  addUser,
  listUsers,
} from "../../store/slices/userSlice";

type TabType = "users" | "admins";

const AdminUsers: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    searchResults,
    admins,
    allUsers,
    loading,
    error,
    addUserLoading,
    addAdminLoading,
    listAdminsLoading,
    listUsersLoading,
  } = useAppSelector((state) => state.users);

  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ first_name: "", last_name: "" });
  const [updateLoading, setUpdateLoading] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [addUserForm, setAddUserForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [addAdminForm, setAddAdminForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    address: "",
    payment_info: "",
  });

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        dispatch(setSearchTerm(searchInput));
        dispatch(searchUsers(searchInput));
      } else {
        dispatch(clearSearchResults());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  // Load admins when admins tab is active
  useEffect(() => {
    if (activeTab === "admins" && admins.length === 0) {
      dispatch(listAdmins());
    }
  }, [activeTab, admins.length, dispatch]);

  // Load users when users tab is active
  useEffect(() => {
    if (activeTab === "users" && allUsers.length === 0 && !searchInput.trim()) {
      dispatch(listUsers());
    }
  }, [activeTab, allUsers.length, searchInput, dispatch]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowAddUserModal(false);
        setShowAddAdminModal(false);
      }
    };

    if (showAddUserModal || showAddAdminModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddUserModal, showAddAdminModal]);

  const handleEdit = (user: (typeof searchResults)[0]) => {
    setEditingUserId(user.id);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditForm({ first_name: "", last_name: "" });
  };

  const handleSaveEdit = async (userId: number) => {
    if (!editForm.first_name.trim() || !editForm.last_name.trim()) {
      alert("الاسم الأول والاسم الأخير مطلوبان");
      return;
    }

    setUpdateLoading(userId);
    try {
      await dispatch(
        updateUser({
          id: userId,
          data: {
            first_name: editForm.first_name.trim(),
            last_name: editForm.last_name.trim(),
          },
        })
      ).unwrap();
      setEditingUserId(null);
      setEditForm({ first_name: "", last_name: "" });
      alert("تم تحديث المستخدم بنجاح");
    } catch (err: unknown) {
      alert((err as Error).message || "فشل تحديث المستخدم");
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addUserForm.first_name.trim() ||
      !addUserForm.last_name.trim() ||
      !addUserForm.email.trim() ||
      !addUserForm.password.trim()
    ) {
      alert("جميع الحقول مطلوبة");
      return;
    }

    try {
      await dispatch(addUser(addUserForm)).unwrap();
      setAddUserForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
      });
      setShowAddUserModal(false);
      alert("تم إضافة المستخدم بنجاح");
      // Refresh users list
      dispatch(listUsers());
    } catch (err: unknown) {
      alert((err as Error).message || "فشل إضافة المستخدم");
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !addAdminForm.first_name.trim() ||
      !addAdminForm.last_name.trim() ||
      !addAdminForm.email.trim() ||
      !addAdminForm.password.trim()
    ) {
      alert("الاسم الأول، الاسم الأخير، البريد الإلكتروني وكلمة المرور مطلوبة");
      return;
    }

    try {
      await dispatch(addAdmin(addAdminForm)).unwrap();
      setAddAdminForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        address: "",
        payment_info: "",
      });
      setShowAddAdminModal(false);
      alert("تم إضافة المدير بنجاح");
      // Refresh admins list
      dispatch(listAdmins());
    } catch (err: unknown) {
      alert((err as Error).message || "فشل إضافة المدير");
    }
  };

  // Determine which users to display
  const displayUsers = searchInput.trim() ? searchResults : allUsers;

  const filteredUsers = displayUsers.filter((user) => {
    if (!searchInput.trim()) return true;
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchInput.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-reem font-bold text-gray-800 mb-2">
          إدارة المستخدمين
        </h1>
        <p className="text-gray-600 font-tajawal">
          البحث عن المستخدمين وإدارة المدراء
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">
            إجمالي المستخدمين
          </p>
          <p className="text-2xl font-reem font-bold text-gray-800">
            {admins.length + allUsers.filter((u) => !u.is_admin).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">
            إجمالي المدراء
          </p>
          <p className="text-2xl font-reem font-bold text-primary">
            {admins.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">
            المستخدمون العاديون
          </p>
          <p className="text-2xl font-reem font-bold text-accent2">
            {allUsers.filter((u) => !u.is_admin).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-gray-600 font-tajawal text-sm mb-1">نتائج البحث</p>
          <p className="text-2xl font-reem font-bold text-secondary">
            {searchInput.trim() ? filteredUsers.length : allUsers.length}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-6 mb-6">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-tajawal font-semibold transition-colors ${
              activeTab === "users"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              المستخدمون
            </div>
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-6 py-3 font-tajawal font-semibold transition-colors ${
              activeTab === "admins"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-600 hover:text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={18} />
              المدراء
            </div>
          </button>
        </div>
      </Card>

      {/* Users Tab */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <Card className="p-4">
                <div className="relative">
                  <Search
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="ابحث عن مستخدم..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pr-12"
                  />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                  >
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-600 font-tajawal text-sm">
                      {error}
                    </span>
                  </motion.div>
                )}
              </Card>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowAddUserModal(true)}
              icon={<UserPlus size={16} />}
              className="mr-4"
            >
              إضافة مستخدم
            </Button>
          </div>

          {/* Loading State */}
          {(loading || listUsersLoading) && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="mr-3 font-tajawal text-gray-600">
                جاري التحميل...
              </span>
            </div>
          )}

          {/* Users Grid */}
          {!loading && !listUsersLoading && filteredUsers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-shadow">
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {editingUserId === user.id ? (
                            <div className="space-y-2 w-full">
                              <Input
                                type="text"
                                value={editForm.first_name}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    first_name: e.target.value,
                                  })
                                }
                                placeholder="الاسم الأول"
                                className="text-sm"
                              />
                              <Input
                                type="text"
                                value={editForm.last_name}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    last_name: e.target.value,
                                  })
                                }
                                placeholder="الاسم الأخير"
                                className="text-sm"
                              />
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xl font-reem font-bold text-gray-800">
                                {user.first_name} {user.last_name}
                              </h3>
                              {user.is_admin && (
                                <Shield size={18} className="text-primary" />
                              )}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          <span className="font-tajawal text-sm">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      {!editingUserId && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-tajawal font-semibold ${
                            user.is_admin
                              ? "bg-primary/20 text-primary"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.is_admin ? "مدير" : "مستخدم"}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      {editingUserId === user.id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="flex-1"
                            icon={<X size={16} />}
                            disabled={updateLoading === user.id}
                          >
                            إلغاء
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSaveEdit(user.id)}
                            className="flex-1"
                            icon={
                              updateLoading === user.id ? (
                                <Loader2 className="animate-spin" size={16} />
                              ) : (
                                <Save size={16} />
                              )
                            }
                            disabled={updateLoading === user.id}
                            loading={updateLoading === user.id}
                          >
                            {updateLoading === user.id
                              ? "جاري الحفظ..."
                              : "حفظ"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="flex-1"
                          icon={<Edit size={16} />}
                        >
                          تعديل
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading &&
            !listUsersLoading &&
            searchInput &&
            filteredUsers.length === 0 && (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-gray-400" size={24} />
                </div>
                <p className="font-tajawal text-gray-600 text-lg">
                  لم يتم العثور على مستخدمين
                </p>
                <p className="font-tajawal text-gray-400 text-sm mt-2">
                  جرب البحث باسم آخر
                </p>
              </Card>
            )}

          {/* Initial State */}
          {!loading &&
            !listUsersLoading &&
            !searchInput &&
            filteredUsers.length === 0 && (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-primary" size={24} />
                </div>
                <p className="font-tajawal text-gray-600 text-lg mb-2">
                  لا يوجد مستخدمين
                </p>
                <p className="font-tajawal text-gray-400 text-sm">
                  اضغط على "إضافة مستخدم" لإضافة مستخدم جديد
                </p>
              </Card>
            )}
        </motion.div>
      )}

      {/* Admins Tab */}
      {activeTab === "admins" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header with Add Button */}
          <div className="flex items-center justify-end mb-6">
            <Button
              variant="primary"
              onClick={() => setShowAddAdminModal(true)}
              icon={<Plus size={16} />}
            >
              إضافة مدير
            </Button>
          </div>

          {listAdminsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
              <span className="mr-3 font-tajawal text-gray-600">
                جاري تحميل المدراء...
              </span>
            </div>
          ) : admins.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {admins.map((admin, index) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-xl transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-reem font-bold text-gray-800">
                            {admin.first_name} {admin.last_name}
                          </h3>
                          <Shield size={18} className="text-primary" />
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          <span className="font-tajawal text-sm">
                            {admin.email}
                          </span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-tajawal font-semibold bg-primary/20 text-primary">
                        مدير
                      </span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-gray-400" size={24} />
              </div>
              <p className="font-tajawal text-gray-600 text-lg">
                لا يوجد مدراء
              </p>
              <p className="font-tajawal text-gray-400 text-sm mt-2">
                اضغط على "إضافة مدير" لإضافة مدير جديد
              </p>
            </Card>
          )}
        </motion.div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-reem font-bold text-gray-800">
                    إضافة مستخدم جديد
                  </h2>
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <form onSubmit={handleAddUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="الاسم الأول"
                      name="first_name"
                      value={addUserForm.first_name}
                      onChange={(e) =>
                        setAddUserForm({
                          ...addUserForm,
                          first_name: e.target.value,
                        })
                      }
                      required
                      icon={<Users size={20} />}
                    />
                    <Input
                      label="الاسم الأخير"
                      name="last_name"
                      value={addUserForm.last_name}
                      onChange={(e) =>
                        setAddUserForm({
                          ...addUserForm,
                          last_name: e.target.value,
                        })
                      }
                      required
                      icon={<Users size={20} />}
                    />
                  </div>
                  <Input
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={addUserForm.email}
                    onChange={(e) =>
                      setAddUserForm({ ...addUserForm, email: e.target.value })
                    }
                    required
                    icon={<Mail size={20} />}
                  />
                  <div className="relative">
                    <Input
                      label="كلمة المرور"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={addUserForm.password}
                      onChange={(e) =>
                        setAddUserForm({
                          ...addUserForm,
                          password: e.target.value,
                        })
                      }
                      required
                      icon={<Lock size={20} />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddUserModal(false)}
                      className="flex-1"
                      icon={<X size={16} />}
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={addUserLoading}
                      icon={<UserPlus size={16} />}
                      className="flex-1"
                    >
                      إضافة مستخدم
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {showAddAdminModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-reem font-bold text-gray-800">
                    إضافة مدير جديد
                  </h2>
                  <button
                    onClick={() => setShowAddAdminModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
                <form onSubmit={handleAddAdmin} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="الاسم الأول"
                      name="first_name"
                      value={addAdminForm.first_name}
                      onChange={(e) =>
                        setAddAdminForm({
                          ...addAdminForm,
                          first_name: e.target.value,
                        })
                      }
                      required
                      icon={<Shield size={20} />}
                    />
                    <Input
                      label="الاسم الأخير"
                      name="last_name"
                      value={addAdminForm.last_name}
                      onChange={(e) =>
                        setAddAdminForm({
                          ...addAdminForm,
                          last_name: e.target.value,
                        })
                      }
                      required
                      icon={<Shield size={20} />}
                    />
                  </div>
                  <Input
                    label="البريد الإلكتروني"
                    name="email"
                    type="email"
                    value={addAdminForm.email}
                    onChange={(e) =>
                      setAddAdminForm({
                        ...addAdminForm,
                        email: e.target.value,
                      })
                    }
                    required
                    icon={<Mail size={20} />}
                  />
                  <div className="relative">
                    <Input
                      label="كلمة المرور"
                      name="password"
                      type={showAdminPassword ? "text" : "password"}
                      value={addAdminForm.password}
                      onChange={(e) =>
                        setAddAdminForm({
                          ...addAdminForm,
                          password: e.target.value,
                        })
                      }
                      required
                      icon={<Lock size={20} />}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute left-4 top-[42px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showAdminPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <Input
                    label="العنوان"
                    name="address"
                    value={addAdminForm.address}
                    onChange={(e) =>
                      setAddAdminForm({
                        ...addAdminForm,
                        address: e.target.value,
                      })
                    }
                    icon={<MapPin size={20} />}
                  />
                  <Input
                    label="معلومات الدفع"
                    name="payment_info"
                    value={addAdminForm.payment_info}
                    onChange={(e) =>
                      setAddAdminForm({
                        ...addAdminForm,
                        payment_info: e.target.value,
                      })
                    }
                    icon={<CreditCard size={20} />}
                  />
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddAdminModal(false)}
                      className="flex-1"
                      icon={<X size={16} />}
                    >
                      إلغاء
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={addAdminLoading}
                      icon={<Plus size={16} />}
                      className="flex-1"
                    >
                      إضافة مدير
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
