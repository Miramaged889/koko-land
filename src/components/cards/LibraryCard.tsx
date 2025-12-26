import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LibraryItem, CustomizationSummary, Book } from "../../services/api";
import { bookApi } from "../../services/api";
import Button from "../ui/Button";
import {
  Download,
  BookOpen,
  Loader2,
  Calendar,
  User,
  X,
  Eye,
  Star,
  Users,
} from "lucide-react";

interface LibraryCardProps {
  libraryItem: LibraryItem;
  customizationSummary?: CustomizationSummary;
}

const LibraryCard: React.FC<LibraryCardProps> = ({
  libraryItem,
  customizationSummary,
}) => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [childImageUrl, setChildImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [bookDetails, setBookDetails] = useState<Book | null>(null);
  const [loadingBookDetails, setLoadingBookDetails] = useState(false);
  const book = libraryItem.book;

  // Type guard to check if book is a Book object (not a number)
  const isBookObject = (book: Book | number | null): book is Book => {
    return book !== null && typeof book === "object" && "id" in book;
  };

  // Note: We no longer fetch customization details via getCustomization API
  // We use customizationSummary prop which contains all needed data from listCustomizations API

  // Load cover image
  useEffect(() => {
    const loadCoverImage = async () => {
      const bookObj = book && isBookObject(book) ? book : null;
      if (bookObj) {
        // Regular book
        try {
          setLoadingImage(true);
          const coverBlob = await bookApi.getBookCover(bookObj.id);
          const coverUrl = URL.createObjectURL(coverBlob);
          setCoverImageUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return coverUrl;
          });
        } catch {
          // Silently fail - image will show placeholder
        } finally {
          setLoadingImage(false);
        }
      } else if (customizationSummary) {
        // Custom book with summary - use book_id from summary
        try {
          setLoadingImage(true);
          const coverBlob = await bookApi.getBookCover(
            customizationSummary.book_id
          );
          const coverUrl = URL.createObjectURL(coverBlob);
          setCoverImageUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return coverUrl;
          });
          // Load child image using the child_image_url from summary
          try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(customizationSummary.child_image_url, {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                  }
                : {},
            });
            if (response.ok) {
              const childBlob = await response.blob();
              const childUrl = URL.createObjectURL(childBlob);
              setChildImageUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return childUrl;
              });
            }
          } catch {
            // Silently fail - child image won't show
          }
        } catch {
          // Silently fail - images will show placeholder
        } finally {
          setLoadingImage(false);
        }
      }
    };

    if ((book && isBookObject(book)) || customizationSummary) {
      loadCoverImage();
    }

    return () => {
      // Cleanup URLs when component unmounts or dependencies change
      setCoverImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setChildImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [book, customizationSummary]);

  // For custom books, we need customization summary to display
  // If we don't have summary, show a placeholder card
  if (
    !isBookObject(book) &&
    !customizationSummary &&
    libraryItem.custom_book !== null
  ) {
    // Custom book exists but failed to load - show placeholder
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          <BookOpen className="text-gray-400" size={48} />
        </div>
        <div className="p-4">
          <h3 className="font-reem font-bold text-lg text-gray-800 mb-2">
            كتاب مخصص
          </h3>
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-gray-400" />
            <span className="font-tajawal text-xs text-gray-500">
              أضيف في:{" "}
              {new Date(libraryItem.added_at).toLocaleDateString("ar-SA")}
            </span>
          </div>
          <div className="text-sm text-gray-500 font-tajawal">
            لا يمكن تحميل التفاصيل حالياً
          </div>
        </div>
      </motion.div>
    );
  }

  // Don't render if neither book nor customization summary is available
  if (!isBookObject(book) && !customizationSummary) {
    return null;
  }

  // Use summary data for display
  const bookObject = book && isBookObject(book) ? book : null;
  const displayBook =
    bookObject ||
    (customizationSummary
      ? { id: customizationSummary.book_id, category: "", price: 0 }
      : null);
  const displayTitle =
    bookObject?.title || customizationSummary?.book_title || "كتاب مخصص";
  const childName = customizationSummary?.child_name || "";
  const childAge = customizationSummary?.child_age || "";

  const handleShowDetails = async () => {
    if (customizationSummary && customizationSummary.book_id) {
      setShowDetailsModal(true);
      setLoadingBookDetails(true);
      try {
        const bookData = await bookApi.getBook(customizationSummary.book_id);
        setBookDetails(bookData);
      } catch {
        // Silently fail
      } finally {
        setLoadingBookDetails(false);
      }
    } else if (book && isBookObject(book)) {
      setShowDetailsModal(true);
      setBookDetails(book);
    }
  };

  const handleDownload = async () => {
    try {
      if (book && isBookObject(book)) {
        // Regular book
        const blob = await bookApi.getBookFile(book.id);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${book.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (customizationSummary) {
        // Custom book with summary - use custom_book_url
        const token = localStorage.getItem("accessToken");
        const response = await fetch(customizationSummary.custom_book_url, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${customizationSummary.book_title}_${customizationSummary.child_name}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          throw new Error("Failed to download");
        }
      }
    } catch {
      alert("فشل تحميل الكتاب");
    }
  };

  if (!displayBook) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Cover Image */}
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        {loadingImage ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : coverImageUrl ? (
          <div className="relative w-full h-full">
            <img
              src={coverImageUrl}
              alt={displayTitle}
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleShowDetails}
            />
            {childImageUrl && childName && (
              <div className="absolute bottom-2 left-2 w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-lg">
                <img
                  src={childImageUrl}
                  alt={childName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="text-gray-400" size={48} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-reem font-bold text-lg text-gray-800 mb-2 cursor-pointer hover:text-primary transition-colors"
          onClick={handleShowDetails}
        >
          {displayTitle}
        </h3>
        {childName && (
          <div className="flex items-center gap-2 mb-2">
            <User size={14} className="text-primary" />
            <span className="font-tajawal text-sm text-primary font-semibold">
              {childName} {childAge ? `(${childAge} سنة)` : ""}
            </span>
          </div>
        )}
        {displayBook &&
          typeof displayBook === "object" &&
          "category" in displayBook && (
            <div className="flex items-center gap-2 mb-3">
              {displayBook.category && (
                <>
                  <span className="font-tajawal text-sm text-gray-600">
                    {displayBook.category}
                  </span>
                  <span className="text-gray-300">•</span>
                </>
              )}
              {"price" in displayBook && displayBook.price > 0 && (
                <span className="text-primary font-changa font-bold">
                  {displayBook.price} ر.س
                </span>
              )}
            </div>
          )}
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-gray-400" />
          <span className="font-tajawal text-xs text-gray-500">
            أضيف في:{" "}
            {new Date(libraryItem.added_at).toLocaleDateString("ar-SA")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
            icon={<Download size={16} />}
          >
            تحميل
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShowDetails}
            className="flex-1"
            icon={<Eye size={16} />}
          >
            عرض
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="text-2xl font-changa font-bold text-gray-800">
                تفاصيل الكتاب
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingBookDetails ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="mr-3 font-tajawal text-gray-600">
                    جاري التحميل...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Cover Image */}
                  <div className="relative">
                    <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden">
                      {coverImageUrl ? (
                        <img
                          src={coverImageUrl}
                          alt={displayTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="text-gray-400" size={64} />
                        </div>
                      )}
                      {childImageUrl && childName && (
                        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-xl">
                          <img
                            src={childImageUrl}
                            alt={childName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="space-y-6">
                    {/* Title */}
                    <div>
                      <h3 className="text-3xl font-changa font-bold text-gray-800 mb-2">
                        {displayTitle}
                      </h3>
                      {customizationSummary && (
                        <div className="mt-4 p-4 bg-primary/10 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="text-primary" size={20} />
                            <span className="font-reem font-semibold text-primary text-lg">
                              {customizationSummary.child_name}
                            </span>
                          </div>
                          {customizationSummary.child_age && (
                            <div className="flex items-center gap-2">
                              <Users className="text-primary" size={18} />
                              <span className="font-tajawal text-gray-700">
                                العمر: {customizationSummary.child_age} سنة
                              </span>
                            </div>
                          )}
                          <div className="mt-3 pt-3 border-t border-primary/20">
                            <span className="font-tajawal text-sm text-gray-600">
                              تاريخ الإنشاء:{" "}
                              {new Date(
                                customizationSummary.created_at
                              ).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Book Info */}
                    {bookDetails && (
                      <>
                        {/* Category */}
                        {bookDetails.category && (
                          <div>
                            <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-reem text-sm">
                              {bookDetails.category}
                            </span>
                          </div>
                        )}

                        {/* Rating */}
                        {bookDetails.rate && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < Math.floor(bookDetails.rate)
                                      ? "text-accent1 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-tajawal text-gray-600">
                              {bookDetails.rate}
                            </span>
                          </div>
                        )}

                        {/* Book Info Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {bookDetails.age && (
                            <div className="flex items-center text-gray-600">
                              <Users className="h-5 w-5 ml-2 text-primary" />
                              <span className="font-tajawal">
                                العمر: {bookDetails.age}
                              </span>
                            </div>
                          )}
                          {bookDetails.gender && (
                            <div className="flex items-center text-gray-600">
                              <span className="font-tajawal">
                                الجنس: {bookDetails.gender}
                              </span>
                            </div>
                          )}
                          {bookDetails.char_name && (
                            <div className="flex items-center text-gray-600 col-span-2">
                              <span className="font-tajawal">
                                الشخصية: {bookDetails.char_name}
                              </span>
                            </div>
                          )}
                          {bookDetails.price && bookDetails.price > 0 && (
                            <div className="flex items-center text-gray-600 col-span-2">
                              <span className="font-changa font-bold text-primary text-xl">
                                السعر: {bookDetails.price} ر.س
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        {bookDetails.description && (
                          <div>
                            <h4 className="font-reem font-semibold text-gray-800 mb-2">
                              الوصف:
                            </h4>
                            <p className="font-tajawal text-gray-600 leading-relaxed">
                              {bookDetails.description}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200">
                      <Button
                        variant="primary"
                        onClick={handleDownload}
                        className="flex-1"
                        icon={<Download size={18} />}
                      >
                        تحميل PDF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowDetailsModal(false)}
                        className="flex-1"
                      >
                        إغلاق
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default LibraryCard;
