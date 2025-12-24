import React from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import Card from "../../components/ui/Card";

const AdminDashboard: React.FC = () => {
  // Mock statistics - in real app, fetch from API
  const stats = {
    totalBooks: 24,
    totalOrders: 156,
    totalUsers: 89,
    totalRevenue: 45680,
    recentOrders: 12,
    pendingOrders: 5,
  };

  const statCards = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "إجمالي الكتب",
      value: stats.totalBooks,
      color: "from-primary to-secondary",
      change: "+12%",
      trend: "up",
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "إجمالي الطلبات",
      value: stats.totalOrders,
      color: "from-accent2 to-secondary",
      change: "+8%",
      trend: "up",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "إجمالي المستخدمين",
      value: stats.totalUsers,
      color: "from-accent1 to-primary",
      change: "+15%",
      trend: "up",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "إجمالي الإيرادات",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      color: "from-secondary to-accent2",
      change: "+23%",
      trend: "up",
    },
  ];

  const recentActivity = [
    {
      type: "order",
      message: "طلب جديد من أحمد محمد",
      time: "منذ 5 دقائق",
      icon: <ShoppingCart />,
    },
    {
      type: "user",
      message: "مستخدم جديد: سارة علي",
      time: "منذ 15 دقيقة",
      icon: <Users />,
    },
    {
      type: "book",
      message: "كتاب جديد: مغامرة في الغابة",
      time: "منذ ساعة",
      icon: <BookOpen />,
    },
    {
      type: "order",
      message: "طلب مكتمل #1234",
      time: "منذ ساعتين",
      icon: <ShoppingCart />,
    },
  ];

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
                </div>
                <h3 className="text-gray-500 font-tajawal text-sm mb-2 font-medium">
                  {stat.title}
                </h3>
                <p className="text-3xl font-reem font-bold text-gray-800 mb-2">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400 font-tajawal">
                  <Activity size={12} />
                  <span>مقارنة بالشهر الماضي</span>
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
                {stats.recentOrders} نشاط
              </span>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivity.slice(0, 4).map((activity, index) => (
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
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-center text-primary font-tajawal font-semibold hover:bg-primary/5 rounded-xl transition-colors">
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
            {Array.from({ length: stats.pendingOrders }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-tajawal font-bold text-gray-800 mb-1">
                      طلب #{1234 + index}
                    </p>
                    <p className="text-sm text-gray-600 font-tajawal">
                      أحمد محمد
                    </p>
                  </div>
                  <div className="px-2.5 py-1 bg-yellow-200 rounded-lg">
                    <span className="text-xs font-tajawal font-bold text-yellow-900">
                      $29.99
                    </span>
                  </div>
                </div>
                <button className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-tajawal text-sm font-semibold hover:shadow-lg transition-all group-hover:scale-105">
                  معالجة الطلب
                </button>
              </motion.div>
            ))}
          </div>
          {stats.pendingOrders === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="text-green-600" size={24} />
              </div>
              <p className="font-tajawal text-gray-500">لا توجد طلبات معلقة</p>
            </div>
          )}
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
            $293.50
          </p>
          <p className="text-sm text-blue-600 font-tajawal">
            +5.2% من الشهر الماضي
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-reem font-bold text-gray-800">معدل التحويل</h3>
            <Activity className="text-green-600" size={24} />
          </div>
          <p className="text-3xl font-reem font-bold text-green-700 mb-2">
            68.5%
          </p>
          <p className="text-sm text-green-600 font-tajawal">
            +2.1% من الشهر الماضي
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-reem font-bold text-gray-800">معدل الرضا</h3>
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-3xl font-reem font-bold text-purple-700 mb-2">
            4.8/5
          </p>
          <p className="text-sm text-purple-600 font-tajawal">من 156 تقييم</p>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
