import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-primary to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center mb-4"
            >
              <BookOpen className="h-8 w-8 ml-2" />
              <h3 className="text-2xl font-changa font-bold">Koko Land</h3>
            </motion.div>
            <p className="font-tajawal text-white/80 mb-4 leading-relaxed">
              عالم كوكو للقصص - منصة تفاعلية لإنشاء قصص مخصصة للأطفال تجعل طفلك بطل القصة
            </p>
            <div className="flex space-x-4 space-x-reverse">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/20 p-2 rounded-full cursor-pointer"
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-reem font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              {[
                { path: '/books', label: 'الكتب' },
                { path: '/create', label: 'أنشئ قصتك' },
                { path: '/library', label: 'مكتبتي' },
                { path: '/about', label: 'من نحن' },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path}>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="font-tajawal text-white/80 hover:text-white transition-colors block"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-reem font-semibold mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 ml-2" />
                <span className="font-tajawal text-sm">info@koko-land.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 ml-2" />
                <span className="font-tajawal text-sm">+966 50 123 4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 ml-2" />
                <span className="font-tajawal text-sm">الرياض، المملكة العربية السعودية</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="font-tajawal text-white/80 text-sm">
            © 2025 Koko Land. جميع الحقوق محفوظة
          </p>
          <div className="flex space-x-6 space-x-reverse mt-4 md:mt-0">
            <Link to="/privacy">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="font-tajawal text-white/80 hover:text-white text-sm transition-colors block"
              >
                سياسة الخصوصية
              </motion.span>
            </Link>
            <Link to="/terms">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="font-tajawal text-white/80 hover:text-white text-sm transition-colors block"
              >
                الشروط والأحكام
              </motion.span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;