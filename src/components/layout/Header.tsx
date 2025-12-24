import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  User,
  BookOpen,
  LogOut,
  ChevronDown,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { fetchProfile } from "../../store/slices/profileSlice";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { profile } = useAppSelector((state) => state.profile);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch profile when authenticated
  useEffect(() => {
    if (isAuthenticated && !profile) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, profile, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: "/", label: "الرئيسية" },
    { path: "/books", label: "الكتب" },
    { path: "/create", label: "أنشئ قصتك" },
    { path: "/library", label: "مكتبتي" },
    { path: "/about", label: "من نحن" },
    { path: "/contact", label: "اتصل بنا" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    if (profile?.is_admin) {
      navigate("/admin");
    } else {
      navigate("/profile");
    }
  };

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim()
    : "المستخدم";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center cursor-pointer"
            >
              <BookOpen className="h-8 w-8 text-primary ml-2" />
              <h1 className="text-2xl font-changa font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Koko Land
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <React.Fragment key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive: active }) =>
                    `font-tajawal text-sm font-medium transition-colors ${
                      active || isActive(item.path)
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="block"
                  >
                    {item.label}
                  </motion.span>
                </NavLink>
              </React.Fragment>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {location.pathname !== "/login" &&
              location.pathname !== "/register" && (
                <>
                  {isAuthenticated ? (
                    <div className="relative" ref={dropdownRef}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-tajawal text-sm font-medium transition-colors"
                      >
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <span className="hidden sm:inline">{displayName}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </motion.button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                          >
                            <div className="py-2">
                              {/* User Info */}
                              <div className="px-4 py-3 border-b border-gray-100">
                                <p className="font-tajawal font-semibold text-gray-800 text-sm">
                                  {displayName}
                                </p>
                                <p className="font-tajawal text-gray-500 text-xs mt-1">
                                  {profile?.email}
                                </p>
                                {profile?.is_admin && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Shield
                                      size={14}
                                      className="text-primary"
                                    />
                                    <span className="font-tajawal text-xs text-primary font-semibold">
                                      مدير
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Profile/Dashboard Link */}
                              <button
                                onClick={handleProfileClick}
                                className="w-full px-4 py-3 text-right font-tajawal text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                              >
                                {profile?.is_admin ? (
                                  <>
                                    <LayoutDashboard className="h-4 w-4" />
                                    لوحة التحكم
                                  </>
                                ) : (
                                  <>
                                    <User className="h-4 w-4" />
                                    الملف الشخصي
                                  </>
                                )}
                              </button>

                              {/* Logout Button */}
                              <button
                                onClick={handleLogout}
                                className="w-full px-4 py-3 text-right font-tajawal text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <LogOut className="h-4 w-4" />
                                تسجيل الخروج
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <>
                      <Link to="/login">
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#81C784",
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-accent2 text-white px-4 py-2 rounded-full font-tajawal text-sm font-medium transition-colors flex items-center"
                        >
                          <User className="h-4 w-4 ml-2" />
                          تسجيل الدخول
                        </motion.button>
                      </Link>
                      <Link to="/register">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-tajawal text-sm font-medium transition-colors"
                        >
                          إنشاء حساب
                        </motion.button>
                      </Link>
                    </>
                  )}
                </>
              )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden text-gray-700 hover:text-primary"
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
