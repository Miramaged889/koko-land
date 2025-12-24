import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  BookOpen,
  Users,
  Loader2,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  getBook,
  customizeBook,
  clearError,
} from "../../store/slices/bookSlice";
import { createPurchaseRequest } from "../../store/slices/purchaseSlice";
import { bookApi } from "../../services/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";

const BookDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId: string }>();
  const dispatch = useAppDispatch();
  const { book, loading, error, customizeBookLoading } = useAppSelector(
    (state) => state.books
  );
  const { createRequestLoading } = useAppSelector((state) => state.purchase);

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [customizeForm, setCustomizeForm] = useState({
    child_name: "",
    child_age: "",
  });
  const [childImageFile, setChildImageFile] = useState<File | null>(null);
  const [childImagePreview, setChildImagePreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (bookId) {
      dispatch(getBook(parseInt(bookId)));
    }
  }, [bookId, dispatch]);

  // Load cover image
  useEffect(() => {
    const loadCoverImage = async () => {
      if (book?.cover_image) {
        try {
          const blob = await bookApi.getBookCover(book.id);
          const url = URL.createObjectURL(blob);
          setCoverImageUrl(url);
        } catch (error) {
          console.error("Failed to load cover image:", error);
        }
      }
    };

    if (book) {
      loadCoverImage();
    }

    return () => {
      if (coverImageUrl) {
        URL.revokeObjectURL(coverImageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  const handleChildImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChildImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setChildImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomizeBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !book ||
      !childImageFile ||
      !customizeForm.child_name.trim() ||
      !customizeForm.child_age.trim()
    ) {
      alert("جميع الحقول مطلوبة");
      return;
    }

    try {
      await dispatch(
        customizeBook({
          book: book.id,
          child_name: customizeForm.child_name.trim(),
          child_age: customizeForm.child_age.trim(),
          child_image: childImageFile,
        })
      ).unwrap();

      alert("تم تخصيص الكتاب بنجاح!");
      setShowCustomizeModal(false);
      setCustomizeForm({ child_name: "", child_age: "" });
      setChildImageFile(null);
      setChildImagePreview(null);
      // Optionally navigate to library or show success message
    } catch (err: unknown) {
      alert((err as Error).message || "فشل تخصيص الكتاب");
    }
  };

  const handleDownloadBook = async () => {
    if (!book) return;

    try {
      const blob = await bookApi.getBookFile(book.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("فشل تحميل الكتاب");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
        <span className="mr-4 font-tajawal text-gray-600 text-lg">
          جاري تحميل تفاصيل الكتاب...
        </span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-reem font-bold text-gray-800 mb-2">
            الكتاب غير موجود
          </h2>
          <p className="font-tajawal text-gray-600 mb-4">
            {error || "لم يتم العثور على الكتاب"}
          </p>
          <Button onClick={() => navigate("/books")}>العودة إلى الكتب</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/books")}
          className="mb-6 flex items-center text-primary hover:text-secondary transition-colors font-reem"
        >
          <span className="ml-2">←</span>
          العودة إلى الكتب
        </motion.button>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-600 font-tajawal text-sm">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="mr-auto text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Book Preview */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Book Cover */}
            <div className="h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl mb-6 relative overflow-hidden shadow-2xl">
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="text-primary/40" size={96} />
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3"
              >
                <Heart
                  className={`h-6 w-6 transition-colors ${
                    isLiked ? "text-red-500 fill-current" : "text-white"
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Book Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <div className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full font-reem text-sm">
              {book.category}
            </div>

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl md:text-4xl font-changa font-bold text-gray-800 mb-4">
                {book.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(book.rate)
                          ? "text-accent1 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-tajawal text-gray-600">{book.rate}</span>
              </div>
            </div>

            {/* Book Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <Users className="h-5 w-5 ml-2 text-primary" />
                <span className="font-tajawal">{book.age}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-tajawal">{book.gender}</span>
              </div>
              <div className="flex items-center text-gray-600 col-span-2">
                <span className="font-tajawal">الشخصية: {book.char_name}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="font-tajawal text-gray-700 leading-relaxed text-lg">
                {book.description}
              </p>
            </div>

            {/* Price & Actions */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-changa font-bold text-primary">
                  {book.price} ر.س
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCustomizeModal(true)}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-reem font-semibold flex items-center justify-center shadow-lg"
                >
                  <Upload className="h-5 w-5 ml-2" />
                  خصص الكتاب لطفلك
                </motion.button>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      if (!book) return;
                      try {
                        await dispatch(
                          createPurchaseRequest({ book_id: book.id })
                        ).unwrap();
                        alert(
                          "تم إنشاء طلب الشراء بنجاح! سيتم مراجعته من قبل المدير."
                        );
                        navigate("/profile");
                      } catch (err: unknown) {
                        alert((err as Error).message || "فشل إنشاء طلب الشراء");
                      }
                    }}
                    disabled={createRequestLoading}
                    className={`flex-1 border-2 border-primary py-4 rounded-2xl font-reem font-semibold transition-colors ${
                      createRequestLoading
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                        : "bg-white text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    {createRequestLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 inline-block ml-2 animate-spin" />
                        جاري المعالجة...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 inline-block ml-2" />
                        اشترِ الآن
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownloadBook}
                    className="px-6 bg-white border-2 border-primary text-primary py-4 rounded-2xl font-reem font-semibold hover:bg-primary hover:text-white transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Personalization Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-accent1/20 rounded-2xl p-4 border border-accent1/30"
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl ml-2">✨</span>
                <h4 className="font-reem font-semibold text-primary">
                  قصة مخصصة
                </h4>
              </div>
              <p className="font-tajawal text-sm text-gray-600">
                يمكنك تخصيص القصة بصورة طفلك واسمه لتصبح مغامرة شخصية فريدة
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-reem font-bold text-gray-800">
                تخصيص الكتاب
              </h2>
              <button
                onClick={() => {
                  setShowCustomizeModal(false);
                  setCustomizeForm({ child_name: "", child_age: "" });
                  setChildImageFile(null);
                  setChildImagePreview(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCustomizeBook} className="space-y-4">
              <Input
                label="اسم الطفل"
                value={customizeForm.child_name}
                onChange={(e) =>
                  setCustomizeForm({
                    ...customizeForm,
                    child_name: e.target.value,
                  })
                }
                placeholder="أدخل اسم الطفل"
                required
              />

              <Input
                label="عمر الطفل"
                value={customizeForm.child_age}
                onChange={(e) =>
                  setCustomizeForm({
                    ...customizeForm,
                    child_age: e.target.value,
                  })
                }
                placeholder="مثال: 5"
                required
              />

              <div>
                <label className="block text-sm font-tajawal font-medium text-gray-700 mb-2">
                  صورة الطفل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChildImageChange}
                    className="hidden"
                    id="child-image"
                    required
                  />
                  <label
                    htmlFor="child-image"
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload size={20} className="text-gray-400" />
                    <span className="font-tajawal text-sm text-gray-600">
                      {childImageFile ? childImageFile.name : "اختر صورة الطفل"}
                    </span>
                  </label>
                  {childImagePreview && (
                    <img
                      src={childImagePreview}
                      alt="Child preview"
                      className="mt-2 w-full h-48 object-cover rounded-xl"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCustomizeModal(false);
                    setCustomizeForm({ child_name: "", child_age: "" });
                    setChildImageFile(null);
                    setChildImagePreview(null);
                  }}
                  className="flex-1"
                  icon={<X size={16} />}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={customizeBookLoading}
                  icon={
                    customizeBookLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Upload size={16} />
                    )
                  }
                  className="flex-1"
                >
                  {customizeBookLoading ? "جاري المعالجة..." : "خصص الكتاب"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
