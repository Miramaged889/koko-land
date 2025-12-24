import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Download,
  BookOpen,
  Star,
  Calendar,
  Share2,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUserLibrary } from "../../store/slices/purchaseSlice";
import { bookApi } from "../../services/api";

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { library, libraryLoading } = useAppSelector((state) => state.purchase);
  const [coverImages, setCoverImages] = useState<Record<number, string>>({});

  useEffect(() => {
    dispatch(getUserLibrary());
  }, [dispatch]);

  // Load cover images
  useEffect(() => {
    const loadCoverImages = async () => {
      for (const item of library) {
        if (!coverImages[item.book.id]) {
          try {
            const blob = await bookApi.getBookCover(item.book.id);
            const url = URL.createObjectURL(blob);
            setCoverImages((prev) => ({ ...prev, [item.book.id]: url }));
          } catch (error) {
            console.error(
              `Failed to load cover for book ${item.book.id}:`,
              error
            );
          }
        }
      }
    };

    if (library.length > 0) {
      loadCoverImages();
    }

    return () => {
      Object.values(coverImages).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownload = async (bookId: number, title: string) => {
    try {
      const blob = await bookApi.getBookFile(bookId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("فشل تحميل الكتاب");
    }
  };

  if (libraryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
        <span className="mr-4 font-tajawal text-gray-600 text-lg">
          جاري تحميل مكتبتك...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-changa font-bold text-primary mb-4">
            مكتبتي الشخصية
          </h1>
          <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
            جميع الكتب التي اشتريتها في مكان واحد، جاهزة للقراءة والتحميل
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            {
              label: "إجمالي الكتب",
              value: library.length,
              icon: "📚",
              color: "from-primary to-secondary",
            },
            {
              label: "كتب مخصصة",
              value: library.filter((b) => b.custom_book).length,
              icon: "✨",
              color: "from-accent2 to-secondary",
            },
            {
              label: "كتب عادية",
              value: library.filter((b) => !b.custom_book).length,
              icon: "📖",
              color: "from-accent1 to-primary",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`bg-gradient-to-r ${stat.color} rounded-3xl p-6 text-white text-center`}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-changa font-bold mb-2">
                {stat.value}
              </div>
              <div className="font-reem">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Books Grid */}
        {library.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {library.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden"
              >
                {/* Book Cover */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  {coverImages[item.book.id] ? (
                    <img
                      src={coverImages[item.book.id]}
                      alt={item.book.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => navigate(`/books/${item.book.id}`)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="text-primary/40" size={64} />
                    </div>
                  )}

                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-accent2 to-secondary text-white px-3 py-1 rounded-full text-xs font-reem">
                      {item.custom_book ? "مخصص" : "عادي"}
                    </span>
                  </div>

                  <div className="absolute top-4 left-4">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:text-primary transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3
                    className="font-reem font-bold text-xl text-gray-800 mb-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/books/${item.book.id}`)}
                  >
                    {item.book.title}
                  </h3>

                  <p className="font-tajawal text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.book.description}
                  </p>

                  {/* Info */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 ml-2" />
                      <span className="font-tajawal">
                        {formatDate(item.added_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent1 fill-current" />
                      <span className="font-tajawal">{item.book.rate}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.book.rate)
                              ? "text-accent1 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleDownload(item.book.id, item.book.title)
                      }
                      className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-2xl font-reem font-semibold flex items-center justify-center shadow-lg"
                    >
                      <Download className="h-5 w-5 ml-2" />
                      تحميل PDF
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(`/books/${item.book.id}`)}
                      className="w-full bg-white border-2 border-primary text-primary py-3 rounded-2xl font-reem font-semibold flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <BookOpen className="h-5 w-5 ml-2" />
                      عرض التفاصيل
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">📚</div>
            <h2 className="text-2xl font-reem font-bold text-gray-600 mb-4">
              مكتبتك فارغة حتى الآن
            </h2>
            <p className="font-tajawal text-gray-500 mb-8 max-w-md mx-auto">
              ابدأ في شراء الكتب أو إنشاء قصص مخصصة لأطفالك واجعلهم أبطال
              المغامرات الرائعة
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/books")}
                className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
              >
                تصفح الكتب
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create")}
                className="bg-transparent border-2 border-primary text-primary px-8 py-4 rounded-full font-reem text-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                أنشئ قصة مخصصة
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        {library.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8"
          >
            <h2 className="text-2xl md:text-3xl font-changa font-bold text-primary mb-4">
              هل تريد المزيد من الكتب؟
            </h2>
            <p className="font-reem text-gray-600 mb-6 max-w-2xl mx-auto">
              تصفح مجموعتنا الواسعة من الكتب أو أنشئ قصصًا مخصصة جديدة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/books")}
                className="bg-gradient-to-r from-accent2 to-secondary text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
              >
                تصفح الكتب
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/create")}
                className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-full font-reem text-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                أنشئ قصة جديدة
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyLibraryPage;
