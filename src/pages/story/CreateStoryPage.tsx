import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Upload,
  User,
  Sparkles,
  BookOpen,
  Camera,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { listBooks, customizeBook } from "../../store/slices/bookSlice";
import { createPurchaseRequest } from "../../store/slices/purchaseSlice";

const CreateStoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { books, loading, customizeBookLoading, error } = useAppSelector(
    (state) => state.books
  );
  const { createRequestLoading } = useAppSelector((state) => state.purchase);

  // Get bookId from location state (if navigating from BookDetailsPage)
  const bookIdFromState = location.state?.bookId as number | undefined;

  const [childName, setChildName] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [childImageFile, setChildImageFile] = useState<File | null>(null);
  const [childImagePreview, setChildImagePreview] = useState<string | null>(
    null
  );
  const [step, setStep] = useState(1);
  const [customizationId, setCustomizationId] = useState<number | null>(null);

  // Load books on mount
  useEffect(() => {
    dispatch(listBooks());
  }, [dispatch]);

  // Pre-select the book if bookId is passed from navigation (but don't skip steps)
  useEffect(() => {
    if (bookIdFromState && books.length > 0) {
      const bookExists = books.some((book) => book.id === bookIdFromState);
      if (bookExists) {
        setSelectedBookId(bookIdFromState);
      }
    }
  }, [bookIdFromState, books]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setChildImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setChildImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreateStory = async () => {
    if (
      !selectedBookId ||
      !childImageFile ||
      !childName.trim() ||
      !selectedAge.trim()
    ) {
      alert("جميع الحقول مطلوبة");
      return;
    }

    try {
      const customizeResult = await dispatch(
        customizeBook({
          book: selectedBookId,
          child_name: childName.trim(),
          child_age: selectedAge.trim(),
          child_image: childImageFile,
        })
      ).unwrap();

      // Save customization_id for purchase request
      if (customizeResult.customization_id) {
        setCustomizationId(customizeResult.customization_id);
        // Move to step 4 (purchase request)
        setStep(4);
      } else {
        alert("تم تخصيص الكتاب بنجاح!");
        navigate("/profile");
      }
    } catch (err: unknown) {
      alert((err as Error).message || "فشل تخصيص الكتاب");
    }
  };

  const handleCreatePurchaseRequest = async () => {
    if (!customizationId) {
      alert("خطأ: لم يتم إنشاء التخصيص");
      return;
    }

    try {
      await dispatch(
        createPurchaseRequest({
          book_id: null,
          customization_id: customizationId,
        })
      ).unwrap();

      alert("تم إرسال طلب الشراء بنجاح! سيتم مراجعته من قبل الإدارة.");
      navigate("/profile");
    } catch (err: unknown) {
      alert((err as Error).message || "فشل إرسال طلب الشراء");
    }
  };

  const isStepComplete = (stepNum: number) => {
    switch (stepNum) {
      case 1:
        return childName.trim() !== "" && selectedAge !== "";
      case 2:
        return childImageFile !== null;
      case 3:
        return selectedBookId !== null;
      case 4:
        return customizationId !== null;
      default:
        return false;
    }
  };

  const selectedBook = books.find((book) => book.id === selectedBookId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-changa font-bold text-primary mb-4">
            أنشئ قصة طفلك المميزة
          </h1>
          <p className="text-xl font-reem text-gray-600 max-w-2xl mx-auto">
            اتبع الخطوات البسيطة لإنشاء قصة فريدة مخصصة لطفلك
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-center space-x-4 space-x-reverse">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <motion.div
                  animate={{
                    scale: step === stepNum ? 1.2 : 1,
                    backgroundColor: step >= stepNum ? "#FF6F61" : "#E5E7EB",
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    step >= stepNum ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  {isStepComplete(stepNum) ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    stepNum
                  )}
                </motion.div>
                {stepNum < 4 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step > stepNum ? "bg-primary" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex space-x-6 space-x-reverse text-xs font-reem text-center">
              <span className={step >= 1 ? "text-primary" : "text-gray-500"}>
                معلومات الطفل
              </span>
              <span className={step >= 2 ? "text-primary" : "text-gray-500"}>
                صورة الطفل
              </span>
              <span className={step >= 3 ? "text-primary" : "text-gray-500"}>
                اختر القصة
              </span>
              <span className={step >= 4 ? "text-primary" : "text-gray-500"}>
                طلب الشراء
              </span>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2"
          >
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-600 font-tajawal text-sm">{error}</span>
          </motion.div>
        )}

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 mb-8"
        >
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">👶</div>
                <h2 className="text-2xl font-reem font-bold text-primary mb-2">
                  أخبرنا عن طفلك
                </h2>
                <p className="font-tajawal text-gray-600">
                  سنحتاج لبعض المعلومات البسيطة لتخصيص القصة
                </p>
              </div>

              <div className="space-y-6 max-w-md mx-auto">
                <div>
                  <label className="block font-reem font-semibold text-gray-700 mb-3">
                    اسم الطفل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="أدخل اسم طفلك"
                      className="w-full pr-12 pl-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-reem font-semibold text-gray-700 mb-3">
                    العمر
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["2-3", "4-5", "6-7"].map((age) => (
                      <motion.button
                        key={age}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedAge(age)}
                        className={`py-3 px-4 rounded-2xl font-reem font-medium transition-all ${
                          selectedAge === age
                            ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {age} سنوات
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📸</div>
                <h2 className="text-2xl font-reem font-bold text-primary mb-2">
                  ارفع صورة {childName || "طفلك"}
                </h2>
                <p className="font-tajawal text-gray-600">
                  سنستخدم هذه الصورة لجعل طفلك بطل القصة
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                    childImageFile
                      ? "border-primary bg-primary/5"
                      : "border-gray-300 hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  {childImagePreview ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="space-y-4"
                    >
                      <img
                        src={childImagePreview}
                        alt="Child preview"
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary"
                      />
                      <div className="flex items-center justify-center text-primary">
                        <Check className="h-5 w-5 ml-2" />
                        <span className="font-reem font-semibold">
                          تم رفع الصورة بنجاح!
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                      </motion.div>
                      <div>
                        <p className="font-reem font-semibold text-gray-700 mb-2">
                          اضغط لرفع الصورة
                        </p>
                        <p className="font-tajawal text-sm text-gray-500">
                          JPG, PNG أو GIF (حد أقصى 5MB)
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>

                <div className="mt-6 p-4 bg-accent1/10 rounded-2xl border border-accent1/20">
                  <div className="flex items-center mb-2">
                    <Camera className="h-5 w-5 text-accent1 ml-2" />
                    <span className="font-reem font-semibold text-accent1">
                      نصائح للحصول على أفضل نتيجة:
                    </span>
                  </div>
                  <ul className="font-tajawal text-sm text-gray-600 space-y-1 pr-4">
                    <li>• استخدم صورة واضحة ومضيئة</li>
                    <li>• تأكد من ظهور وجه الطفل بوضوح</li>
                    <li>• تجنب الخلفيات المعقدة</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📚</div>
                <h2 className="text-2xl font-reem font-bold text-primary mb-2">
                  اختر مغامرة {childName}
                </h2>
                <p className="font-tajawal text-gray-600">
                  أي قصة تريد أن يعيشها طفلك؟
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="mr-3 font-tajawal text-gray-600">
                    جاري تحميل الكتب...
                  </span>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12">
                  <p className="font-tajawal text-gray-600">
                    لا توجد كتب متاحة حالياً
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((book) => (
                    <motion.div
                      key={book.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedBookId(book.id)}
                      className={`cursor-pointer rounded-3xl overflow-hidden shadow-lg transition-all ${
                        selectedBookId === book.id
                          ? "ring-4 ring-primary shadow-xl"
                          : "hover:shadow-xl"
                      }`}
                    >
                      <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-5xl relative">
                        <span className="text-6xl">📖</span>
                        {selectedBookId === book.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-reem font-bold text-gray-800 text-center mb-2">
                          {book.title}
                        </h3>
                        <p className="font-tajawal text-sm text-gray-600 text-center mb-2">
                          {book.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-changa font-bold">
                            {book.price} ر.س
                          </span>
                          <span className="text-xs font-tajawal text-gray-500">
                            {book.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {selectedBook && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center"
                >
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-reem font-bold text-primary mb-2">
                    رائع! ستكون مغامرة مثيرة
                  </h3>
                  <p className="font-tajawal text-gray-600">
                    {childName} سيصبح بطل قصة "{selectedBook.title}"
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-reem font-bold text-primary mb-2">
                  طلب شراء الكتاب المخصص
                </h2>
                <p className="font-tajawal text-gray-600">
                  تم إنشاء التخصيص بنجاح! الآن يمكنك إرسال طلب الشراء للإدارة
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 text-center"
              >
                <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-reem font-bold text-primary mb-2 text-xl">
                  تم إنشاء التخصيص بنجاح!
                </h3>
                <p className="font-tajawal text-gray-600 mb-4">
                  تم تخصيص الكتاب "{selectedBook?.title}" لطفلك {childName}
                </p>
                <p className="font-tajawal text-sm text-gray-500">
                  سيتم مراجعة طلب الشراء من قبل الإدارة وإضافته إلى مكتبتك بعد
                  الموافقة
                </p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={step === 1}
            className={`px-6 py-3 rounded-2xl font-reem font-medium transition-all ${
              step === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            السابق
          </motion.button>

          <div className="text-center">
            <span className="font-tajawal text-gray-500 text-sm">
              الخطوة {step} من 4
            </span>
          </div>

          {step === 4 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreatePurchaseRequest}
              disabled={!isStepComplete(step) || createRequestLoading}
              className={`px-8 py-3 rounded-2xl font-reem font-medium flex items-center transition-all ${
                isStepComplete(step) && !createRequestLoading
                  ? "bg-gradient-to-r from-accent2 to-secondary text-white shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {createRequestLoading ? (
                <>
                  <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 ml-2" />
                  إرسال طلب الشراء
                </>
              )}
            </motion.button>
          ) : step < 3 ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!isStepComplete(step)}
              className={`px-6 py-3 rounded-2xl font-reem font-medium transition-all ${
                isStepComplete(step)
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              التالي
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateStory}
              disabled={!isStepComplete(step) || customizeBookLoading}
              className={`px-8 py-3 rounded-2xl font-reem font-medium flex items-center transition-all ${
                isStepComplete(step) && !customizeBookLoading
                  ? "bg-gradient-to-r from-accent2 to-secondary text-white shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {customizeBookLoading ? (
                <>
                  <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <BookOpen className="h-5 w-5 ml-2" />
                  إنشاء القصة
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryPage;
