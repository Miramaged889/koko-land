import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getUserLibrary } from "../../store/slices/purchaseSlice";
import LibraryCard from "../../components/cards/LibraryCard";
import {
  bookApi,
  CustomizationSummary,
  Book,
  LibraryItem,
} from "../../services/api";

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { library, libraryLoading } = useAppSelector((state) => state.purchase);

  const [customizationsMap, setCustomizationsMap] = useState<
    Record<number, CustomizationSummary>
  >({});
  const [booksMap, setBooksMap] = useState<Record<number, Book>>({});

  useEffect(() => {
    dispatch(getUserLibrary());
  }, [dispatch]);

  // Fetch customizations when library is loaded
  useEffect(() => {
    if (library.length > 0) {
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
  }, [library]);

  // Fetch books when library is loaded
  useEffect(() => {
    if (library.length > 0) {
      const fetchBooks = async () => {
        try {
          // Get unique book IDs that are numbers (not Book objects)
          const bookIds = new Set<number>();
          library.forEach((item) => {
            if (item.book !== null && typeof item.book === "number") {
              bookIds.add(item.book);
            }
          });

          // Fetch all books in parallel
          const bookPromises = Array.from(bookIds).map(async (bookId) => {
            try {
              const book = await bookApi.getBook(bookId);
              return { id: bookId, book };
            } catch (error) {
              console.error(`Failed to load book ${bookId}:`, error);
              return null;
            }
          });

          const bookResults = await Promise.all(bookPromises);
          const map: Record<number, Book> = {};
          bookResults.forEach((result) => {
            if (result) {
              map[result.id] = result.book;
            }
          });
          setBooksMap(map);
        } catch (error) {
          console.error("Failed to load books:", error);
        }
      };

      fetchBooks();
    }
  }, [library]);

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
              value: library.filter((b) => b.custom_book !== null).length,
              icon: "✨",
              color: "from-accent2 to-secondary",
            },
            {
              label: "كتب عادية",
              value: library.filter(
                (b) => b.book !== null && b.custom_book === null
              ).length,
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
        {library.filter(
          (item) => item.book !== null || item.custom_book !== null
        ).length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {library
              .filter((item) => item.book !== null || item.custom_book !== null)
              .map((item, index) => {
                // Convert book ID to Book object if needed
                let bookData: Book | null = null;
                if (item.book !== null) {
                  if (typeof item.book === "number") {
                    bookData = booksMap[item.book] || null;
                  } else {
                    bookData = item.book;
                  }
                }

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <LibraryCard
                      libraryItem={{ ...item, book: bookData } as LibraryItem}
                      customizationSummary={
                        item.custom_book
                          ? customizationsMap[item.custom_book] || undefined
                          : undefined
                      }
                    />
                  </motion.div>
                );
              })}
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
