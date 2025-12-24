import React, { useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Users,
  Menu,
  X,
  LogOut,
  Home,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems: NavItem[] = [
    { icon: <LayoutDashboard />, label: "لوحة التحكم", path: "/admin" },
    { icon: <BookOpen />, label: "الكتب", path: "/admin/books" },
    { icon: <ShoppingCart />, label: "الطلبات", path: "/admin/orders" },
    { icon: <Users />, label: "المستخدمون", path: "/admin/users" },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    navigate("/");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background to-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? "280px" : "80px" }}
        className="h-screen bg-white shadow-xl border-l border-gray-200 flex flex-col transition-all duration-300 z-10 flex-shrink-0"
      >
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-reem font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              لوحة التحكم
            </motion.h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                whileHover={{ scale: 1.02, x: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-tajawal font-medium text-right"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 space-y-2 flex-shrink-0">
          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
          >
            <Home size={20} />
            {sidebarOpen && (
              <span className="font-tajawal font-medium text-right">
                الرئيسية
              </span>
            )}
          </motion.button>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <span className="font-tajawal font-medium text-right">
                تسجيل الخروج
              </span>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 to-white">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
