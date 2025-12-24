import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star, Heart, BookOpen, Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { listBooks } from "../../store/slices/bookSlice";
import { bookApi } from "../../services/api";

const BooksPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);
  const [coverImages, setCoverImages] = useState<Record<number, string>>({});
  const [loadingCovers, setLoadingCovers] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    dispatch(listBooks());
  }, [dispatch]);

  // Load cover images
  useEffect(() => {
    const loadCoverImages = async () => {
      for (const book of books) {
        if (!coverImages[book.id] && !loadingCovers[book.id]) {
          setLoadingCovers((prev) => ({ ...prev, [book.id]: true }));
          try {
            const blob = await bookApi.getBookCover(book.id);
            const url = URL.createObjectURL(blob);
            setCoverImages((prev) => ({ ...prev, [book.id]: url }));
          } catch (error) {
            console.error(`Failed to load cover for book ${book.id}:`, error);
          } finally {
            setLoadingCovers((prev) => ({ ...prev, [book.id]: false }));
          }
        }
      }
    };

    if (books.length > 0) {
      loadCoverImages();
    }

    // Cleanup URLs on unmount
    return () => {
      Object.values(coverImages).forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  // Get unique categories from books
  const categories = [
    "الكل",
    ...Array.from(new Set(books.map((book) => book.category))),
  ];
  const [selectedCategory, setSelectedCategory] = React.useState("الكل");

  const filteredBooks =
    selectedCategory === "الكل"
      ? books
      : books.filter((book) => book.category === selectedCategory);

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
            مكتبة القصص الرائعة
          </h1>
          <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
            اختر القصة المناسبة لطفلك واجعله بطل المغامرة
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-reem font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-primary hover:text-white border border-gray-200"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={48} />
            <span className="mr-4 font-tajawal text-gray-600 text-lg">
              جاري تحميل الكتب...
            </span>
          </div>
        )}

        {/* Books Grid */}
        {!loading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/books/${book.id}`)}
              >
                {/* Book Cover */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                  {loadingCovers[book.id] ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2
                        className="animate-spin text-primary"
                        size={32}
                      />
                    </div>
                  ) : coverImages[book.id] ? (
                    <img
                      src={coverImages[book.id]}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="text-primary/40" size={64} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white font-reem text-sm">
                      {book.category}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:text-red-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Add to favorites
                      }}
                    >
                      <Heart className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-6">
                  <h3 className="font-reem font-bold text-xl text-gray-800 mb-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="font-tajawal text-gray-600 text-sm mb-1">
                    الشخصية: {book.char_name}
                  </p>
                  <p className="font-tajawal text-gray-600 text-sm mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(book.rate)
                              ? "text-accent1 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-tajawal text-sm text-gray-600 mr-2">
                      ({book.rate})
                    </span>
                    <span className="font-tajawal text-xs text-gray-500 mr-2">
                      • {book.age}
                    </span>
                    <span className="font-tajawal text-xs text-gray-500">
                      • {book.gender}
                    </span>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-changa font-bold text-primary">
                      {book.price} ر.س
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/books/${book.id}`);
                      }}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-reem text-sm font-medium flex items-center"
                    >
                      <BookOpen className="h-4 w-4 ml-2" />
                      عرض التفاصيل
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredBooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-reem font-semibold text-gray-600 mb-2">
              {selectedCategory === "الكل"
                ? "لا توجد كتب متاحة"
                : "لا توجد كتب في هذه الفئة"}
            </h3>
            <p className="font-tajawal text-gray-500">
              {selectedCategory === "الكل"
                ? "جاري إضافة كتب جديدة"
                : "جرب فئة أخرى أو تصفح جميع الكتب"}
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mt-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8"
        >
          <h2 className="text-2xl md:text-3xl font-changa font-bold text-primary mb-4">
            هل تريد قصة مخصصة لطفلك؟
          </h2>
          <p className="font-reem text-gray-600 mb-6 max-w-2xl mx-auto">
            أنشئ قصة فريدة بصورة طفلك واجعله بطل المغامرة
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-accent2 to-secondary text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
          >
            أنشئ قصتك الآن
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default BooksPage;
