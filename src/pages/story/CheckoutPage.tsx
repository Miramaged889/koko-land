import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  ShoppingCart,
  Check,
  Gift,
  Smartphone,
  Globe,
} from "lucide-react";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const orderItems = [
    {
      id: 1,
      title: "قصة مخصصة: مغامرة في الغابة السحرية",
      price: 29.99,
      type: "قصة مخصصة",
      features: ["اسم الطفل: أحمد", "صورة مخصصة", "تسجيل صوتي"],
    },
  ];

  const total = orderItems.reduce((sum, item) => sum + item.price, 0);
  const tax = total * 0.15;
  const finalTotal = total + tax;

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);

      // Redirect to library after success
      setTimeout(() => {
        navigate("/library");
      }, 3000);
    }, 3000);
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
            تم الدفع بنجاح! 🎉
          </h1>

          <p className="font-reem text-gray-600 mb-6">
            شكرًا لك! ستتم إعادة توجيهك إلى مكتبتك لتحميل القصة
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
            خطوة واحدة فقط للحصول على قصة طفلك المخصصة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="h-6 w-6 ml-3 text-primary" />
                ملخص الطلب
              </h2>

              {/* Order Items */}
              <div className="space-y-6">
                {orderItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-2xl p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-reem font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-reem">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="text-2xl font-changa font-bold text-primary">
                          {item.price} ر.س
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <div className="w-2 h-2 bg-accent2 rounded-full ml-3"></div>
                          <span className="font-tajawal">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
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
                className="bg-gradient-to-r from-accent2/10 to-secondary/10 rounded-2xl p-4 mt-6"
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
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-reem font-bold text-gray-800 mb-6 flex items-center">
                <CreditCard className="h-6 w-6 ml-3 text-primary" />
                معلومات الدفع
              </h2>

              {/* Payment Methods */}
              <div className="mb-8">
                <label className="block font-reem font-semibold text-gray-700 mb-4">
                  طريقة الدفع
                </label>
                <div className="space-y-3">
                  {[
                    {
                      id: "card",
                      label: "بطاقة ائتمانية",
                      icon: <CreditCard size={24} />,
                    },
                    {
                      id: "apple",
                      label: "Apple Pay",
                      icon: <Smartphone size={24} />,
                    },
                    {
                      id: "google",
                      label: "Google Pay",
                      icon: <Globe size={24} />,
                    },
                  ].map((method) => (
                    <motion.label
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <span className="ml-3 text-primary">{method.icon}</span>
                      <span className="font-reem font-medium">
                        {method.label}
                      </span>
                      {paymentMethod === method.id && (
                        <Check className="h-5 w-5 text-primary mr-auto" />
                      )}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6 mb-8"
                >
                  <div>
                    <label className="block font-reem font-semibold text-gray-700 mb-2">
                      رقم البطاقة
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-left"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-reem font-semibold text-gray-700 mb-2">
                        تاريخ الانتهاء
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-left"
                      />
                    </div>
                    <div>
                      <label className="block font-reem font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-reem font-semibold text-gray-700 mb-2">
                      اسم حامل البطاقة
                    </label>
                    <input
                      type="text"
                      placeholder="Ahmed Mohammed"
                      className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent font-tajawal text-right"
                    />
                  </div>
                </motion.div>
              )}

              {/* Security Note */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-8">
                <div className="flex items-center mb-2">
                  <Lock className="h-5 w-5 text-accent2 ml-2" />
                  <span className="font-reem font-semibold text-accent2">
                    دفع آمن
                  </span>
                </div>
                <p className="font-tajawal text-sm text-gray-600">
                  معلوماتك محمية بتشفير SSL 256-bit ولن نحتفظ بتفاصيل بطاقتك
                </p>
              </div>

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-reem text-lg font-semibold transition-all ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-accent2 to-secondary text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white ml-3"></div>
                    جاري المعالجة...
                  </div>
                ) : (
                  `ادفع ${finalTotal.toFixed(2)} ر.س`
                )}
              </motion.button>

              <p className="font-tajawal text-xs text-gray-500 text-center mt-4">
                بالنقر على "ادفع"، فإنك توافق على شروط وأحكام الخدمة
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
