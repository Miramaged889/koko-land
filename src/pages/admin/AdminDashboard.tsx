import React, { useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { listBooks } from "../../store/slices/bookSlice";
import { listAdminRequests } from "../../store/slices/purchaseSlice";
import { listUsers } from "../../store/slices/userSlice";

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state
  const { books, loading: booksLoading } = useAppSelector(
    (state) => state.books
  );
  const { requests, loading: requestsLoading } = useAppSelector(
    (state) => state.purchase
  );
  const { allUsers, listUsersLoading } = useAppSelector((state) => state.users);

  // Fetch data on mount
  useEffect(() => {
    dispatch(listBooks());
    dispatch(listAdminRequests());
    dispatch(listUsers());
  }, [dispatch]);

  // Helper function to format relative time
  const formatRelativeTime = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Calculate statistics from real data
  const stats = useMemo(() => {
    const totalBooks = books.length;
    const totalOrders = requests.length;
    const totalUsers = allUsers.length;
    const pendingOrders = requests.filter((r) => r.status === "pending").length;
    const approvedOrders = requests.filter((r) => r.status === "approved");

    // Calculate revenue from approved orders
    // We need to match book IDs with book prices
    let totalRevenue = 0;
    approvedOrders.forEach((order) => {
      const book = books.find((b) => b.id === order.book);
      if (book && book.price) {
        totalRevenue += Number(book.price) || 0;
      }
    });

    // Calculate average order value
    const avgOrderValue =
      approvedOrders.length > 0 ? totalRevenue / approvedOrders.length : 0;

    // Calculate conversion rate (approved / total)
    const conversionRate =
      requests.length > 0 ? (approvedOrders.length / requests.length) * 100 : 0;

    // Calculate average book rating
    const avgRating =
      books.length > 0
        ? books.reduce((sum, book) => sum + (book.rate || 0), 0) / books.length
        : 0;

    return {
      totalBooks,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
      recentOrders: requests.slice(0, 4).length,
      avgOrderValue,
      conversionRate,
      avgRating,
      totalRatings: requests.length,
    };
  }, [books, requests, allUsers]);

  // Get recent activity from requests and books
  const recentActivity = useMemo(() => {
    const activities: Array<{
      type: "order" | "user" | "book";
      message: string;
      time: string;
      icon: JSX.Element;
      timestamp: Date;
    }> = [];

    // Add recent purchase requests
    const recentRequests = [...requests]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);

    recentRequests.forEach((request) => {
      const book = books.find((b) => b.id === request.book);
      const user = allUsers.find((u) => u.id === request.user);
      const userName = user
        ? `${user.first_name} ${user.last_name}`.trim()
        : `المستخدم #${request.user}`;
      const bookTitle = book ? book.title : `الكتاب #${request.book}`;
      activities.push({
        type: "order",
        message: `طلب ${
          request.status === "pending"
            ? "جديد"
            : request.status === "approved"
            ? "موافق عليه"
            : "مرفوض"
        } - ${bookTitle} من ${userName}`,
        time: formatRelativeTime(request.created_at),
        icon: <ShoppingCart />,
        timestamp: new Date(request.created_at),
      });
    });

    // Sort by timestamp (most recent first)
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 3);
  }, [requests, books, allUsers, formatRelativeTime]);

  // Get pending orders with book details
  const pendingOrders = useMemo(() => {
    return requests
      .filter((r) => r.status === "pending")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 2)
      .map((request) => {
        const book = books.find((b) => b.id === request.book);
        const user = allUsers.find((u) => u.id === request.user);
        return {
          ...request,
          bookData: book,
          userData: user,
        };
      });
  }, [requests, books, allUsers]);

  const statCards = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "إجمالي الكتب",
      value: stats.totalBooks,
      color: "from-primary to-secondary",
      change: "",
      trend: "up" as const,
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      color: "from-accent2 to-secondary",
      change: "",
      trend: "up" as const,
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "إجمالي المستخدمين",
      value: stats.totalUsers,
      color: "from-accent1 to-primary",
      change: "",
      trend: "up" as const,
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "إجمالي الإيرادات",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      color: "from-secondary to-accent2",
      change: "",
      trend: "up" as const,
    },
  ];

  const isLoading = booksLoading || requestsLoading || listUsersLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="font-tajawal text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-reem font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              لوحة التحكم الرئيسية
            </h1>
            <p className="text-gray-600 font-tajawal text-lg">
              مرحباً بك، نظرة عامة على إحصائيات الموقع
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <Calendar size={18} className="text-gray-500" />
              <span className="font-tajawal text-sm text-gray-700">
                {new Date().toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="p-6 hover:shadow-2xl transition-all duration-300 border-t-4 border-transparent hover:border-primary relative overflow-hidden group">
              {/* Background Gradient Effect */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-4 rounded-2xl bg-gradient-to-r ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {stat.icon}
                  </div>
                  {stat.change && (
                    <div
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-tajawal font-semibold ${
                        stat.trend === "up"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight size={14} />
                      ) : (
                        <ArrowDownRight size={14} />
                      )}
                      {stat.change}
                    </div>
                  )}
                </div>
                <h3 className="text-gray-500 font-tajawal text-sm mb-2 font-medium">
                  {stat.title}
                </h3>
                <p className="text-3xl font-reem font-bold text-gray-800 mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-tajawal">
                  <Activity size={12} />
                  <span>بيانات مباشرة من قاعدة البيانات</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="p-6 lg:col-span-2 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-1">
                النشاط الأخير
              </h2>
              <p className="text-sm text-gray-500 font-tajawal">
                آخر التحديثات والأنشطة في النظام
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl">
              <Clock size={16} className="text-primary" />
              <span className="font-tajawal text-sm font-semibold text-primary">
                {recentActivity.length} نشاط
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all border border-transparent hover:border-gray-100 group"
                >
                  <div className="p-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl text-primary group-hover:scale-110 transition-transform">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-tajawal font-semibold text-gray-800 mb-1">
                      {activity.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 font-tajawal">
                        {activity.time}
                      </p>
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-xs text-gray-400 font-tajawal">
                        {activity.type === "order"
                          ? "طلب"
                          : activity.type === "user"
                          ? "مستخدم"
                          : "كتاب"}
                      </span>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="font-tajawal text-gray-500">
                  لا توجد أنشطة حديثة
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate("/admin/orders")}
            className="w-full mt-4 py-3 text-center text-primary font-tajawal font-semibold hover:bg-primary/5 rounded-xl transition-colors"
          >
            عرض جميع الأنشطة →
          </button>
        </Card>

        {/* Pending Orders */}
        <Card className="p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-1">
                الطلبات المعلقة
              </h2>
              <p className="text-sm text-gray-500 font-tajawal">
                تحتاج إلى معالجة
              </p>
            </div>
            <div className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-xl text-sm font-tajawal font-bold shadow-sm">
              {stats.pendingOrders}
            </div>
          </div>
          <div className="space-y-3">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-tajawal font-bold text-gray-800 mb-1">
                        طلب #{order.id}
                      </p>
                      <p className="text-sm text-gray-600 font-tajawal">
                        {order.userData
                          ? `${order.userData.first_name} ${order.userData.last_name}`
                          : `المستخدم #${order.user}`}
                      </p>
                      {order.bookData && (
                        <p className="text-xs text-gray-500 font-tajawal mt-1">
                          {order.bookData.title}
                        </p>
                      )}
                    </div>
                    {order.bookData &&
                      order.bookData.price !== undefined &&
                      order.bookData.price !== null && (
                        <div className="px-2.5 py-1 bg-yellow-200 rounded-lg">
                          <span className="text-xs font-tajawal font-bold text-yellow-900">
                            ${(Number(order.bookData.price) || 0).toFixed(2)}
                          </span>
                        </div>
                      )}
                  </div>
                  <button
                    onClick={() => navigate("/admin/orders")}
                    className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-tajawal text-sm font-semibold hover:shadow-lg transition-all group-hover:scale-105"
                  >
                    معالجة الطلب
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="text-green-600" size={24} />
                </div>
                <p className="font-tajawal text-gray-500">
                  لا توجد طلبات معلقة
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-reem font-bold text-gray-800">
              متوسط قيمة الطلب
            </h3>
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <p className="text-3xl font-reem font-bold text-blue-700 mb-2">
            ${stats.avgOrderValue.toFixed(2)}
          </p>
          <p className="text-sm text-blue-600 font-tajawal">
            {requests.filter((r) => r.status === "approved").length} طلب موافق
            عليه
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-reem font-bold text-gray-800">معدل التحويل</h3>
            <Activity className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-reem font-bold text-green-700 mb-2">
            {stats.conversionRate.toFixed(1)}%
          </p>
          <p className="text-sm text-green-600 font-tajawal">
            {requests.filter((r) => r.status === "approved").length} من{" "}
            {stats.totalOrders} طلب
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-reem font-bold text-gray-800">
              معدل تقييم الكتب
            </h3>
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-3xl font-reem font-bold text-purple-700 mb-2">
            {stats.avgRating.toFixed(1)}/5
          </p>
          <p className="text-sm text-purple-600 font-tajawal">
            من {stats.totalBooks} كتاب
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
