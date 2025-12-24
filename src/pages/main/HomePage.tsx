import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Palette, BookOpen, Theater } from "lucide-react";
import AnimatedBackground from "../../components/ui/AnimatedBackground";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnimated, setIsAnimated] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleStartAdventure = () => {
    setIsAnimated(true);
    setTimeout(() => {
      setShowMessage(true);
      setTimeout(() => {
        document
          .getElementById("books-section")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 2000);
    }, 1500);
  };

  const books = [
    {
      id: 1,
      title: "مغامرة في الغابة السحرية",
      color: "from-primary to-accent1",
      emoji: "🌳",
    },
    {
      id: 2,
      title: "رحلة إلى الفضاء",
      color: "from-secondary to-primary",
      emoji: "🚀",
    },
    {
      id: 3,
      title: "قصر الأميرة الصغيرة",
      color: "from-accent2 to-secondary",
      emoji: "👸",
    },
    {
      id: 4,
      title: "عالم البحار العجيب",
      color: "from-accent1 to-accent2",
      emoji: "🐠",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent1/20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-changa font-bold text-primary mb-6"
          >
            مرحبًا بك في عالم كوكو
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-reem text-gray-700 mb-8"
          >
            هل تريد أن تصبح بطل القصة؟
          </motion.p>

          {/* Character Image with Animation */}
          <div className="mb-8 flex justify-center">
            {!isAnimated ? (
              <motion.div
                animate={
                  isAnimated
                    ? { scale: [1, 1.1, 0.9, 0], rotate: [0, -5, 5, 0] }
                    : {}
                }
                transition={{ duration: 1.5 }}
                className="relative"
              >
                <div className="w-64 h-64 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center text-8xl">
                  👦
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative"
              >
                <div className="w-64 h-64 bg-gradient-to-br from-primary/20 to-accent2/20 rounded-full flex items-center justify-center text-8xl relative">
                  👦📚
                  {/* Floating elements around character */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-2xl"
                      style={{
                        top: `${20 + Math.cos((i * Math.PI) / 3) * 40}%`,
                        left: `${20 + Math.sin((i * Math.PI) / 3) * 40}%`,
                      }}
                      animate={{
                        y: [-5, 5, -5],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      {["⭐", "🎈", "✨", "🌟", "💫", "🎭"][i]}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Message after animation */}
          {showMessage && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-lg font-reem text-primary mb-6 bg-white/80 rounded-full px-6 py-3 inline-block"
            >
              مرحبًا يا بطل! لنبدأ مغامرتك الآن
            </motion.p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartAdventure}
              disabled={isAnimated}
              className="bg-gradient-to-r from-primary to-accent1 text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              ابدأ المغامرة
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/books")}
              className="bg-transparent border-2 border-secondary text-secondary px-8 py-4 rounded-full font-reem text-lg font-semibold hover:bg-secondary hover:text-white transition-all"
            >
              استكشف الكتب
            </motion.button>
          </div>
        </div>
      </section>

      {/* Books Preview Section */}
      <section id="books-section" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-changa font-bold text-center text-primary mb-12"
          >
            اكتشف مجموعتنا من القصص الرائعة
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${book.color} p-6 rounded-3xl shadow-lg cursor-pointer`}
                onClick={() => navigate("/books")}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{book.emoji}</div>
                  <h3 className="font-reem font-semibold text-white text-lg">
                    {book.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/books")}
              className="bg-gradient-to-r from-secondary to-accent2 text-white px-8 py-4 rounded-full font-reem text-lg font-semibold shadow-lg"
            >
              عرض جميع الكتب
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-changa font-bold text-center text-primary mb-12"
          >
            لماذا عالم كوكو؟
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: "قصص مخصصة",
                desc: "اجعل طفلك بطل القصة مع صورته الشخصية",
              },
              {
                icon: BookOpen,
                title: "محتوى تعليمي",
                desc: "قصص هادفة تعلم القيم والأخلاق الحميدة",
              },
              {
                icon: Theater,
                title: "تصميم تفاعلي",
                desc: "رسوم ملونة وتفاعلية تجذب انتباه الأطفال",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-3xl shadow-lg"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                      <IconComponent className="text-white" size={32} />
                    </div>
                  </div>
                  <h3 className="font-reem font-semibold text-xl text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-tajawal text-gray-600">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
