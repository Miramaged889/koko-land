import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Edit,
  Save,
  X,
  Trash2,
  Eye,
  EyeOff,
  MapPin,
  AlertCircle,
  Loader2,
  Shield,
  BookOpen,
  Phone,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  clearError,
} from "../../store/slices/profileSlice";
import {
  getUserLibrary,
  clearError as clearPurchaseError,
} from "../../store/slices/purchaseSlice";
import LibraryCard from "../../components/cards/LibraryCard";
import { bookApi, CustomizationSummary } from "../../services/api";

type TabType = "profile" | "password" | "customizations" | "delete";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    profile,
    loading,
    error,
    updateLoading,
    updateError,
    passwordChangeLoading,
    passwordChangeError,
  } = useAppSelector((state) => state.profile);
  const {
    library,
    libraryLoading,
    error: purchaseError,
  } = useAppSelector((state) => state.purchase);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [customizationsMap, setCustomizationsMap] = useState<
    Record<number, CustomizationSummary>
  >({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Fetch profile on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  // Fetch library and customizations when customizations tab is active
  useEffect(() => {
    if (isAuthenticated && activeTab === "customizations") {
      dispatch(getUserLibrary());

      // Fetch customizations to match with custom_book IDs
      const fetchCustomizations = async () => {
        try {
          const customizations = await bookApi.listCustomizationsSummary();
          // Create a map of customization ID to customization data
          const map: Record<number, CustomizationSummary> = {};
          customizations.forEach((custom) => {
            map[custom.id] = custom;
          });
          setCustomizationsMap(map);
        } catch (error) {
          console.error("Failed to load customizations:", error);
        }
      };

      fetchCustomizations();
    }
  }, [dispatch, isAuthenticated, activeTab]);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        email: profile.email ?? "",
        address: profile.address ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (updateError) {
      dispatch(clearError());
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean up the data - remove empty strings and only send fields that have values
      const cleanedData: Record<string, string> = {};
      if (profileForm.first_name?.trim()) {
        cleanedData.first_name = profileForm.first_name.trim();
      }
      if (profileForm.last_name?.trim()) {
        cleanedData.last_name = profileForm.last_name.trim();
      }
      if (profileForm.email?.trim()) {
        cleanedData.email = profileForm.email.trim();
      }
      if (profileForm.address?.trim()) {
        cleanedData.address = profileForm.address.trim();
      }
      if (profileForm.phone?.trim()) {
        cleanedData.phone = profileForm.phone.trim();
      }

      await dispatch(updateProfile(cleanedData)).unwrap();
      setIsEditing(false);
      // Profile is already updated in Redux state from updateProfile thunk
      alert("تم تحديث الملف الشخصي بنجاح");
    } catch (err: unknown) {
      console.error("Update error:", err);
      alert((err as Error).message || "فشل تحديث الملف الشخصي");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (passwordChangeError) {
      dispatch(clearError());
    }
  };

  const validatePassword = () => {
    const newErrors = {
      old_password: "",
      new_password: "",
      confirm_password: "",
    };

    if (!passwordForm.old_password) {
      newErrors.old_password = "كلمة المرور الحالية مطلوبة";
    }

    if (!passwordForm.new_password) {
      newErrors.new_password = "كلمة المرور الجديدة مطلوبة";
    } else if (passwordForm.new_password.length < 6) {
      newErrors.new_password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!passwordForm.confirm_password) {
      newErrors.confirm_password = "تأكيد كلمة المرور مطلوب";
    } else if (passwordForm.new_password !== passwordForm.confirm_password) {
      newErrors.confirm_password = "كلمات المرور غير متطابقة";
    }

    setPasswordErrors(newErrors);
    return (
      !newErrors.old_password &&
      !newErrors.new_password &&
      !newErrors.confirm_password
    );
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }

    try {
      await dispatch(changePassword(passwordForm)).unwrap();
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      alert("تم تغيير كلمة المرور بنجاح");
    } catch (err) {
      console.error("Password change error:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await dispatch(deleteAccount()).unwrap();
      navigate("/");
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="font-tajawal text-gray-600">فشل تحميل الملف الشخصي</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-reem font-bold text-gray-800 mb-2">
            الملف الشخصي
          </h1>
          <p className="text-gray-600 font-tajawal">إدارة معلومات حسابك</p>
        </motion.div>

        {/* Tabs */}
        <Card className="p-6 mb-6">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-3 font-tajawal font-semibold transition-colors ${
                activeTab === "profile"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              المعلومات الشخصية
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`px-6 py-3 font-tajawal font-semibold transition-colors ${
                activeTab === "password"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              تغيير كلمة المرور
            </button>
            <button
              onClick={() => setActiveTab("customizations")}
              className={`px-6 py-3 font-tajawal font-semibold transition-colors ${
                activeTab === "customizations"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              مكتبتي
            </button>
            <button
              onClick={() => setActiveTab("delete")}
              className={`px-6 py-3 font-tajawal font-semibold transition-colors ${
                activeTab === "delete"
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              حذف الحساب
            </button>
          </div>
        </Card>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-reem font-bold text-gray-800">
                  المعلومات الشخصية
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    icon={<Edit size={16} />}
                  >
                    تعديل
                  </Button>
                )}
              </div>

              {updateError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-red-600 font-tajawal text-sm">
                    {updateError}
                  </span>
                </motion.div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* User Info Display/Edit */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="text-white" size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-reem font-bold text-gray-800">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={16} className="text-gray-500" />
                      <span className="font-tajawal text-gray-600">
                        {profile.email}
                      </span>
                    </div>
                    {profile.is_admin && (
                      <div className="flex items-center gap-2 mt-2">
                        <Shield size={16} className="text-primary" />
                        <span className="font-tajawal text-sm text-primary font-semibold">
                          مدير
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="الاسم الأول"
                    name="first_name"
                    value={profileForm.first_name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    icon={<User size={20} />}
                  />
                  <Input
                    label="الاسم الأخير"
                    name="last_name"
                    value={profileForm.last_name}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    icon={<User size={20} />}
                  />
                </div>

                <Input
                  label="البريد الإلكتروني"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  icon={<Mail size={20} />}
                />

                <Input
                  label="العنوان"
                  name="address"
                  value={profileForm.address || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  icon={<MapPin size={20} />}
                />

                <Input
                  label="رقم الهاتف"
                  name="phone"
                  type="tel"
                  value={profileForm.phone || ""}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  icon={<Phone size={20} />}
                />

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={updateLoading}
                      icon={<Save size={16} />}
                    >
                      حفظ التغييرات
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        if (profile) {
                          setProfileForm({
                            first_name: profile.first_name || "",
                            last_name: profile.last_name || "",
                            email: profile.email || "",
                            address: profile.address || "",
                            phone: profile.phone || "",
                          });
                        }
                        dispatch(clearError());
                      }}
                      icon={<X size={16} />}
                    >
                      إلغاء
                    </Button>
                  </div>
                )}
              </form>
            </Card>
          </motion.div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6">
                تغيير كلمة المرور
              </h2>

              {passwordChangeError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-red-600 font-tajawal text-sm">
                    {passwordChangeError}
                  </span>
                </motion.div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-reem font-semibold text-gray-700">
                    كلمة المرور الحالية <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="old_password"
                      value={passwordForm.old_password}
                      onChange={handlePasswordChange}
                      className={`w-full pr-12 pl-12 py-4 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right transition-all ${
                        passwordErrors.old_password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showOldPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.old_password && (
                    <p className="text-red-500 text-sm font-tajawal">
                      {passwordErrors.old_password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block font-reem font-semibold text-gray-700">
                    كلمة المرور الجديدة <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="new_password"
                      value={passwordForm.new_password}
                      onChange={handlePasswordChange}
                      className={`w-full pr-12 pl-12 py-4 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right transition-all ${
                        passwordErrors.new_password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.new_password && (
                    <p className="text-red-500 text-sm font-tajawal">
                      {passwordErrors.new_password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block font-reem font-semibold text-gray-700">
                    تأكيد كلمة المرور الجديدة{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={20} />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={passwordForm.confirm_password}
                      onChange={handlePasswordChange}
                      className={`w-full pr-12 pl-12 py-4 border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right transition-all ${
                        passwordErrors.confirm_password
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirm_password && (
                    <p className="text-red-500 text-sm font-tajawal">
                      {passwordErrors.confirm_password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={passwordChangeLoading}
                  icon={<Lock size={16} />}
                >
                  تغيير كلمة المرور
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Customizations Tab */}
        {activeTab === "customizations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6">
                مكتبتي
              </h2>

              {purchaseError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-red-600 font-tajawal text-sm">
                    {purchaseError}
                  </span>
                  <button
                    onClick={() => dispatch(clearPurchaseError())}
                    className="mr-auto text-red-600 hover:text-red-800"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}

              {libraryLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="mr-3 font-tajawal text-gray-600">
                    جاري التحميل...
                  </span>
                </div>
              ) : library.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="font-tajawal text-gray-600 text-lg mb-2">
                    مكتبتك فارغة
                  </p>
                  <p className="font-tajawal text-gray-400 text-sm">
                    تصفح الكتب واشترِ لتبدأ في بناء مكتبتك
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => navigate("/books")}
                    className="mt-4"
                    icon={<BookOpen size={16} />}
                  >
                    تصفح الكتب
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {library
                    .filter(
                      (item) => item.book !== null || item.custom_book !== null
                    )
                    .map((item) => (
                      <LibraryCard
                        key={item.id}
                        libraryItem={item}
                        customizationSummary={
                          item.custom_book
                            ? customizationsMap[item.custom_book] || undefined
                            : undefined
                        }
                      />
                    ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Delete Account Tab */}
        {activeTab === "delete" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-2 border-red-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-reem font-bold text-red-600 mb-2">
                    حذف الحساب
                  </h2>
                  <p className="font-tajawal text-gray-600">
                    تحذير: هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع
                    بياناتك بشكل دائم.
                  </p>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
                >
                  <AlertCircle className="text-red-600" size={20} />
                  <span className="text-red-600 font-tajawal text-sm">
                    {error}
                  </span>
                </motion.div>
              )}

              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  icon={<Trash2 size={16} />}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  حذف الحساب
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <p className="font-tajawal text-yellow-800 font-semibold mb-2">
                      هل أنت متأكد؟
                    </p>
                    <p className="font-tajawal text-yellow-700 text-sm">
                      سيتم حذف حسابك بشكل دائم ولا يمكن استرجاعه. الرجاء التأكد
                      من رغبتك في المتابعة.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      icon={<X size={16} />}
                    >
                      إلغاء
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDeleteAccount}
                      icon={<Trash2 size={16} />}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      نعم، احذف حسابي
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
