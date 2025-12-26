import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Check, Gift, Loader2, Send } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getBook } from "../../store/slices/bookSlice";
import { createPurchaseRequest } from "../../store/slices/purchaseSlice";
import { fetchProfile } from "../../store/slices/profileSlice";
import { bookApi } from "../../services/api";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { book, loading: bookLoading } = useAppSelector((state) => state.books);
  const { profile } = useAppSelector((state) => state.profile);
  const { createRequestLoading } = useAppSelector((state) => state.purchase);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

  // Get bookId from location state
  const bookId = location.state?.bookId;

  // Fetch book and profile on mount
  useEffect(() => {
    if (bookId) {
      dispatch(getBook(bookId));
    }
    dispatch(fetchProfile());
  }, [bookId, dispatch]);

  // Load cover image
  useEffect(() => {
    if (!book) return;

    const loadCoverImage = async () => {
      try {
        const blob = await bookApi.getBookCover(book.id);
        const url = URL.createObjectURL(blob);
        setCoverImageUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch (error) {
        console.error("Failed to load cover image:", error);
      }
    };

    loadCoverImage();

    return () => {
      setCoverImageUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [book]);

  // Redirect if no bookId
  useEffect(() => {
    if (!bookId) {
      navigate("/books");
    }
  }, [bookId, navigate]);

  const total = book ? Number(book.price) || 0 : 0;
  const tax = total * 0.15;
  const finalTotal = total + tax;

  const handlePayment = async () => {
    if (!book || !profile) {
      alert("خطأ: لم يتم تحميل بيانات الكتاب أو المستخدم");
      return;
    }

    setIsProcessing(true);

    try {
      await dispatch(
        createPurchaseRequest({
          book_id: book.id,
          customization_id: null,
        })
      ).unwrap();

      setIsProcessing(false);
      setOrderComplete(true);

      // Redirect to library after success
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (err: unknown) {
      setIsProcessing(false);
      alert((err as Error).message || "فشل إتمام عملية الشراء");
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md mx-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-r from-accent2 to-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="text-2xl font-changa font-bold text-primary mb-4">
            تم إرسال طلب الشراء بنجاح! 🎉
          </h1>

          <p className="font-reem text-gray-600 mb-6">
            شكرًا لك! تم إرسال طلبك إلى المدير للموافقة. سيتم إشعارك عند
            الموافقة على طلبك.
          </p>

          <div className="flex space-x-2 space-x-reverse justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ delay: i * 0.2, repeat: Infinity, duration: 1.5 }}
                className="w-3 h-3 bg-primary rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (bookLoading || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
        <span className="mr-4 font-tajawal text-gray-600 text-lg">
          جاري تحميل بيانات الطلب...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-changa font-bold text-primary mb-4">
            إتمام الطلب
          </h1>
          <p className="text-xl font-reem text-gray-600">
            خطوة واحدة فقط للحصول على الكتاب
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="h-6 w-6 ml-3 text-primary" />
                ملخص الطلب
              </h2>

              {/* Order Items */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 rounded-2xl p-6"
                >
                  <div className="flex gap-4 mb-4">
                    {coverImageUrl && (
                      <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-reem font-semibold text-gray-800 mb-2">
                        {book.title}
                      </h3>
                      <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-reem mb-2">
                        {book.category}
                      </span>
                      <p className="font-tajawal text-sm text-gray-600 line-clamp-2">
                        {book.description}
                      </p>
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-changa font-bold text-primary">
                        {book.price} ر.س
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-accent2 rounded-full ml-3"></div>
                      <span className="font-tajawal">
                        الشخصية: {book.char_name}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-accent2 rounded-full ml-3"></div>
                      <span className="font-tajawal">العمر: {book.age}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-accent2 rounded-full ml-3"></div>
                      <span className="font-tajawal">الجنس: {book.gender}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-gray-200 mt-8 pt-6 space-y-4">
                <div className="flex justify-between font-tajawal">
                  <span className="text-gray-600">المجموع الفرعي:</span>
                  <span className="font-semibold">{total.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between font-tajawal">
                  <span className="text-gray-600">
                    ضريبة القيمة المضافة (15%):
                  </span>
                  <span className="font-semibold">{tax.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-xl font-changa font-bold text-primary border-t border-gray-200 pt-4">
                  <span>المجموع الكلي:</span>
                  <span>{finalTotal.toFixed(2)} ر.س</span>
                </div>
              </div>

              {/* Guarantee */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-accent2/10 to-secondary/10 rounded-2xl p-4 mt-6 mb-6"
              >
                <div className="flex items-center mb-2">
                  <Gift className="h-5 w-5 text-accent2 ml-2" />
                  <span className="font-reem font-semibold text-accent2">
                    ضمان الرضا
                  </span>
                </div>
                <p className="font-tajawal text-sm text-gray-600">
                  إذا لم تكن راضيًا عن القصة، سنرد أموالك خلال 30 يومًا
                </p>
              </motion.div>

              {/* Info Note */}
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center mb-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600 ml-2" />
                  <span className="font-reem font-semibold text-blue-600">
                    ملاحظة مهمة
                  </span>
                </div>
                <p className="font-tajawal text-sm text-gray-700">
                  سيتم إرسال طلب الشراء إلى المدير للموافقة عليه. سيتم إشعارك
                  عند الموافقة على طلبك.
                </p>
              </div>

              {/* Send Request Button */}
              <motion.button
                whileHover={{
                  scale: isProcessing || createRequestLoading ? 1 : 1.02,
                }}
                whileTap={{
                  scale: isProcessing || createRequestLoading ? 1 : 0.98,
                }}
                onClick={handlePayment}
                disabled={
                  isProcessing || createRequestLoading || !book || !profile
                }
                className={`w-full py-4 rounded-2xl font-reem text-lg font-semibold transition-all flex items-center justify-center ${
                  isProcessing || createRequestLoading || !book || !profile
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing || createRequestLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin ml-3" />
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6 ml-3" />
                    إرسال طلب الشراء
                  </>
                )}
              </motion.button>

              <p className="font-tajawal text-xs text-gray-500 text-center mt-4">
                بالنقر على "إرسال طلب الشراء"، سيتم إرسال طلبك إلى المدير
                للموافقة
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
